import {
    useGetPaginatedElgibleStudents,
    useGetPaginatedElgibleTeachers,
} from "@/api/classes";
import { useAddStudentsToClass, useAddTeachersToClass, useAddUsersToClass } from "@/api/classRoster";
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
    CursorTable,
    FullScreenDialog,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import {
    Order,
    TableColumn,
} from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Head";
import { PageChange } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Pagination/shared";
import { CursorTableData } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Cursor/Table";
import {
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import {
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
    contactInfo: string;
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
    const [ addStudentsToClass ] = useAddStudentsToClass();
    const [ addTeachersToClass ] = useAddTeachersToClass();
    const [ subgroupBy, setSubgroupBy ] = useState(`Student`);
    const { enqueueSnackbar } = useSnackbar();
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
        const variables = { classId };

        try {
            switch (`${studentIds.length > 0}-${teacherIds.length > 0}`) {
                case `true-false`:
                    await addStudentsToClass({
                        variables: {
                            ...variables,
                            studentIds,
                        }
                    });
                    break;
                case `false-true`:
                    await addTeachersToClass({
                        variables: {
                            ...variables,
                        teacherIds,
                        }
                    });
                    break;
                default:
                    await addUsersToClass({
                        variables: {
                            ...variables,
                            studentIds,
                            teacherIds,
                        }
                    });
                }

                enqueueSnackbar(intl.formatMessage({
                    id: `createUser_userCsvUploadSuccess`,
                }), {
                    variant: `success`,
                });

            } catch(err) {
                enqueueSnackbar(intl.formatMessage({
                    id: `createUser_error`,
                }), {
                    variant: `error`,
                });
            }

        setSelectedIds([]);
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

    useEffect(() => {
        if (!open) {
            setSelectedIds([]);
        }
    }, [open]);

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
        contactInfo: edge.node.contactInfo?.email || edge.node.contactInfo?.phone || ``,
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
            <CursorTable
                hideAllGroupTab
                showSelectables
                selectedRows={selectedIds}
                columns={columns}
                rows={rows}
                idField="id"
                groupBy="role"
                loading={subgroupBy === `Student` ?
                    loadingStudents :
                    loadingTeachers
                }
                orderBy="givenName"
                order="asc"
                subgroupBy={subgroupBy}
                hasNextPage={subgroupBy === `Student` ?
                    studentsData?.eligibleStudentsConnection?.pageInfo?.hasNextPage :
                    teachersData?.eligibleTeachersConnection?.pageInfo?.hasNextPage
                }
                hasPreviousPage={subgroupBy === `Student` ?
                    studentsData?.eligibleStudentsConnection?.pageInfo?.hasPreviousPage :
                    teachersData?.eligibleTeachersConnection?.pageInfo?.hasPreviousPage
                }
                total={subgroupBy === `Student` ?
                    studentsData?.eligibleStudentsConnection?.totalCount :
                    teachersData?.eligibleTeachersConnection?.totalCount
                }
                startCursor={subgroupBy === `Student` ?
                    studentsData?.eligibleStudentsConnection?.pageInfo?.startCursor :
                    teachersData?.eligibleTeachersConnection?.pageInfo?.startCursor
                }
                endCursor={subgroupBy === `Student` ?
                    studentsData?.eligibleStudentsConnection?.pageInfo?.endCursor :
                    teachersData?.eligibleTeachersConnection?.pageInfo?.endCursor
                }
                localization={getTableLocalization(intl, {
                    title: intl.formatMessage({
                        id: `schools_schoolRosterLabel`,
                    }),
                    placeholder: intl.formatMessage({
                        id: `schoolRoster_searchPlaceholder`,
                    }),
                })}
                onSelected={(rows) => setSelectedIds(rows as string[])}
                onChange={handleTableChange}
                onPageChange={handlePageChange}
            />
        </FullScreenDialog>
    );
}
