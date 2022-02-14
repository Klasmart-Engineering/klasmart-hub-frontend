import {
    ClassUser,
    useGetClassRoster,
    useRemoveClassStudent,
    useRemoveClassTeacher,
} from "@/api/classRoster";
import SchoolRoster from "@/components/Class/SchoolRoster/Table";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Status } from "@/types/graphQL";
import { getTableLocalization } from "@/utils/table";
import { getCustomRoleName } from "@/utils/userRoles";
import { useValidations } from "@/utils/validations";
import {
    Delete as DeleteIcon,
    PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import {
    Box,
    DialogContentText,
    Paper,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
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
}));

interface Props {
    open: boolean;
    onClose: () => void;
    classId?: string;
    className?: string;
    organizationId: string;
}

export default function ClassRoster (props: Props) {
    const {
        open,
        onClose,
        classId,
        organizationId,
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const [ schoolRosterDialogOpen, setSchoolRosterDialogOpen ] = useState(false);
    const currentOrganization = useCurrentOrganization();
    const { required, equals } = useValidations();
    const [ removeStudent ] = useRemoveClassStudent();
    const [ removeTeacher ] = useRemoveClassTeacher();
    const {
        data,
        refetch,
    } = useGetClassRoster({
        fetchPolicy: `network-only`,
        variables: {
            class_id: classId ?? ``,
            organization_id: currentOrganization?.organization_id ?? ``,
        },
        skip: !classId,
    });

    let classInfo = data?.class || {
        class_name: ``,
        students: [],
        teachers: [],
    };

    classInfo = {
        students: classInfo.students
            ?.filter((user) => user?.membership?.status === Status.ACTIVE)
            .map((user: ClassUser) => ({
                ...user,
                role: `Student`,
                user_id: `${user.user_id}-student`,
                organizationRoles: user.membership.roles?.map((role) => (
                    role.role_name ?? ``
                )) ?? [],
                contactInfo: user.email || user.phone || ``,
            })),
        teachers: classInfo.teachers
            ?.filter((user) => user?.membership?.status === Status.ACTIVE)
            .map((user: ClassUser) => ({
                ...user,
                role: `Teacher`,
                user_id: `${user.user_id}-teacher`,
                organizationRoles: user.membership.roles?.map((role) => (
                    role.role_name ?? ``
                )) ?? [],
                contactInfo: user.email || user.phone || ``,
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
            id: `given_name`,
            label: intl.formatMessage({
                id: `users_firstName`,
            }),
            persistent: true,
            render: (row) => (
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                >
                    <UserAvatar
                        name={`${row.given_name} ${row.family_name}`}
                        size="small"
                    />
                    <span className={classes.userName}>{row.given_name}</span>
                </Box>
            ),
        },
        {
            id: `family_name`,
            label: intl.formatMessage({
                id: `users_lastName`,
            }),
        },
        {
            id: `role`,
            label: intl.formatMessage({
                id: `class_roleLabel`,
            }),
            groups: roles.map((role) => ({
                text: role,
                value: role,
            })),
        },
        {
            id: `contactInfo`,
            label: intl.formatMessage({
                id: `users_contactInfo`,
            }),
            disableSort: true,
        },
        {
            id: `organizationRoles`,
            label: intl.formatMessage({
                id: `organization.roles`,
            }, {
                count: 2,
            }),
            render: (row) => row.organizationRoles.map((roleName, i) => (
                <Typography
                    key={`role-${i}`}
                    noWrap
                    variant="body2"
                >
                    {getCustomRoleName(intl, roleName)}
                </Typography>
            )),
        },
    ];

    const findClass = (row: ClassUser) => rows.find((user) => user.user_id === row.user_id);

    const handleRemoveUser = async (row: ClassUser) => {
        const selectedUser = findClass(row);
        if (!selectedUser) return;

        const userName = `${row.given_name} ${row.family_name}`.trim();

        if (!(await prompt({
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
                            value: userName,
                        })}
                    </DialogContentText>
                    <DialogContentText>
                        <FormattedMessage
                            id="generic_typeToRemovePrompt"
                            values={{
                                value: <strong>{userName}</strong>,
                            }}
                        />
                    </DialogContentText>
                </>
            ),
            validations: [ required(), equals(userName) ],
        }))) return;

        const removeProps = {
            variables: {
                class_id: classId ?? ``,
                user_id: selectedUser.user_id.replace(`-student`, ``).replace(`-teacher`, ``),
            },
        };

        if (selectedUser.role === `Student`) {
            await removeStudent(removeProps);
        } else {
            await removeTeacher(removeProps);
        }

        refetch();
    };

    return (
        <FullScreenDialog
            open={open}
            title={data?.class?.class_name ?? ``}
            onClose={() => {
                onClose();
            }}
        >
            <Paper className={classes.root}>
                <PageTable
                    columns={columns}
                    rows={rows}
                    idField="user_id"
                    orderBy="given_name"
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
                            title: intl.formatMessage({
                                id: `class_classRosterLabel`,
                            }),
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

            {classId &&
                <SchoolRoster
                    open={schoolRosterDialogOpen}
                    refetchClassRoster={refetch}
                    classId={classId}
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
