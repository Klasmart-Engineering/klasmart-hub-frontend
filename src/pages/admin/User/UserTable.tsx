import { useReactiveVar } from "@apollo/client/react";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { currentMembershipVar } from "@/cache";
import {
    BaseTable,
    utils,
} from "kidsloop-px";
import { getTableLocalization } from "@/utils/table";
import { useGetOrganizationUsers } from "@/api/users";
import { TableColumn } from "kidsloop-px/dist/types/components/Base/Table/Head";
import {
    OrganizationMembership,
    Role,
    School,
} from "@/types/graphQL";
import {
    Avatar,
    Box,
    createStyles,
    makeStyles,
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

const useStyles = makeStyles((theme) => createStyles({
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
    email: string;
    roles: Role[];
    schools: School[];
    status: string;
    joinDate: Date;
}

interface Props {
}

/**
 * Returns function to show Users table for "View Users" section
 */
export default function UserTable (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const organization = useReactiveVar(currentMembershipVar);
    const organization_id = organization.organization_id;
    const [ rows, setRows ] = useState<UserRow[]>([]);
    const [ createDialogOpen, setCreateDialogOpen ] = useState(false);
    const [ editDialogOpen, setEditDialogOpen ] = useState(false);
    const [ selectedOrganizationMembership, setSelectedOrganizationMembership ] = useState<OrganizationMembership>();
    const {
        data,
        refetch,
        loading,
    } = useGetOrganizationUsers(organization_id);
    const canCreate = getPermissionState(organization_id, `create_users_40220`);
    const canEdit = getPermissionState(organization_id, `edit_users_40330`);
    const canDelete = getPermissionState(organization_id, `delete_users_40440`);

    const memberships = data?.organization?.memberships;

    useEffect(() => {
        const rows = memberships?.map((membership) => ({
            id: membership?.user?.user_id ?? ``,
            name: `${membership?.user?.given_name} ${membership?.user?.family_name}`,
            avatar: membership?.user?.avatar ?? ``,
            email: membership?.user?.email ?? ``,
            roles: membership.roles ?? [],
            schools: membership.schoolMemberships?.map((sm) => sm.school).filter((sm) => sm?.status === `active`) as School[] ?? [],
            status: membership?.status ?? ``,
            joinDate: new Date(membership.join_timestamp ?? ``),
        }));
        setRows(rows ?? []);
    }, [ memberships ]);

    const columns: TableColumn<UserRow>[] = [
        {
            id: `id`,
            label: `ID`,
            hidden: true,
        },
        {
            id: `name`,
            label: `Name`,
            searchable: true,
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
                            {utils.nameToInitials(row.name) || <PersonIcon />}
                        </Typography>
                    </Avatar>
                    <span>{row.name}</span>
                </Box>,
        },
        {
            id: `roles`,
            label: `Roles`,
            searchable: true,
            render: (row) => row.roles?.map((role, i) =>
                <Typography
                    key={`role-${i}`}
                    noWrap
                    variant="body2"
                >
                    {role.role_name}
                </Typography>,
            ),
        },
        {
            id: `schools`,
            label: `Schools`,
            searchable: true,
            render: (row) => row.schools?.map((school, i) =>
                <Typography
                    key={`school-${i}`}
                    noWrap
                    variant="body2"
                >
                    {school.school_name}
                </Typography>,
            ),
        },
        {
            id: `email`,
            label: `Email`,
            searchable: true,
        },
        {
            id: `status`,
            label: `Status`,
            searchable: true,
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
        // await deleteClass(selectedOrganizationMembership.class_id);
        refetch();
    };

    return <>
        <BaseTable
            columns={columns}
            rows={rows}
            loading={loading}
            idField="id"
            orderBy="name"
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
        <CreateUserDialog
            open={createDialogOpen}
            onClose={(value) => {
                setCreateDialogOpen(false);
                if (value) refetch();
            }}
        />
    </>;

}
