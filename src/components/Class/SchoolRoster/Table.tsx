import {
    useGetPaginatedElgibleStudents,
    useGetPaginatedElgibleTeachers,
} from "@/api/classes";
import { useAddUsersToClass } from "@/api/classRoster";
import { buildOrganizationUserSearchFilter } from "@/operations/queries/getPaginatedOrganizationUsers";
import {
    DEFAULT_ROWS_PER_PAGE,
    getTableLocalization,
    pageChangeToDirection,
    ServerCursorPagination,
    tableToServerOrder,
} from "@/utils/table";
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
    CursorTable,
    FullScreenDialog,
} from "kidsloop-px";
import {
    Order,
    TableColumn,
} from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";
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
    refetchClassRoster: () => void;
}

export default function SchoolRoster (props: Props) {
    const {
        open,
        onClose,
        classId,
        refetchClassRoster,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const [ selectedIds, setSelectedIds ] = useState<string[]>([]);
    const [ addUsersToClass ] = useAddUsersToClass();
    const [ subgroupBy, setSubgroupBy ] = useState(`Student`);
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `givenName`,
    });

    const paginationFilter = buildOrganizationUserSearchFilter(serverPagination.search);
    const {
        data: studentsData,
        refetch: refetchStudents,
        loading: loadingStudents,
    } = useGetPaginatedElgibleStudents({
        variables: {
            classId: classId,
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: `no-cache`,
        skip: !classId || !open || subgroupBy !== `Student`,
    });

    const {
        data: teachersData,
        refetch: refetchTeachers,
        loading: loadingTeachers,
    } = useGetPaginatedElgibleTeachers({
        variables: {
            classId: classId,
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        },
        notifyOnNetworkStatusChange: true,
        skip: !classId || !open || subgroupBy !== `Teacher`,
    });

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

        const studentIds = selectedIds.filter((id: string) => id.match(/-student/gi)).map((id: string) => (id.replace(/-student/gi, ``)));
        const teacherIds = selectedIds.filter((id: string) => id.match(/-teacher/gi)).map((id: string) => (id.replace(/-teacher/gi, ``)));

        await addUsersToClass({
            variables: {
                classId,
                studentIds,
                teacherIds,
            },
        });

        refetchClassRoster();
        onClose();
    };

    useEffect(() => {
        const refetch = subgroupBy === `Student` ? refetchStudents : refetchTeachers;
        refetch({
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        });
    }, [
        serverPagination.search,
        serverPagination.order,
        serverPagination.orderBy,
        serverPagination.rowsPerPage,
        subgroupBy,
    ]);

    const handleTableChange = (tableData: CursorTableData<ClassRosterRow>) => {
        setSubgroupBy(tableData?.subgroupBy as string);
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });
    };

    const handlePageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);
        const refetch = subgroupBy === `Student` ? refetchStudents : refetchTeachers;
        await refetch({
            count,
            cursor,
            direction,
        });
    };

    const data = subgroupBy === `Student` ? studentsData?.eligibleStudentsConnection : teachersData?.eligibleTeachersConnection;
    const rows = data?.edges.map((edge) => ({
        id: `${edge.node.id}-${subgroupBy}`,
        givenName: edge.node.givenName ?? ``,
        familyName: edge.node.familyName ?? ``,
        role: subgroupBy,
        email: edge.node.contactInfo?.email ?? ``,
        phoneNumber: edge.node.contactInfo?.phone ?? ``,
        organizationRoles: edge.node.roles?.map(role => role.name ?? ``) ?? [],
    })) ?? [];

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
                <CursorTable
                    hideAllGroupTab
                    hideSelectAll
                    selectedRows={selectedIds}
                    columns={columns}
                    rows={rows}
                    idField="id"
                    groupBy="role"
                    showSelectables={true}
                    loading={subgroupBy === `Student` ?
                        loadingStudents :
                        loadingTeachers
                    }
                    orderBy="givenName"
                    order="asc"
                    subgroupBy={subgroupBy}
                    hasNextPage={subgroupBy === `Student` ?
                        studentsData?.eligibleStudentsConnection.pageInfo.hasNextPage :
                        teachersData?.eligibleTeachersConnection.pageInfo.hasNextPage
                    }
                    hasPreviousPage={subgroupBy === `Student` ?
                        studentsData?.eligibleStudentsConnection.pageInfo.hasPreviousPage :
                        teachersData?.eligibleTeachersConnection.pageInfo.hasPreviousPage
                    }
                    total={subgroupBy === `Student` ?
                        studentsData?.eligibleStudentsConnection.totalCount :
                        teachersData?.eligibleTeachersConnection.totalCount
                    }
                    startCursor={subgroupBy === `Student` ?
                        studentsData?.eligibleStudentsConnection.pageInfo.startCursor :
                        teachersData?.eligibleTeachersConnection.pageInfo.startCursor
                    }
                    endCursor={subgroupBy === `Student` ?
                        studentsData?.eligibleStudentsConnection.pageInfo.endCursor :
                        teachersData?.eligibleTeachersConnection.pageInfo.endCursor
                    }
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
                    onChange={handleTableChange}
                    onPageChange={handlePageChange}
                />
            </Paper>
        </FullScreenDialog>
    );
}
