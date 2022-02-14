import {
    useGetPaginatedOrganizationMemberships,
    UserEdge,
} from "@/api/organizationMemberships";
import {
    useDeleteRole,
    useReplaceRole,
} from "@/api/roles";
import { Role } from "@/components/Role/Dialog/CreateEdit";
import RolePermissionsActionsCard from "@/components/Role/PermissionsActions";
import { RoleRow } from "@/components/Role/Table";
import { UserRow } from "@/components/User/Table";
import {
    buildOrganizationUserFilter,
    buildOrganizationUserFilters,
} from "@/operations/queries/getPaginatedOrganizationUsers";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Status } from "@/types/graphQL";
import { sortSchoolNames } from "@/utils/schools";
import {
    DEFAULT_ROWS_PER_PAGE,
    getTableLocalization,
    pageChangeToDirection,
    ServerCursorPagination,
    tableToServerOrder,
} from "@/utils/table";
import { sortRoleNames } from "@/utils/userRoles";
import { useValidations } from "@/utils/validations";
import { ApolloQueryResult } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    LinearProgress,
    Paper,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import { Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import {
    CursorTable,
    Fab,
    useConfirm,
    UserAvatar,
    useSnackbar,
} from "kidsloop-px";
import {
    Filter,
    TableFilter,
} from "kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import {
    Order,
    TableColumn,
} from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import React, {
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: `100%`,
        },
        menuContainer: {
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(2, 2),
            },
        },
        avatar: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            color: `white`,
            marginRight: 16,
            fontSize: 10,
        },
        appBar: {
            position: `relative`,
        },
        title: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(1),
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
    }));

const motion = React.forwardRef(function Transition (props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>) {
    return (
        <Grow
            ref={ref}
            style={{
                transformOrigin: `0 0 0`,
            }}
            {...props}
        />
    );
});

export interface DeleteRoleUserRow extends UserRow {
    newRoleId: string;
    gender: string;
    userShortCode: string;
}

export const mapDeleteRoleUserRow = (edge: UserEdge) => {
    const user = edge.node;
    return {
        id: user.id,
        givenName: user.givenName ?? ``,
        familyName: user.familyName ?? ``,
        avatar: user.avatar ?? ``,
        email: user.contactInfo.email ?? ``,
        phone: user.contactInfo.phone ?? ``,
        roleNames: user.roles.filter((role) => role.status === Status.ACTIVE && !!role.organizationId).map((role) => role.name).sort(sortRoleNames),
        schoolNames: user.schools.filter((school) => school.status === Status.ACTIVE).map((school) => school.name).sort(sortSchoolNames),
        status: user.organizations?.[0].userStatus,
        joinDate: new Date(user.organizations?.[0].joinDate),
        newRoleId: ``,
        gender: user.gender ?? ``,
        userShortCode: user.organizations[0].userShortCode ?? ``,
    };
};

interface Props {
    open: boolean;
    handleClose: () => void;
    row: RoleRow;
    roles: Role[];
    getAllRolesLoading: boolean;
    refetch: (variables?: Partial<{ organization_id: string }> | undefined) => Promise<ApolloQueryResult<any>>;
}

export default function DeleteRoleDialog (props: Props) {
    const {
        open,
        handleClose,
        row,
        roles,
        getAllRolesLoading,
        refetch,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const confirm = useConfirm();
    const { enqueueSnackbar } = useSnackbar();
    const [ roleId, setRoleId ] = useState(``);
    const [ rows, setRows ] = useState<DeleteRoleUserRow[]>([]);
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;
    const { required } = useValidations();
    const [ tableFilters, setTableFilters ] = useState<Filter[]>([]);
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `givenName`,
    });
    const [ deleteRole ] = useDeleteRole();
    const [ replaceRole ] = useReplaceRole();

    const STATUS_FILTER = {
        columnId: `status`,
        operatorValue: `eq`,
        values: [ `active` ],
    };

    const ROLE_FILTER = {
        columnId: `roleNames`,
        operatorValue: `eq`,
        values: [ row.id ],
    };

    const paginationFilter = buildOrganizationUserFilter({
        organizationId,
        search: serverPagination.search,
        filters: buildOrganizationUserFilters([
            ...tableFilters,
            STATUS_FILTER,
            ROLE_FILTER,
        ]),
    });

    const {
        data: usersData,
        refetch: refetchUsers,
        fetchMore: fetchMoreUsers,
        loading: loadingOrganizationMemberships,
    } = useGetPaginatedOrganizationMemberships({
        variables: {
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        },
        notifyOnNetworkStatusChange: true,
        context: {
            requestTrackerId: `UsersPage`,
        },
    });

    const pageInfo = usersData?.usersConnection.pageInfo;

    const onPageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);
        await fetchMoreUsers({
            variables: {
                count,
                cursor,
                direction,
            },
        });
    };

    const onTableChange = (tableData: CursorTableData<UserRow>) => {
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });
        setTableFilters(tableData?.filters ?? []);
    };

    useEffect(() => {
        refetchUsers({
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
        tableFilters,
        currentOrganization?.organization_id,
    ]);

    useEffect(() => {
        const rows = usersData?.usersConnection.edges?.map(mapDeleteRoleUserRow);
        setRows(rows ?? []);
    }, [ usersData ]);

    useEffect(() => {
        if (!open) {
            setRoleId(``);
        }
    }, [ open ]);

    const reAssignAllUsersHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRows = [ ...rows ];

        newRows.forEach((user) => {
            setRoleId(event.target.value);
            user.newRoleId = event.target.value;
        });

        setRows(newRows);
    };

    const deleteRoleHandler = async () => {
        try {
            if (
                !(await confirm({
                    variant: `error`,
                    title: `Delete Role?`,
                    content: `Deleting a Role will permanently remove it from your organization`,
                    okLabel: `Delete Role`,
                }))
            ) {
                return;
            }

            if (rows.length) {
                await replaceRole({
                    variables: {
                        oldRoleId: row.id,
                        newRoleId: roleId,
                        organizationId,
                    },
                });
            }

            await deleteRole({
                variables: {
                    role_id: row.id,
                },
            });

            await refetch();
            enqueueSnackbar(`The role has been deleted successfully`, {
                variant: `success`,
            });
            handleClose();
        } catch (e) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    const columns: TableColumn<UserRow>[] = [
        {
            id: `id`,
            label: `ID`,
            disableSort: true,
            secret: true,
        },
        {
            id: `givenName`,
            persistent: true,
            label: intl.formatMessage({
                id: `users_firstName`,
            }),
            render: (row) => (
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                >
                    <UserAvatar
                        name={`${row.givenName} ${row.familyName}`}
                        size="small"
                        className={classes.avatar}
                    />
                    <span>{row.givenName}</span>
                </Box>
            ),
        },
        {
            id: `familyName`,
            persistent: true,
            label: intl.formatMessage({
                id: `users_lastName`,
            }),
        },
        {
            id: `contactInfo`,
            disableSort: true,
            label: intl.formatMessage({
                id: `users_contactInfo`,
            }),
            render: (row) => (
                <span>
                    {row.email || row.phone}
                </span>
            ),
        },
    ];

    const filters: TableFilter<UserRow>[] = [
        {
            id: `email`,
            label: intl.formatMessage({
                id: `common.email`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersContainsLabel`,
                    }),
                    value: `contains`,
                    validations: [ required() ],
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersContainsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                },
            ],
        },
        {
            id: `phone`,
            label: intl.formatMessage({
                id: `common.phone`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersContainsLabel`,
                    }),
                    value: `contains`,
                    validations: [ required() ],
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersContainsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                },
            ],
        },
    ];

    return (
        <Dialog
            fullScreen
            aria-labelledby="nav-menu-title"
            aria-describedby="nav-menu-description"
            open={open}
            TransitionComponent={motion}
            onClose={handleClose}
        >
            <AppBar
                color="primary"
                className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="close"
                        size="large"
                        onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    <Grid
                        container
                        item
                        wrap="nowrap">
                        <Typography
                            id="nav-menu-title"
                            variant="h6"
                        >
                            <FormattedMessage id="rolesInfoCard_deleteTitle" />
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        item
                        justifyContent="flex-end"
                        wrap="nowrap">
                        <div>
                            <Button
                                className={classes.backButton}
                                onClick={handleClose}>
                                Cancel
                            </Button>
                            <Fab
                                color="primary"
                                label="Next"
                                variant="extended"
                                onClick={deleteRoleHandler} />
                        </div>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Grid
                container
                direction="row"
                justifyContent="center"
                spacing={2}
                className={classes.menuContainer}>
                {getAllRolesLoading ? (
                    <Card className={classes.root}>
                        <CardContent>
                            <LinearProgress />
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                component="div">
                                <div
                                    style={{
                                        paddingTop: `10px`,
                                    }}
                                >
                                    Fetching roles
                                </div>
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <RolePermissionsActionsCard
                            roles={roles.filter((role) => role.role_id !== row.id)}
                            roleId={roleId}
                            textFieldLabel={`Reassign all users to`}
                            onChange={reAssignAllUsersHandler}
                        />

                        <Paper className={classes.root}>
                            <CursorTable
                                columns={columns}
                                filters={filters}
                                rows={rows}
                                idField="id"
                                orderBy={serverPagination.orderBy}
                                order={serverPagination.order}
                                rowsPerPage={serverPagination.rowsPerPage}
                                search={serverPagination.search}
                                cursor={serverPagination.cursor}
                                hasNextPage={!loadingOrganizationMemberships ? pageInfo?.hasNextPage : false}
                                hasPreviousPage={!loadingOrganizationMemberships ? pageInfo?.hasPreviousPage : false}
                                startCursor={pageInfo?.startCursor}
                                endCursor={pageInfo?.endCursor}
                                total={usersData?.usersConnection.totalCount}
                                localization={getTableLocalization(intl, {
                                    toolbar: {
                                        title: intl.formatMessage({
                                            id: `roles_deleteRoleTitle`,
                                        }, {
                                            custom_role: row.role,
                                        }),
                                    },
                                    search: {
                                        placeholder: intl.formatMessage({
                                            id: `users_searchPlaceholder`,
                                        }),
                                    },
                                    body: {
                                        noData: intl.formatMessage({
                                            id: `users_noRecords`,
                                        }),
                                    },
                                })}
                                onPageChange={onPageChange}
                                onChange={onTableChange}
                            />
                        </Paper>
                    </>
                )}
            </Grid>
        </Dialog>
    );
}
