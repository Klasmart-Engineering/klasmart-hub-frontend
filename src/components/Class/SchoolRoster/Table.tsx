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
    });

    const students = data?.class
        ?.eligibleStudents?.filter((student: ClassUser) => student.school_memberships?.length)
        .filter((student: ClassUser) => existingStudents.indexOf(`${student.user_id}-student`) === -1)
        .map((student: ClassUser) => ({
            id: `${student.user_id}-student`,
            username: student.user_name,
            role: `Student`,
            email: student.email,
            phoneNumber: student.phone,
        }));
    const teachers = data?.class
        ?.eligibleTeachers?.filter((teacher: ClassUser) => teacher.school_memberships?.length)
        .filter((teacher: ClassUser) => existingTeachers.indexOf(`${teacher.user_id}-teacher` as string) === -1)
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
            label: `Id`,
            hidden: true,
        },
        {
            id: `username`,
            label: `User name`,
            persistent: true,
        },
        {
            id: `role`,
            label: `Role`,
            groups: roles.map((role) => ({
                text: role,
            })),
        },
        {
            id: `email`,
            label: `Email`,
            disableSort: true,
        },
        {
            id: `phoneNumber`,
            label: `Phone number`,
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
            title="Add User"
            action={{
                label: `Add`,
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
                    showCheckboxes={true}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: `School Roster`,
                        },
                        search: {
                            placeholder: `Search for students by their  names,  address, email and phone number`,
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
