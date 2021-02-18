import {
    useGetOrganizationMemberships,
    useUpdateOrganizationMembership,
} from "@/api/organizationMemberships";
import {
    useDeleteRole,
    useGetAllRoles,
    useGetOrganizationRolesPermissions,
} from "@/api/roles";
import KidsloopLogo from "@/assets/img/kidsloop_icon.svg";
import { currentMembershipVar } from "@/cache";
import RolePermissionsActionsCard from "@/components/Roles/RolePermissionsActionsCard";
import { Role } from "@/pages/admin/Role/CreateRoleDialog";
import { RoleRow } from "@/pages/admin/Role/RoleTable";
import { getTableLocalization } from "@/utils/table";
import { useReactiveVar } from "@apollo/client";
import {
    Avatar,
    Box,
    createStyles,
    LinearProgress,
    MenuItem,
    Paper,
    TextField,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import {
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { TransitionProps } from "@material-ui/core/transitions";
import Typography from "@material-ui/core/Typography";
import { Person as PersonIcon } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import {
    Fab,
    Table,
    useConfirm,
    useSnackbar,
    utils,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Head";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

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

        //
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
    }),
);

const motion = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
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

interface UserRow {
    id: string;
    name: string;
    avatar: string;
    email: string;
    organizationRoles: Role[];
    newRoleId: string;
    status?: string;
}

interface Props {
    open: boolean;
    handleClose: () => void;
    row: RoleRow;
}

export default function DeleteRoleDialog(props: Props) {
    const {
        open,
        handleClose,
        row,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const confirm = useConfirm();
    const { enqueueSnackbar } = useSnackbar();
    const [ roleId, setRoleId ] = useState(``);
    const [ rows, setRows ] = useState<UserRow[]>([]);
    const membership = useReactiveVar(currentMembershipVar);
    const { data: organizationRoles, loading: organizationRolesLoading } = useGetOrganizationRolesPermissions(
        membership.organization_id,
    );
    const { data: organizationMemberships, loading: organizationMembershipsLoading } = useGetOrganizationMemberships({
        fetchPolicy: `network-only`,
        variables: {
            organization_id: membership.organization_id,
        },
    });
    const [ updateOrganizationMembership ] = useUpdateOrganizationMembership();
    const [ deleteRole ] = useDeleteRole();
    const { refetch } = useGetAllRoles(membership.organization_id);
    const roles: Role[] = organizationRoles?.organization?.roles ?? [];
    const memberships = organizationMemberships?.organization?.memberships ?? [];
    const schools = organizationMemberships?.organization?.schools ?? [];

    useEffect(() => {
        if (open && roles.length && memberships.length && schools.length) {
            const users: UserRow[] = [];
            const defaultRole = roles.find((role) => role.role_name === `Student` && role.system_role);
            const organizationRoles = roles.filter((role) => role.role_id !== row.id && role.status === `active`) ?? [];
            memberships?.forEach((membership) => {
                const role = membership.roles?.find((role) => role.role_id === row.id);

                if (role && membership.status === `active`) {
                    users.push({
                        id: membership.user?.user_id ?? ``,
                        name: membership.user?.full_name ?? ``,
                        email: membership.user?.email ?? ``,
                        organizationRoles: organizationRoles,
                        avatar: membership.user?.avatar ?? ``,
                        newRoleId: defaultRole?.role_id ?? ``,
                    });
                }
            });

            schools?.forEach((school) => {
                school.memberships?.forEach((schoolMembership) => {
                    const role = schoolMembership.roles?.find((role) => role.role_id === row.id);
                    if (role && schoolMembership.status === `active`) {
                        if (!users.find((user) => user.id === schoolMembership.user?.user_id)) {
                            users.push({
                                id: schoolMembership.user?.user_id ?? ``,
                                name: schoolMembership.user?.full_name ?? ``,
                                email: schoolMembership.user?.email ?? ``,
                                organizationRoles: organizationRoles,
                                avatar: membership.user?.avatar ?? ``,
                                newRoleId: defaultRole?.role_id ?? ``,
                            });
                        }
                    }
                });
            });

            setRows(users ?? []);
        }
    }, [
        memberships,
        schools,
        roles,
        open,
    ]);

    useEffect(() => {
        if (!open) {
            setRoleId(``);
        }
    }, [ open ]);

    const roleChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRows = [ ...rows ];

        newRows.forEach((user) => {
            if (user.id === event.target.name) {
                user.newRoleId = event.target.value;
            }
        });

        setRows(newRows);
    };

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

            const findOrganizationMembership = (row: UserRow) =>
                memberships?.find((membership) => membership.user?.user_id === row.id);

            for (const user of rows) {
                const userMembership = findOrganizationMembership(user);

                const organizationRoleIdsHandler = (): string[] => {
                    const roleIds = userMembership?.roles?.map((role) => role.role_id) ?? [];
                    if (!roleIds.includes(user.newRoleId)) {
                        roleIds.push(user.newRoleId);
                    }

                    return roleIds;
                };

                await updateOrganizationMembership({
                    variables: {
                        organization_id: membership.organization_id,
                        organization_role_ids: organizationRoleIdsHandler(),
                        school_ids: userMembership?.schoolMemberships?.map((school) => school.school_id) ?? [],
                        email: userMembership?.user?.email,
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
            label: `Id`,
            hidden: true,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `users_name`,
            }),
            render: (row) => (
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center">
                    <Avatar
                        src={row.avatar ?? ``}
                        className={classes.avatar}
                        style={{
                            backgroundColor: row.avatar ? undefined : utils.stringToColor(row.name),
                        }}
                    >
                        <Typography
                            noWrap
                            variant="inherit">
                            {utils.nameToInitials(row.name, 3) || <PersonIcon />}
                        </Typography>
                    </Avatar>
                    <span>{row.name}</span>
                </Box>
            ),
        },
        {
            id: `email`,
            label: `Email`,
        },
        {
            id: `organizationRoles`,
            label: `Role`,
            disableSort: true,
            render: (row) => {
                return (
                    <TextField
                        select
                        fullWidth
                        id="filled"
                        label="Roles"
                        value={row.newRoleId}
                        name={row.id}
                        onChange={roleChangeHandler}
                    >
                        {row.organizationRoles.map((role) => (
                            <MenuItem
                                key={role.role_id}
                                value={role.role_id}>
                                {role.role_name}
                            </MenuItem>
                        ))}
                    </TextField>
                );
            },
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
                        onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    <Grid
                        container
                        item
                        wrap="nowrap">
                        <img
                            alt="kidsloop logo"
                            className={classes.title}
                            src={KidsloopLogo}
                            height={32} />
                        <Typography
                            id="nav-menu-title"
                            variant="h6">
                            for Organizations
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        item
                        justify="flex-end"
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
                justify="center"
                spacing={2}
                className={classes.menuContainer}>
                {organizationRolesLoading || organizationMembershipsLoading ? (
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
                            <Table
                                columns={columns}
                                rows={rows}
                                idField="id"
                                orderBy="organizationRoles"
                                localization={getTableLocalization(intl, {
                                    toolbar: {
                                        title: row.role,
                                    },
                                    search: {
                                        placeholder: `Search for users by their name or email address`,
                                    },
                                    body: {
                                        noData: `There are no users associated with this role`,
                                    },
                                })}
                            />
                        </Paper>
                    </>
                )}
            </Grid>
        </Dialog>
    );
}
