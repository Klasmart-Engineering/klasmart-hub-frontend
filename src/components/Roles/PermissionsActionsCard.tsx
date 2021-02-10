import {
    PermissionsCategory,
    Role,
} from "@/pages/admin/Role/CreateRoleDialog";
import {
    MenuItem,
    TextField,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, {
    Dispatch,
    SetStateAction,
} from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: theme.breakpoints.values.lg,
            height: `100px`,
            marginBottom: `13px`,
            borderRadius: 10,
            "& .MuiTextField-root": {
                margin: theme.spacing(1),
                width: `25ch`,
            },
        },
        contentContainer: {
            display: `flex`,
            alignItems: `center`,
        },
        actionsMargin: {
            marginRight: `auto`,
        },
        actionsContainer: {
            display: `flex`,
            width: `550px`,
            justifyContent: `space-between`,
        },
        label: {
            textTransform: `capitalize`,
        },
    }),
);

interface Props {
    roles: Role[];
    permissionCategories: PermissionsCategory[];
    setPermissionCategories: Dispatch<SetStateAction<PermissionsCategory[]>>;
}

export default function PermissionsActionsCard(props: Props) {
    const {
        roles,
        permissionCategories,
        setPermissionCategories,
    } = props;
    const classes = useStyles();
    const [ roleId, setRoleId ] = React.useState(``);

    const getPermissionIdsByRoleId = (roles: Role[], roleId: string) => {
        return roles
            .filter((role) => role.role_id === roleId)
            .reduce((acc: string[], role) => {
                role.permissions.forEach((permission) => {
                    acc.push(permission.permission_id);
                });

                return acc;
            }, []);
    };

    const newRolesAndPermissionsByRoleId = (roles: Role[], roleId: string) => {
        const newPermissions = [ ...permissionCategories ];

        newPermissions.forEach((permissionCategory) => {
            permissionCategory.groups.forEach((group) => {
                group.permissionDetails.forEach((permissionDetail) => {
                    permissionDetail.checked = !!getPermissionIdsByRoleId(
                        roles,
                        roleId,
                    )?.includes(permissionDetail.permissionId);
                });

                group.open = group.permissionDetails.some(
                    (permissionDetail) => permissionDetail.checked,
                );

                group.selectAll = false;
            });
        });

        setPermissionCategories(newPermissions);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoleId(event.target.value);
        newRolesAndPermissionsByRoleId(roles, event.target.value);
    };

    const handleClear = () => {
        setRoleId(``);
        const newPermissions = [ ...permissionCategories ];

        newPermissions.forEach((permissionCategory) => {
            permissionCategory.groups.forEach((group) => {
                group.permissionDetails.forEach((permissionDetail) => {
                    permissionDetail.checked = false;
                });

                group.open = false;
                group.selectAll = false;
            });
        });

        setPermissionCategories(newPermissions);
    };

    const handleResetDefault = () => {
        newRolesAndPermissionsByRoleId(roles, roleId);
    };

    return (
        <Card className={classes.root}>
            <CardContent>
                <div className={classes.contentContainer}>
                    <div className={classes.actionsMargin}>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="h2">
                            Actions
                        </Typography>
                    </div>
                    <div className={classes.actionsContainer}>
                        <Button
                            classes={{
                                label: classes.label,
                            }}
                            onClick={handleClear}
                        >
                            Clear
                        </Button>
                        <Button
                            classes={{
                                label: classes.label,
                            }}
                            disabled={roleId.length === 0}
                            onClick={handleResetDefault}
                        >
                            Reset to Default
                        </Button>
                        <div>
                            <TextField
                                select
                                id="filled"
                                label="Copy role from..."
                                value={roleId}
                                variant="outlined"
                                onChange={handleChange}
                            >
                                {roles
                                    .filter(
                                        (role) =>
                                            role.role_name &&
                                            role.role_name.length,
                                    )
                                    .map((role) => (
                                        <MenuItem
                                            key={role.role_id}
                                            value={role.role_id}
                                        >
                                            {role.role_name}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
