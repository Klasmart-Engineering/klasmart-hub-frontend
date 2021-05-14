import {
    useDeleteOrganizationMembership,
    useGetOrganizationMemberships,
} from "@/api/organizationMemberships";
import { useGetAllRoles } from "@/api/roles";
import CreateUserDialog from "@/components/User/Dialog/Create";
import UploadUserCsvDialog from "@/components/User/Dialog/CsvUpload";
import EditUserDialog from "@/components/User/Dialog/Edit";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    OrganizationMembership,
    Status,
} from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { getTableLocalization } from "@/utils/table";
import {
    getHighestRole,
    roleNameTranslations,
    sortRoleNames,
} from "@/utils/userRoles";
import {
    Avatar,
    Box,
    createStyles,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";
import {
    CloudUpload,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Person as PersonIcon,
    PersonAdd as PersonAddIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import {
    PageTable,
    useSnackbar,
    utils,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
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
        color: `#2BA600`,
        fontWeight: `bold`,
    },
    inactiveColor: {
        color: `#FF0000`,
        fontWeight: `bold`,
    },
    statusText: {
        fontWeight: `bold`,
        textTransform: `capitalize`,
    },
}));

export const sortSchoolNames = (a: string, b: string, locale?: string, collatorOptions?: Intl.CollatorOptions) => a.localeCompare(b, locale, collatorOptions);

export const userMembership = (membership: OrganizationMembership) => {
    const roleNames =
        membership.roles
            ?.filter((role) => role.status === Status.ACTIVE)
            .map((role) => role.role_name)
            .filter((roleName): roleName is string => !!roleName) ?? [];
    roleNames.sort(sortRoleNames);

    const schoolNames =
        membership.schoolMemberships
            ?.map((sm) => sm.school)
            .filter((sm) => sm?.status === Status.ACTIVE)
            .map((s) => s?.school_name ?? ``) ?? [];
    schoolNames?.sort(sortSchoolNames);
    return {
        id: membership?.user?.user_id ?? ``,
        name: `${membership?.user?.given_name || `?`} ${membership?.user?.family_name || `?`}`,
        avatar: membership?.user?.avatar ?? ``,
        contactInfo: membership?.user?.email ?? membership?.user?.phone ?? ``,
        roleNames,
        schoolNames,
        status: membership?.status ?? ``,
        joinDate: new Date(membership.join_timestamp ?? ``),
        gender: membership?.user?.gender ?? ``,
        alternate_email: membership?.user?.alternate_email ?? ``,
        alternate_phone: membership?.user?.alternate_phone ?? ``,
        date_of_birth: membership?.user?.date_of_birth ?? ``,
        shortcode: membership?.shortcode,
    };
};

interface UserRow {
    id: string;
    name: string;
    avatar: string;
    contactInfo: string;
    roleNames: string[];
    schoolNames: string[];
    status: string;
    joinDate: Date;
}

interface Props {
}

export default function UserTable (props: Props) {
    const classes = useStyles();
    const [ uploadCsvDialogOpen, setUploadCsvDialogOpen ] = useState(false);
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const currentOrganization = useCurrentOrganization();
    const [ rows, setRows ] = useState<UserRow[]>([]);
    const [ createDialogOpen, setCreateDialogOpen ] = useState(false);
    const [ editDialogOpen, setEditDialogOpen ] = useState(false);
    const [ selectedOrganizationMembership, setSelectedOrganizationMembership ] = useState<OrganizationMembership>();
    const organizationId = currentOrganization?.organization_id ?? ``;
    const {
        data: dataOrganizationMemberships,
        refetch,
        loading: loadingOrganizationMemberships,
    } = useGetOrganizationMemberships({
        fetchPolicy: `cache-and-network`,
        variables: {
            organization_id: organizationId,
        },
    });
    const {
        data: dataRoles,
        loading: loadingRoles,
    } = useGetAllRoles(organizationId);
    const [ deleteOrganizationMembership ] = useDeleteOrganizationMembership();
    const canCreate = usePermission(`create_users_40220`);
    const canEdit = usePermission(`edit_users_40330`);
    const canDelete = usePermission(`delete_users_40440`);
    const canView = usePermission(`view_users_40110`, true);

    const memberships = dataOrganizationMemberships?.organization?.memberships;
    useEffect(() => {
        const rows = memberships?.map(userMembership);
        setRows(rows ?? []);
    }, [ memberships ]);

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
            secret: true,
        },
        {
            id: `name`,
            persistent: true,
            label: intl.formatMessage({
                id: `users_name`,
            }),
            render: (row) => (
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                >
                    <Avatar
                        src={row.avatar ?? ``}
                        className={classes.avatar}
                        style={{
                            backgroundColor: row.avatar ? undefined : utils.stringToColor(row.name),
                        }}>
                        <Typography
                            noWrap
                            variant="inherit"
                        >
                            {utils.nameToInitials(row.name, 3) || <PersonIcon />}
                        </Typography>
                    </Avatar>
                    <span>{row.name}</span>
                </Box>
            ),
        },
        {
            id: `roleNames`,
            label: intl.formatMessage({
                id: `users_organizationRoles`,
            }),
            groups: roles.map((role) => ({
                text: getCustomRoleName(role),
                value: role,
            })),
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
            render: (row) => row.roleNames.map((roleName, i) =>
                <Typography
                    key={`role-${i}`}
                    noWrap
                    variant="body2"
                >
                    {getCustomRoleName(roleName)}
                </Typography>),
        },
        {
            id: `schoolNames`,
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
            label: intl.formatMessage({
                id: `users_contactInfo`,
            }),
        },
        {
            id: `status`,
            label: intl.formatMessage({
                id: `classes_statusTitle`,
            }),
            groups: [ `active`, `inactive` ].map((status) => ({
                text: getCustomStatus(status),
                value: status,
            })),
            search: (row: string[], searchValue: string) => {
                const values = Array.isArray(row) ? row : [ row ];
                const regexp = new RegExp(escapeRegExp(searchValue.trim()), `gi`);
                return values.some((value) => {
                    const result = getCustomStatus(value).match(regexp);
                    return !!result;
                });
            },
            render: (row) => <span
                className={clsx(classes.statusText, {
                    [classes.activeColor]: row.status === Status.ACTIVE,
                    [classes.inactiveColor]: row.status === Status.INACTIVE,
                })}
            >
                {intl.formatMessage({
                    id: `users_${row.status}Status`,
                })}
            </span>,
        },
        {
            id: `joinDate`,
            label: intl.formatMessage({
                id: `users_joinDate`,
            }),
            render: (row) => <span>{intl.formatDate(row.joinDate)}</span>,
        },
    ];

    const findOrganizationMembership = (row: UserRow) => memberships?.find((m) => m.user?.user_id === row.id);

    const editSelectedRow = (row: UserRow) => {
        const selectedOrganizationMembership = findOrganizationMembership(row);
        if (!selectedOrganizationMembership) return;
        setSelectedOrganizationMembership(selectedOrganizationMembership);
        setEditDialogOpen(true);
    };

    const deleteSelectedRow = async (row: UserRow) => {
        const selectedOrganizationMembership = findOrganizationMembership(row);
        if (!selectedOrganizationMembership) return;
        const userName = row.name;
        if (!confirm(`Are you sure you want to delete "${userName}"?`)) return;
        const { organization_id, user_id } = selectedOrganizationMembership;
        try {
            await deleteOrganizationMembership({
                variables: {
                    organization_id,
                    user_id,
                },
            });
            await refetch();
            enqueueSnackbar(`User has been deleted successfully`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    if (!canView && !loadingOrganizationMemberships) {
        return <Redirect to="/" />;
    }

    return <>
        <Paper className={classes.root}>
            <PageTable
                columns={columns}
                rows={rows}
                loading={loadingOrganizationMemberships || loadingRoles}
                idField="id"
                orderBy="joinDate"
                order="desc"
                groupBy="roleNames"
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
                        icon: CloudUpload,
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
            />
        </Paper>
        <EditUserDialog
            open={editDialogOpen}
            value={selectedOrganizationMembership}
            onClose={(value) => {
                setSelectedOrganizationMembership(undefined);
                setEditDialogOpen(false);
                if (value) refetch();
            }}
        />
        <CreateUserDialog
            open={createDialogOpen}
            onClose={(value) => {
                setCreateDialogOpen(false);
                if (value) refetch();
            }}
        />
        <UploadUserCsvDialog
            open={uploadCsvDialogOpen}
            onClose={(value) => {
                setUploadCsvDialogOpen(false);
                if (value) refetch();
            }}
        />
    </>;
}
