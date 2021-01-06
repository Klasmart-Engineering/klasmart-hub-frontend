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
import { Person as PersonIcon } from "@material-ui/icons";
import clsx from "clsx";

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
    const { data, loading } = useGetOrganizationUsers(organization_id);

    useEffect(() => {
        const memberships = data?.organization?.memberships ?? [];
        const rows = memberships.map((membership) => {
            return {
                id: membership?.user?.user_id ?? ``,
                name: `${membership?.user?.given_name} ${membership?.user?.family_name}`,
                avatar: membership?.user?.avatar ?? ``,
                email: membership?.user?.email ?? ``,
                roles: membership.roles ?? [],
                schools: membership.schoolMemberships?.map((sm) => sm.school).filter((sm) => sm?.status === `active`) as School[] ?? [],
                status: membership?.status ?? ``,
                joinDate: new Date(membership.join_timestamp ?? ``),
            };
        });
        setRows(rows);
    }, [ data ]);

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
            groupable: true,
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

    return <BaseTable
        columns={columns}
        rows={rows}
        loading={loading}
        idField="id"
        orderBy="name"
        // primaryAction={{
        //     label: "Create Class",
        //     icon: AddIcon,
        //     disabled: !canCreate,
        //     onClick: (data) => setCreateDialogOpen(true),
        // }}
        // selectActions={[
        //     {
        //         label: intl.formatMessage({ id: "classes_actionsDeleteTooltip" }),
        //         icon: DeleteIcon,
        //         disabled: !canDelete,
        //         onClick: (data) => alert(`You want to delete ${data.rows.length} rows`)
        //     }
        // ]}
        // rowActions={(row) => [
        //     {
        //         label: "Edit",
        //         icon: EditIcon,
        //         disabled: !(row.status === "active" && canEdit),
        //         onClick: editSelectedRow,
        //     },
        //     {
        //         label: "Delete",
        //         icon: DeleteIcon,
        //         disabled: !(row.status === "active" && canDelete),
        //         onClick: deleteSelectedRow,
        //     },
        // ]}
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
    />;
}
