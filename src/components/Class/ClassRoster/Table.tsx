import {
    ClassUser,
    useDeleteClassStudent,
    useDeleteClassTeacher,
    useGetClassRoster,
} from "@/api/classRoster";
import { currentMembershipVar } from "@/cache";
import SchoolRoster from "@/components/Class/SchoolRoster/Table";
import {
    Class,
    Status,
} from "@/types/graphQL";
import { getTableLocalization } from "@/utils/table";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client/react";
import {
    Box,
    Chip,
    createStyles,
    DialogContentText,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon,
} from "@material-ui/icons";
import {
    FullScreenDialog,
    PageTable,
    usePrompt,
    UserAvatar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import React,
{ useState } from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
    },
    userName: {
        marginLeft: theme.spacing(2),
    },
    chip: {
        margin: theme.spacing(0.25),
    },
}));

interface Props {
    open: boolean;
    onClose: () => void;
    classItem: Class;
    organizationId: string;
}

export default function ClassRoster (props: Props) {
    const {
        open,
        onClose,
        classItem,
        organizationId,
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const [ schoolRosterDialogOpen, setSchoolRosterDialogOpen ] = useState(false);
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const { required, equals } = useValidations();
    const [ deleteStudent ] = useDeleteClassStudent();
    const [ deleteTeacher ] = useDeleteClassTeacher();
    const {
        data,
        refetch,
    } = useGetClassRoster({
        fetchPolicy: `network-only`,
        variables: {
            class_id: classItem.class_id,
            organization_id,
        },
    });

    let classInfo = data?.class || {
        students: [],
        teachers: [],
    };

    classInfo = {
        students: classInfo.students
            ?.filter((user) => user?.membership?.status === Status.ACTIVE)
            .map((user: ClassUser) => ({
                ...user,
                name: `${user.given_name} ${user.family_name}`,
                role: `Student`,
                user_id: `${user.user_id}-student`,
                subjectsTeaching: user.subjectsTeaching,
                alternate_phone: user.alternate_phone,
            })),
        teachers: classInfo.teachers
            ?.filter((user) => user?.membership?.status === Status.ACTIVE)
            .map((user: ClassUser) => ({
                ...user,
                name: `${user.given_name} ${user.family_name}`,
                role: `Teacher`,
                user_id: `${user.user_id}-teacher`,
                subjectsTeaching: user.subjectsTeaching,
                alternate_phone: user.alternate_phone,
            })),
    };

    const rows: ClassUser[] = [ ...classInfo.students, ...classInfo.teachers ];
    const roles = [ `Student`, `Teacher` ];
    const columns: TableColumn<ClassUser>[] = [
        {
            id: `user_id`,
            label: intl.formatMessage({
                id: `generic_idLabel`,
            }),
            hidden: true,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `class_nameLabel`,
            }),
            persistent: true,
            render: (row) => (
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                >
                    <UserAvatar
                        name={row.name ?? ``}
                        size="small"
                    />
                    <span className={classes.userName}>{row.name}</span>
                </Box>
            ),
        },
        {
            id: `role`,
            label: intl.formatMessage({
                id: `class_roleLabel`,
            }),
            groups: roles.map((role) => ({
                text: role,
            })),
        },
        {
            id: `email`,
            label: intl.formatMessage({
                id: `class_emailLabel`,
            }),
            disableSort: true,
        },
        {
            id: `alternate_phone`,
            label: intl.formatMessage({
                id: `class_phoneLabel`,
            }),
        },
        {
            id: `subjectsTeaching`,
            label: `Subjects`,
            render: (row) => (
                <>
                    {row.subjectsTeaching.map((subject, i) => (
                        <Chip
                            key={`subject-${i}`}
                            label={subject.name}
                            className={classes.chip} />
                    ))}
                </>
            ),
        },
    ];

    const findClass = (row: ClassUser) => rows.find((user) => user.user_id === row.user_id);

    const handleRemoveUser = async (row: ClassUser) => {
        const selectedUser = findClass(row);
        if (!selectedUser) return;

        const { name, email } = selectedUser;

        if (
            !(await prompt({
                variant: `error`,
                title: intl.formatMessage({
                    id: `class_removeUserLabel`,
                }),
                okLabel: intl.formatMessage({
                    id: `class_removeConfirm`,
                }),
                content: (
                    <>
                        <DialogContentText>
                            {intl.formatMessage({
                                id: `classRoster_deletePrompt`,
                            }, {
                                value: name || email,
                            })}
                        </DialogContentText>
                        <DialogContentText>
                            <FormattedMessage
                                id="generic_typeToRemovePrompt"
                                values={{
                                    value: <strong>{name}</strong>,
                                }}
                            />
                        </DialogContentText>
                    </>
                ),
                validations: [ required(), equals(name || email) ],
            }))
        )
            return;

        const deleteProps = {
            variables: {
                class_id: classItem.class_id,
                user_id: selectedUser.user_id.replace(`-student`, ``).replace(`-teacher`, ``),
            },
        };

        if (selectedUser.role === `Student`) {
            await deleteStudent(deleteProps);
        } else {
            await deleteTeacher(deleteProps);
        }

        refetch();
    };

    return (
        <FullScreenDialog
            open={open}
            title={intl.formatMessage({
                id: `class_classRosterLabel`,
            })}
            onClose={() => {
                onClose();
            }}
        >
            <Paper className={classes.root}>
                <PageTable
                    columns={columns}
                    rows={rows}
                    idField="user_id"
                    orderBy="name"
                    order="asc"
                    groupBy="role"
                    primaryAction={{
                        label: `Add User`,
                        icon: PersonAddIcon,
                        // disabled: !canCreate,
                        onClick: () => setSchoolRosterDialogOpen(true),
                    }}
                    rowActions={(row) => [
                        {
                            label: intl.formatMessage({
                                id: `class_removeUserLabel`,
                            }),
                            icon: DeleteIcon,
                            onClick: () => handleRemoveUser(row),
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: classItem.class_name ?? ``,
                        },
                        search: {
                            placeholder: intl.formatMessage({
                                id: `class_searchPlaceholder`,
                            }),
                        },
                        body: {
                            noData: intl.formatMessage({
                                id: `classes_noRecords`,
                            }),
                        },
                    })}
                />
            </Paper>

            {classItem &&
                <SchoolRoster
                    open={schoolRosterDialogOpen}
                    refetchClassRoster={refetch}
                    classId={classItem.class_id}
                    existingStudents={classInfo.students.map((user: ClassUser) => user.user_id)}
                    existingTeachers={classInfo.teachers.map((user: ClassUser) => user.user_id)}
                    organizationId={organizationId}
                    onClose={() => {
                        refetch();
                        setSchoolRosterDialogOpen(false);
                    }}
                />
            }
        </FullScreenDialog>
    );
}
