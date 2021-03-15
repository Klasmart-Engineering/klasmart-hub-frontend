import {
    ClassUser,
    useDeleteClassStudent,
    useDeleteClassTeacher,
    useGetClassRoster,
} from "@/api/classRoster";
import SchoolRoster from "@/components/Class/SchoolRoster/Table";
import { getTableLocalization } from "@/utils/table";
import { useValidations } from "@/utils/validations";
import {
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
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import React,
{ useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: `100%`,
        },
    }));

interface Props {
    onClose: () => void;
    classId: string;
    organizationId: string;
}

export default function ClassRoster (props: Props) {
    const {
        onClose,
        classId,
        organizationId,
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const [ schoolRosterDialogOpen, setSchoolRosterDialogOpen ] = useState(false);
    const { required, equals } = useValidations();
    const [ deleteStudent ] = useDeleteClassStudent();
    const [ deleteTeacher ] = useDeleteClassTeacher();
    const {
        data,
        refetch,
    } = useGetClassRoster({
        variables: {
            class_id: classId,
        },
    });

    let classInfo = data?.class || {
        students: [],
        teachers: [],
    };

    classInfo = {
        students: classInfo.students.map((user: ClassUser) => ({
            ...user,
            role: `Student`,
            user_id: `${user.user_id}-student`,
        })),
        teachers: classInfo.teachers.map((user: ClassUser) => ({
            ...user,
            role: `Teacher`,
            user_id: `${user.user_id}-teacher`,
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
            id: `username`,
            label: intl.formatMessage({
                id: `class_usernameLabel`,
            }),
            persistent: true,
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
            id: `phone`,
            label: intl.formatMessage({
                id: `class_phoneLabel`,
            }),
        },
    ];

    const findClass = (row: ClassUser) => rows.find((user) => user.user_id === row.user_id);

    const handleRemoveUser = async (row: ClassUser) => {
        const selectedUser = findClass(row);
        if (!selectedUser) return;

        const { username, email } = selectedUser;

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
                            Are you sure you want to remove {`"${username || email}"`} from the class?
                        </DialogContentText>
                        <DialogContentText>
                            Type <strong>{username}</strong> to confirm removing.
                        </DialogContentText>
                    </>
                ),
                validations: [ required(), equals(username || email) ],
            }))
        )
            return;

        const deleteProps = {
            variables: {
                class_id: classId,
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
            open={true}
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
                            title: `Actual Class Name`,
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
