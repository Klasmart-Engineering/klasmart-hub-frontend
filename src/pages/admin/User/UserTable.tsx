import { useReactiveVar } from "@apollo/client/react";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { currentMembershipVar } from "@/cache";
import {
    Table,
    useSnackbar,
    utils,
} from "kidsloop-px";
import { getTableLocalization } from "@/utils/table";
import { useGetOrganizationMemberships } from "@/api/organizationMemberships";
import {
    orderedRoleNames,
    OrganizationMembership,
    RoleName,
} from "@/types/graphQL";
import {
    Avatar,
    Box,
    createStyles,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    PersonAdd as PersonAddIcon,
    Person as PersonIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import { getPermissionState } from "@/utils/checkAllowed";
import CreateUserDialog from "@/components/User/Dialog/Create";
import EditUserDialog from "@/components/User/Dialog/Edit";
import { useDeleteOrganizationMembership } from "@/api/organizationMemberships";
import { getHighestRole } from "@/utils/userRoles";
import { startCase } from "lodash";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Head";
import { useGetAllRoles } from "@/api/roles";

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

interface UserRow {
    id: string;
    name: string;
    avatar: string;
    contactInfo: string;
    roleNames: RoleName[];
    schoolNames: string[];
    status: string;
    joinDate: Date;
}

const sortSchoolNames = (a: string, b: string, locale?: string, collatorOptions?: Intl.CollatorOptions) => a.localeCompare(b, locale, collatorOptions);

const sortRoleNames = (a: RoleName, b: RoleName) => {
    return orderedRoleNames.indexOf(a) - orderedRoleNames.indexOf(b);
};

interface Props {
}

/**
 * Returns function to show Users table for "View Users" section
 */
export default function UserTable (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const [ rows, setRows ] = useState<UserRow[]>([]);
    const [ createDialogOpen, setCreateDialogOpen ] = useState(false);
    const [ editDialogOpen, setEditDialogOpen ] = useState(false);
    const [ selectedOrganizationMembership, setSelectedOrganizationMembership ] = useState<OrganizationMembership>();
    const {
        data: dataOrganizationMemberships,
        refetch,
        loading: loadingOrganizationMemberships,
    } = useGetOrganizationMemberships(organization_id);
    const {
        data: dataRoles,
        loading: loadingRoles,
    } = useGetAllRoles(organization_id);
    const [ deleteOrganizationMembership ] = useDeleteOrganizationMembership();
    const canCreate = getPermissionState(organization_id, `create_users_40220`);
    const canEdit = getPermissionState(organization_id, `edit_users_40330`);
    const canDelete = getPermissionState(organization_id, `delete_users_40440`);

    const memberships = dataOrganizationMemberships?.organization?.memberships;
    useEffect(() => {
        const rows = memberships?.map((membership) => {
            const roleNames = membership.roles?.map((r) => r.role_name) ?? [];
            roleNames.sort(sortRoleNames);
            const schoolNames = membership.schoolMemberships?.map((sm) => sm.school).filter((sm) => sm?.status === `active`).map((s) => s?.school_name ?? ``) ?? [];
            schoolNames?.sort(sortSchoolNames);
            return {
                id: membership?.user?.user_id ?? ``,
                name: `${membership?.user?.given_name} ${membership?.user?.family_name}`,
                avatar: membership?.user?.avatar ?? ``,
                contactInfo: membership?.user?.email ?? membership?.user?.phone ?? ``,
                roleNames,
                schoolNames,
                status: membership?.status ?? ``,
                joinDate: new Date(membership.join_timestamp ?? ``),
            };
        });
        setRows(rows ?? []);
    }, [ memberships ]);

    const roles = dataRoles?.organization?.roles?.map((role) => role.role_name ?? ``) ?? [];

    const columns: TableColumn<UserRow>[] = [
        {
            id: `id`,
            label: `ID`,
            hidden: true,
        },
        {
            id: `name`,
            label: `Name`,
            render: (row) =>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                >
                    <Avatar
                        src={row.avatar ?? ``}
                        className={classes.avatar}
                        style={{
                            backgroundColor: row.avatar ? undefined : utils.stringToHslColor(row.name),
                        }}>
                        <Typography
                            noWrap
                            variant="inherit"
                        >
                            {utils.nameToInitials(row.name, 3) || <PersonIcon />}
                        </Typography>
                    </Avatar>
                    <span>{row.name}</span>
                </Box>,
        },
        {
            id: `roleNames`,
            label: intl.formatMessage({
                id: `users_organizationRoles`,
            }),
            groups: roles.map((role) => ({
                text: role,
            })),
            sort: (a: RoleName[], b: RoleName[]) => {
                const highestRoleA = getHighestRole(orderedRoleNames, a);
                const highestRoleB = getHighestRole(orderedRoleNames, b);
                if (!highestRoleA) return -1;
                if (!highestRoleB) return 1;
                return orderedRoleNames.indexOf(highestRoleB) - orderedRoleNames.indexOf(highestRoleA);
            },
            render: (row) => row.roleNames.map((roleName, i) =>
                <Typography
                    key={`role-${i}`}
                    noWrap
                    variant="body2"
                >
                    {roleName}
                </Typography>,
            ),
        },
        {
            id: `schoolNames`,
            label: intl.formatMessage({
                id: `users_school`,
            }),
            groupable: true,
            render: (row) => row.schoolNames?.map((schoolName, i) =>
                <Typography
                    key={`school-${i}`}
                    noWrap
                    variant="body2"
                >
                    {schoolName}
                </Typography>,
            ),
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
            groupText: (value: string) => startCase(value),
            render: (row) => <span
                className={clsx(classes.statusText, {
                    [classes.activeColor]: row.status === `active`,
                    [classes.inactiveColor]: row.status === `inactive`,
                })}
            >
                {row.status}
            </span>,
        },
        {
            id: `joinDate`,
            label: `Join Date`,
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
        try {
            await deleteOrganizationMembership({
                variables: {
                    organization_id: selectedOrganizationMembership.organization_id,
                    user_id: selectedOrganizationMembership.user_id,
                },
            });
            await refetch();
            enqueueSnackbar(`User has been deleted succesfully`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    return <>
        <Paper className={classes.root}>
            <Table
                columns={columns}
                rows={rows}
                loading={loadingOrganizationMemberships || loadingRoles}
                idField="id"
                orderBy="joinDate"
                order="desc"
                groupBy="roleNames"
                primaryAction={{
                    label: `Create User`,
                    icon: PersonAddIcon,
                    disabled: !canCreate,
                    onClick: (data) => setCreateDialogOpen(true),
                }}
                rowActions={(row) => [
                    {
                        label: `Edit`,
                        icon: EditIcon,
                        disabled: !(row.status === `active` && canEdit),
                        onClick: editSelectedRow,
                    },
                    {
                        label: `Delete`,
                        icon: DeleteIcon,
                        disabled: !(row.status === `active` && canDelete),
                        onClick: deleteSelectedRow,
                    },
                ]}
                localization={getTableLocalization(intl, {
                    toolbar: {
                        title: `Users`,
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
    </>;

}
