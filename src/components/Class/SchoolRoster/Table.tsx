import {
    ClassUser,
    useAddUsersToClass,
    useGetClassRosterEligibleUsers,
} from "@/api/classRoster";
import { getTableLocalization } from "@/utils/table";
import {
    createStyles,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    FullScreenDialog,
    PageTable,
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

interface ClassRosterRow {
    id: string;
    username: string | undefined;
    role: string;
    email: string;
    phoneNumber: string | null;
}

interface Props {
    open: boolean;
    onClose: () => void;
    classId: string;
    organizationId: string;
    existingStudents: string[];
    existingTeachers: string[];
    refetchClassRoster: () => void;
}

export default function SchoolRoster (props: Props) {
    const {
        open,
        onClose,
        classId,
        organizationId,
        existingStudents,
        existingTeachers,
        refetchClassRoster,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const [ selectedIds, setSelectedIds ] = useState<string[]>([]);
    const [ addUsersToClass ] = useAddUsersToClass();

    const { data } =  useGetClassRosterEligibleUsers({
        variables: {
            class_id: classId,
            organization_id: organizationId,
        },
        fetchPolicy: `network-only`,
    });

    const students = data?.class
        ?.eligibleStudents?.filter((student: ClassUser) => existingStudents.indexOf(`${student.user_id}-student`) === -1)
        .map((student: ClassUser) => ({
            id: `${student.user_id}-student`,
            username: student.user_name,
            role: `Student`,
            email: student.email,
            phoneNumber: student.phone,
        }));
    const teachers = data?.class
        ?.eligibleTeachers?.filter((teacher: ClassUser) => existingTeachers.indexOf(`${teacher.user_id}-teacher` as string) === -1)
        .map((teacher: ClassUser) => ({
            id: `${teacher.user_id}-teacher`,
            username: teacher.user_name,
            role: `Teacher`,
            email: teacher.email,
            phoneNumber: teacher.phone,
        }));

    const rows = teachers && students ? [ ...students, ...teachers ] : [];
    const roles = [ `Student`, `Teacher` ];
    const columns: TableColumn<ClassRosterRow>[] = [
        {
            id: `id`,
            label: intl.formatMessage({
                id: `generic_idLabel`,
            }),
            hidden: true,
        },
        {
            id: `username`,
            label: intl.formatMessage({
                id: `schools_userNameLabel`,
            }),
            persistent: true,
        },
        {
            id: `role`,
            label: intl.formatMessage({
                id: `schools_roleLabel`,
            }),
            groups: roles.map((role) => ({
                text: role,
            })),
        },
        {
            id: `email`,
            label: intl.formatMessage({
                id: `schools_emailLabel`,
            }),
            disableSort: true,
        },
        {
            id: `phoneNumber`,
            label: intl.formatMessage({
                id: `schools_phoneLabel`,
            }),
        },
    ];

    const addUsers = async () => {
        if (!selectedIds.length) {
            return;
        }

        let studentIds = selectedIds.filter((id: string) => id.match(/-student/gi));
        studentIds = [ ...existingStudents, ...studentIds ].map((id: string) => (id.replace(`-student`, ``)));

        let teacherIds = selectedIds.filter((id: string) => id.match(/-teacher/gi));
        teacherIds = [ ...existingTeachers, ...teacherIds ].map((id: string) => (id.replace(`-teacher`, ``)));

        await addUsersToClass({
            variables: {
                class_id: classId,
                student_ids: studentIds,
                teacher_ids: teacherIds,
            },
        });

        refetchClassRoster();
        onClose();
    };

    return (
        <FullScreenDialog
            open={open}
            title={intl.formatMessage({
                id: `schools_addUserTitle`,
            })}
            action={{
                label: intl.formatMessage({
                    id: `schools_addLabel`,
                }),
                onClick: addUsers,
            }
            }
            onClose={() => {
                onClose();
            }}
        >
            <Paper className={classes.root}>
                <PageTable
                    columns={columns}
                    rows={rows}
                    idField="id"
                    groupBy="role"
                    showSelectables={true}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `schools_schoolRosterLabel`,
                            }),
                        },
                        search: {
                            placeholder: intl.formatMessage({
                                id: `schoolRoster_searchPlaceholder`,
                            }),
                        },
                        body: {
                            noData: intl.formatMessage({
                                id: `classes_noRecords`,
                            }),
                        },
                    })}
                    onSelected={(rows) => setSelectedIds(rows as string[])}
                />
            </Paper>
        </FullScreenDialog>
    );
}
