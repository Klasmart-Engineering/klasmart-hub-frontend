import {
    useDeleteOrganizationMembership,
    useGetPaginatedOrganizationMemberships,
    UserEdge,
} from "@/api/organizationMemberships";
import { useGetOrganizationRoles } from "@/api/roles";
import CreateUserDialog from "@/components/User/Dialog/Create";
import UploadUserCsvDialog from "@/components/User/Dialog/CsvUpload";
import EditUserDialog from "@/components/User/Dialog/Edit";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Status } from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { getTableLocalization } from "@/utils/table";
import {
    getHighestRole,
    roleNameTranslations,
    sortRoleNames,
} from "@/utils/userRoles";
import { useValidations } from "@/utils/validations";
import {
    Box,
    createStyles,
    DialogContentText,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";
import {
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    PersonAdd as PersonAddIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import {
    CursorTable,
    usePrompt,
    UserAvatar,
    useSnackbar,
    utils,
} from "kidsloop-px";
import {
    Order,
    TableColumn,
} from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import { escapeRegExp } from "lodash";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { Redirect } from "react-router";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
    },
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        color: `white`,
        marginRight: 16,
        fontSize: 10,
    },
    activeColor: {
        color: theme.palette.success.main,
    },
    inactiveColor: {
        color: theme.palette.error.main,
    },
    statusText: {
        fontWeight: `bold`,
        textTransform: `capitalize`,
    },
}));

export const sortSchoolNames = (a: string, b: string, locale?: string, collatorOptions?: Intl.CollatorOptions) => a.localeCompare(b, locale, collatorOptions);

export const mapUserRow = (edge: UserEdge) => {
    const user = edge.node;
    return {
        id: user.id,
        givenName: user.givenName ?? ``,
        familyName: user.familyName ?? ``,
        avatar: user.avatar ?? ``,
        contactInfo: user.contactInfo.email ?? user.contactInfo.phone ?? ``,
        roleNames: user.roles.filter((role) => role.status === Status.ACTIVE).map((role) => role.name).sort(sortRoleNames),
        schoolNames: user.schools.filter((school) => school.status === Status.ACTIVE).map((school) => school.name).sort(sortSchoolNames),
        status: user.organizations?.[0].userStatus,
        joinDate: new Date(user.organizations?.[0].joinDate),
    };
};

export interface UserRow {
    id: string;
    givenName: string;
    familyName: string;
    avatar: string;
    contactInfo: string;
    roleNames: string[];
    schoolNames: string[];
    status: string;
    joinDate: Date;
}

const ROWS_PER_PAGE = 10;

interface Props {
}

export default function UserTable (props: Props) {
    const classes = useStyles();
    const [ uploadCsvDialogOpen, setUploadCsvDialogOpen ] = useState(false);
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const prompt = usePrompt();
    const currentOrganization = useCurrentOrganization();
    const { required, equals } = useValidations();
    const [ rows, setRows ] = useState<UserRow[]>([]);
    const [ createDialogOpen, setCreateDialogOpen ] = useState(false);
    const [ editDialogOpen, setEditDialogOpen ] = useState(false);
    const [ rowsPerPage, setRowsPerPage ] = useState(ROWS_PER_PAGE);
    const [ search, setSearch ] = useState(``);
    const [ cursor, setCursor ] = useState<string>();
    const [ selectedUserId, setSelectedUserId ] = useState<string>();
    const organizationId = currentOrganization?.organization_id ?? ``;
    const {
        data: usersData,
        refetch: refetchUsers,
        fetchMore: fetchMoreUsers,
        loading: loadingOrganizationMemberships,
    } = useGetPaginatedOrganizationMemberships({
        variables: {
            direction: `FORWARD`,
            count: rowsPerPage,
            search: ``,
            organizationId,
        },
        notifyOnNetworkStatusChange: true,
    });
    const {
        data: dataRoles,
        loading: loadingRoles,
    } = useGetOrganizationRoles({
        variables: {
            organization_id: organizationId,
        },
    });
    const [ deleteOrganizationMembership ] = useDeleteOrganizationMembership();
    const canCreate = usePermission(`create_users_40220`);
    const canEdit = usePermission(`edit_users_40330`);
    const canDelete = usePermission(`delete_users_40440`);
    const canView = usePermission(`view_users_40110`, true);
    const canViewSchoolUsers = usePermission(`view_my_school_users_40111`, true);

    const pageInfo = usersData?.usersConnection.pageInfo;
    const users = usersData?.usersConnection.edges;

    useEffect(() => {
        const rows = users?.map(mapUserRow);
        setRows(rows ?? []);
    }, [ usersData ]);

    const statusTranslations: { [key: string]: string } = {
        active: `users_activeStatus`,
        inactive: `users_inactiveStatus`,
    };

    const getCustomRoleName = (roleName: string) => {
        const translatedRoleName = roleNameTranslations[roleName];
        if (!translatedRoleName) return roleName;
        return intl.formatMessage({
            id: translatedRoleName,
        });
    };

    const getCustomStatus = (status: string) => {
        const translatedStatus = statusTranslations[status];
        if (!translatedStatus) return status;
        return intl.formatMessage({
            id: translatedStatus,
        });
    };

    const roles = dataRoles?.organization?.roles
        ?.filter((role) => role.status === Status.ACTIVE)
        .map((role) => role.role_name)
        .filter((roleName): roleName is string => !!roleName)
        .sort(sortRoleNames) ?? [];

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
            disableSort: true,
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
                        name={row.givenName}
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
            disableSort: true,
            label: intl.formatMessage({
                id: `users_lastName`,
            }),
        },
        {
            id: `roleNames`,
            disableSort: true,
            label: intl.formatMessage({
                id: `users_organizationRoles`,
            }),
            search: (row: string[], searchValue: string) => {
                const values = Array.isArray(row) ? row : [ row ];
                const regexp = new RegExp(escapeRegExp(searchValue.trim()), `gi`);
                return values.some((value) => {
                    const result = getCustomRoleName(value).match(regexp);
                    return !!result;
                });
            },
            sort: (a: string[], b: string[]) => {
                const highestRoleA = getHighestRole(a);
                const highestRoleB = getHighestRole(b);
                if (!highestRoleA) return -1;
                if (!highestRoleB) return 1;
                return roles.indexOf(highestRoleB) - roles.indexOf(highestRoleA);
            },
            render: (row) => row.roleNames.map((roleName, i) => (
                <Typography
                    key={`role-${i}`}
                    noWrap
                    variant="body2"
                >
                    {getCustomRoleName(roleName)}
                </Typography>
            )),
        },
        {
            id: `schoolNames`,
            disableSort: true,
            label: intl.formatMessage({
                id: `users_school`,
            }),
            render: (row) => row.schoolNames?.map((schoolName, i) =>
                <Typography
                    key={`school-${i}`}
                    noWrap
                    variant="body2"
                >
                    {schoolName}
                </Typography>),
        },
        {
            id: `contactInfo`,
            disableSort: true,
            label: intl.formatMessage({
                id: `users_contactInfo`,
            }),
        },
        {
            id: `status`,
            disableSort: true,
            label: intl.formatMessage({
                id: `classes_statusTitle`,
            }),
            search: (row: string[], searchValue: string) => {
                const values = Array.isArray(row) ? row : [ row ];
                const regexp = new RegExp(escapeRegExp(searchValue.trim()), `gi`);
                return values.some((value) => {
                    const result = getCustomStatus(value).match(regexp);
                    return !!result;
                });
            },
            render: (row) => (
                <span
                    className={clsx(classes.statusText, {
                        [classes.activeColor]: row.status === Status.ACTIVE,
                        [classes.inactiveColor]: row.status === Status.INACTIVE,
                    })}
                >
                    {intl.formatMessage({
                        id: `users_${row.status}Status`,
                    })}
                </span>
            ),
        },
        {
            id: `joinDate`,
            disableSort: true,
            label: intl.formatMessage({
                id: `users_joinDate`,
            }),
            render: (row) => <span>{intl.formatDate(row.joinDate)}</span>,
        },
    ];

    const editSelectedRow = (row: UserRow) => {
        setSelectedUserId(row.id);
        setEditDialogOpen(true);
    };

    const deleteSelectedRow = async (row: UserRow) => {
        const userName = `${row.givenName} ${row.familyName}`.trim();
        if (!await prompt({
            variant: `error`,
            title: intl.formatMessage({
                id: `users_deleteButton`,
            }),
            content: <>
                <DialogContentText>{intl.formatMessage({
                    id: `generic_deleteText`,
                }, {
                    value: userName,
                })}</DialogContentText>
                <DialogContentText>{intl.formatMessage({
                    id: `generic_typeToDeletePrompt`,
                }, {
                    value: <strong>{userName}</strong>,
                })}</DialogContentText>
            </>,
            okLabel: intl.formatMessage({
                id: `generic_deleteLabel`,
            }),
            cancelLabel: intl.formatMessage({
                id: `generic_cancelLabel`,
            }),
            validations: [ required(), equals(userName) ],
        })) return;
        try {
            await deleteOrganizationMembership({
                variables: {
                    organization_id: organizationId,
                    user_id: row.id,
                },
            });
            await refetchUsers();
            enqueueSnackbar(intl.formatMessage({
                id: `editDialog_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `editDialog_deleteError`,
            }), {
                variant: `error`,
            });
        }
    };

    const handlePageChange = async (page: PageChange, order: Order, cursor: string | undefined, rowsPerPage: number) => {
        const pageInfo = utils.getCursorPageInfo(page, order, cursor, rowsPerPage);
        setCursor(cursor);
        fetchMoreUsers({
            variables: {
                ...pageInfo,
                search,
            },
            updateQuery: (previous, { fetchMoreResult }) => fetchMoreResult,
        });
    };

    const handleTableChange = async (tableData: CursorTableData<UserRow>) => {
        setRowsPerPage(tableData.rowsPerPage);
        setSearch(tableData.search);
    };

    useEffect(() => {
        fetchMoreUsers({
            variables: {
                count: rowsPerPage,
                direction: `FORWARD`,
                cursor: null,
                search: search ?? ``,
            },
            updateQuery: (previous, { fetchMoreResult }) => fetchMoreResult,
        });
    }, [ rowsPerPage, search ]);

    if (!(canView || canViewSchoolUsers) && !loadingOrganizationMemberships) {
        return <Redirect to="/" />;
    }

    return <>
        <Paper className={classes.root}>
            <CursorTable
                columns={columns}
                rows={rows}
                loading={loadingOrganizationMemberships || loadingRoles}
                idField="id"
                orderBy="id"
                order="desc"
                groupBy="roleNames"
                search={search}
                rowsPerPage={rowsPerPage}
                hasNextPage={pageInfo?.hasNextPage}
                hasPreviousPage={pageInfo?.hasPreviousPage}
                startCursor={pageInfo?.startCursor}
                endCursor={pageInfo?.endCursor}
                total={usersData?.usersConnection.totalCount}
                // noGroupTotal={usersData?.usersConnection.totalCount}
                cursor={cursor}
                primaryAction={{
                    label: intl.formatMessage({
                        id: `users_createUser`,
                    }),
                    icon: PersonAddIcon,
                    disabled: !canCreate,
                    onClick: () => setCreateDialogOpen(true),
                }}
                secondaryActions={[
                    {
                        label: `Upload CSV`,
                        icon: CloudUploadIcon,
                        disabled: !canCreate,
                        onClick: () => setUploadCsvDialogOpen(true),
                    },
                ]}
                rowActions={(row) => [
                    {
                        label: intl.formatMessage({
                            id: `users_editButton`,
                        }),
                        icon: EditIcon,
                        disabled: !(row.status === Status.ACTIVE && canEdit),
                        onClick: editSelectedRow,
                    },
                    {
                        label: intl.formatMessage({
                            id: `users_deleteButton`,
                        }),
                        icon: DeleteIcon,
                        disabled: !(row.status === Status.ACTIVE && canDelete),
                        onClick: deleteSelectedRow,
                    },
                ]}
                localization={getTableLocalization(intl, {
                    toolbar: {
                        title: intl.formatMessage({
                            id: `navMenu_usersTitle`,
                        }),
                    },
                    search: {
                        placeholder: intl.formatMessage({
                            id: `classes_searchPlaceholder`,
                        }),
                    },
                    body: {
                        noData: intl.formatMessage({
                            id: `classes_noRecords`,
                        }),
                    },
                })}
                onPageChange={handlePageChange}
                onChange={handleTableChange}
            />
        </Paper>
        <EditUserDialog
            open={editDialogOpen}
            userId={selectedUserId}
            onClose={(value) => {
                setSelectedUserId(undefined);
                setEditDialogOpen(false);
                if (value) refetchUsers();
            }}
        />
        <CreateUserDialog
            open={createDialogOpen}
            onClose={(value) => {
                setCreateDialogOpen(false);
                if (value) refetchUsers();
            }}
        />
        <UploadUserCsvDialog
            open={uploadCsvDialogOpen}
            onClose={(value) => {
                setUploadCsvDialogOpen(false);
                if (value) refetchUsers();
            }}
        />
    </>;
}
