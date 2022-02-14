import {
    useAddUsersToClass,
    useGetClassRosterEligibleUsers,
} from "@/api/classRoster";
import {
    Role,
    Status,
} from "@/types/graphQL";
import { getTableLocalization } from "@/utils/table";
import { getCustomRoleName } from "@/utils/userRoles";
import {
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
    givenName: string | undefined;
    familyName: string | undefined;
    role: string;
    email: string;
    phoneNumber: string | null;
    organizationRoles: string[];
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
        skip: !classId || !organizationId,
    });

    const students = data?.class
        ?.eligibleStudents?.filter((student) => existingStudents.indexOf(`${student.user_id}-student`) === -1)
        .filter((student) => student.membership?.status === Status.ACTIVE)
        .map((student) => ({
            id: `${student.user_id}-student`,
            givenName: student.given_name ?? ``,
            familyName: student.family_name ?? ``,
            role: `Student`,
            email: student.email,
            phoneNumber: student.phone,
            organizationRoles: student.membership.roles?.map(role => role.role_name ?? ``) ?? [],
        }));
    const teachers = data?.class
        ?.eligibleTeachers?.filter((teacher) => existingTeachers.indexOf(`${teacher.user_id}-teacher` as string) === -1)
        .filter((teacher) => teacher.membership?.status === Status.ACTIVE)
        .map((teacher) => ({
            id: `${teacher.user_id}-teacher`,
            givenName: teacher.given_name ?? ``,
            familyName: teacher.family_name ?? ``,
            role: `Teacher`,
            email: teacher.email,
            phoneNumber: teacher.phone,
            organizationRoles: teacher.membership.roles?.map(role => role.role_name ?? ``) ?? [],
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
            id: `givenName`,
            label: intl.formatMessage({
                id: `users_firstName`,
            }),
            persistent: true,
        },
        {
            id: `familyName`,
            label: intl.formatMessage({
                id: `users_lastName`,
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
                value: role,
            })),
            disableSort: true,
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
            disableSort: true,
        },
        {
            id: `organizationRoles`,
            label: intl.formatMessage({
                id: `organization.roles`,
            }, {
                count: 2,
            }),
            render: (row) => row?.organizationRoles?.map((role, i) => (
                <Typography
                    key={`role-${i}`}
                    noWrap
                    variant="body2"
                >
                    {getCustomRoleName(intl, role)}
                </Typography>
            )),
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
                    selectedRows={selectedIds}
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
