import { GetRolePermissionsResponse } from "@/api/roles";
import KidsloopLogo from "@/assets/img/kidsloop_icon.svg";
import RoleAndNameDescriptionCard from "@/components/Roles/RoleAndNameDescriptionCard";
import RoleReviewCard from "@/components/Roles/RoleReviewCard";
import {
    PermissionsCategory,
    Role,
    RoleInfo,
} from "@/pages/admin/Role/CreateAndEditRoleDialog";
import {
    permissionsCategoriesHandler,
    sectionHandler,
    uniquePermissions,
} from "@/pages/admin/Role/permissionsHandler";
import { RoleRow } from "@/pages/admin/Role/RoleTable";
import {
    createStyles,
    LinearProgress,
} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
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
import CloseIcon from "@material-ui/icons/Close";
import React, {
    useEffect,
    useState,
} from "react";

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
        appBar: {
            position: `relative`,
        },
        title: {
            marginLeft: theme.spacing(2),
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

interface Props {
    open: boolean;
    row: RoleRow;
    handleClose: () => void;
    roles: Role[];
    rolePermissions: GetRolePermissionsResponse | undefined;
    rolePermissionsLoading: boolean;
}

export default function ViewRoleDetailsDialog (props: Props) {
    const {
        open,
        row,
        handleClose,
        roles,
        rolePermissions,
        rolePermissionsLoading,
    } = props;
    const classes = useStyles();
    const [ roleInfo, setRoleInfo ] = useState<RoleInfo>({
        name: row.role,
        description: row.description,
    });
    const [ permissionCategories, setPermissionCategories ] = useState<PermissionsCategory[]>([]);

    useEffect(() => {
        if (open) {
            setRoleInfo({
                name: row.role,
                description: row.description,
            });
        }
    }, [ open, row ]);

    useEffect(() => {
        if (open && roles.length) {
            const permissions = uniquePermissions(roles) ?? [];
            const data = sectionHandler(permissions) ?? [];

            if (rolePermissions?.role) {
                data.forEach((permissionCategory) => {
                    permissionCategory.groups.forEach((group) => {
                        group.permissionDetails.forEach((permissionDetail) => {
                            permissionDetail.checked = rolePermissions?.role.permissions.some((permission) => permission.permission_id === permissionDetail.permissionId);
                        });
                    });
                });
            }

            setPermissionCategories(data);
        }
    }, [
        open,
        roles,
        rolePermissions,
    ]);

    const reviewPermissions = permissionsCategoriesHandler(permissionCategories);

    return (
        <Dialog
            fullScreen
            aria-labelledby="nav-menu-title"
            aria-describedby="nav-menu-description"
            open={open}
            TransitionComponent={motion}
            // onClose={handleClose}
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
                </Toolbar>
            </AppBar>
            <Grid
                container
                direction="row"
                justify="center"
                spacing={2}
                className={classes.menuContainer}>
                {rolePermissionsLoading ? (
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
                                    Fetching permissions
                                </div>
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <RoleAndNameDescriptionCard roleInfo={roleInfo} />
                        {reviewPermissions.map((permissionsCategory) => (
                            <RoleReviewCard
                                key={permissionsCategory.category}
                                category={permissionsCategory.category}
                                groups={permissionsCategory.groups}
                            />
                        ))}
                    </>
                )}
            </Grid>
        </Dialog>
    );
}
