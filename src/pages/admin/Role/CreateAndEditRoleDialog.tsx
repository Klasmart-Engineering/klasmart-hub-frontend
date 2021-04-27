import { GetRolePermissionsResponse } from "@/api/roles";
import PermissionsCard from "@/components/Roles/PermissionsCard";
import RoleAndNameDescriptionCard from "@/components/Roles/RoleAndNameDescriptionCard";
import RoleInfoCard from "@/components/Roles/RoleInfoCard";
import RolePermissionsActionsCard from "@/components/Roles/RolePermissionsActionsCard";
import RoleReviewCard from "@/components/Roles/RoleReviewCard";
import RoleStepper from "@/components/Roles/RoleStepper";
import DialogAppBar from "@/components/styled/dialogAppBar";
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
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import {
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";
import Typography from "@material-ui/core/Typography";
import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        confirmationCard: {
            width: `100%`,
            height: `106px`,
            borderRadius: 10,
            marginBottom: `13px`,
        },
        stepper: {
            boxShadow: `0 4px 8px 0 rgba(0,0,0,0.2)`,
        },
        menuContainer: {
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(2, 2),
            },
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

export interface Permission {
    permission_name: string;
    permission_id: string;
    permission_group: string;
    permission_level: string;
    permission_category: string;
    permission_description: string;
    levels?: string[];
}

export interface Role {
    role_id: string;
    role_name: string;
    role_description?: string | null;
    system_role?: boolean | null;
    status?: string | null;
    permissions: Permission[];
}

export interface PermissionDetail {
    permissionName: string;
    permissionId: string;
    permissionDescription: string;
    levels?: string[];
    checked: boolean;
}

export interface Group {
    open: boolean;
    group: string;
    selectAll: boolean;
    permissionDetails: PermissionDetail[];
}

export interface PermissionsCategory {
    category: string;
    groups: Group[];
}

export interface RoleInfo {
    name: string;
    description: string;
}

export interface NewRole {
    role_name: string;
    role_description: string;
    permission_names: string[];
}

interface Props {
    open: boolean;
    steps: string[];
    activeStep: number;
    setActiveStep: Dispatch<SetStateAction<number>>;
    handleNext: () => Promise<void>;
    setNewRole: Dispatch<SetStateAction<NewRole>>;
    handleClose: () => void;
    row: RoleRow;
    roles: Role[];
    loading: boolean;
    rolePermissions: GetRolePermissionsResponse | undefined;
    rolePermissionsLoading: boolean;
}

export default function CreateAndEditRoleDialog (props: Props) {
    const {
        open,
        steps,
        activeStep,
        setActiveStep,
        handleNext,
        setNewRole,
        handleClose,
        row,
        roles,
        loading,
        rolePermissions,
        rolePermissionsLoading,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const [ roleInfo, setRoleInfo ] = useState<RoleInfo>({
        name: row.role,
        description: row.description,
    });
    const [ roleInfoIsValid, setRoleInfoIsValid ] = useState(true);
    const [ permissionCategories, setPermissionCategories ] = useState<PermissionsCategory[]>([]);
    const [ roleId, setRoleId ] = useState(``);
    const [ roleInfoLoading, setRoleInfoLoading ] = useState(true);
    const [ permissionsStepIsValid, setPermissionsStepIsValid ] = useState(false);

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

    useEffect(() => {
        if (!rolePermissionsLoading && permissionCategories.length) {
            setRoleInfoLoading(false);
        }
    }, [ rolePermissionsLoading, permissionCategories ]);

    useEffect(() => {
        setRoleInfo({
            name: row.role,
            description: row.description,
        });
    }, [ row ]);

    useEffect(() => {
        if (!open) {
            setRoleId(``);
            setPermissionCategories([]);
            setRoleInfoLoading(true);
        }
    }, [ open ]);

    const reviewPermissions = permissionsCategoriesHandler(permissionCategories);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const getPermissionIdsByRoleId = (roles: Role[], roleId: string) => {
        return roles
            .filter((role) => role.role_id === roleId)
            .reduce((permissionIds: string[], role) => {
                role.permissions.forEach((permission) => {
                    permissionIds.push(permission.permission_id);
                });

                return permissionIds;
            }, []);
    };

    const newRolesAndPermissionsByRoleId = (roles: Role[], roleId: string) => {
        const newPermissions = [ ...permissionCategories ];

        newPermissions.forEach((permissionCategory) => {
            permissionCategory.groups.forEach((group) => {
                group.permissionDetails.forEach((permissionDetail) => {
                    permissionDetail.checked = !!getPermissionIdsByRoleId(roles, roleId)?.includes(permissionDetail.permissionId);
                });

                group.open = group.permissionDetails.some((permissionDetail) => permissionDetail.checked);

                group.selectAll = group.permissionDetails.every((permissionDetail) => permissionDetail.checked);
            });
        });

        setPermissionCategories(newPermissions);
    };

    const copyRoleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    function getStepContent (step: number) {
        switch (step) {
        case 0:
            return (
                <RoleInfoCard
                    roleInfo={roleInfo}
                    setRoleInfo={setRoleInfo}
                    setRoleInfoIsValid={setRoleInfoIsValid}
                    roles={roles}
                    row={row}
                    loading={roleInfoLoading}
                />
            );
        case 1:
            return (
                <>
                    <RolePermissionsActionsCard
                        roles={roles.filter((role) => role.role_id !== row.id)}
                        roleId={roleId}
                        actions={[
                            {
                                text: intl.formatMessage({
                                    id: `rolesInfoCard_clearLabel`,
                                }),
                                disabled: false,
                                onClick: handleClear,
                            },
                            {
                                text: intl.formatMessage({
                                    id: `rolesInfoCard_resetLabel`,
                                }),
                                disabled: roleId.length === 0,
                                onClick: handleResetDefault,
                            },
                        ]}
                        textFieldLabel={intl.formatMessage({
                            id: `rolesInfoCard_copyLabel`,
                        })}
                        onChange={copyRoleHandler}
                    />
                    {permissionCategories.map((permissionsCategory) => (
                        <PermissionsCard
                            key={permissionsCategory.category}
                            category={permissionsCategory.category}
                            groups={permissionsCategory.groups}
                            setPermissionsStepIsValid={setPermissionsStepIsValid}
                            permissionCategories={permissionCategories}
                        />
                    ))}
                </>
            );
        case 2:
            return (
                <>
                    {loading ? (
                        <Card className={classes.confirmationCard}>
                            <CardContent>
                                <div>
                                    <LinearProgress />
                                    <Typography
                                        variant="body1"
                                        color="textSecondary"
                                        component="div">
                                        <div
                                            style={{
                                                padding: `10px`,
                                            }}
                                        >
                                            {row.id ? `Editing role` : <FormattedMessage id="rolesInfoCard_createNewRoleLabel" />}
                                        </div>
                                    </Typography>
                                </div>
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
                </>
            );
        default:
            return <FormattedMessage id="rolesInfoCard_finishLabel" />;
        }
    }

    useEffect(() => {
        if (activeStep === 2) {
            const permissions = permissionCategories.reduce((permissionIds: string[], permissionsCategory) => {
                permissionsCategory.groups.forEach((group) => {
                    group.permissionDetails.forEach((permissionDetail) => {
                        if (permissionDetail.checked) {
                            permissionIds.push(permissionDetail.permissionId);
                        }
                    });
                });

                return permissionIds;
            }, []);

            setNewRole({
                role_name: roleInfo.name,
                role_description: roleInfo.description,
                permission_names: permissions,
            });
        }
    }, [ permissionCategories, activeStep ]);

    return (
        <Dialog
            fullScreen
            aria-labelledby="nav-menu-title"
            aria-describedby="nav-menu-description"
            open={open}
            TransitionComponent={motion}
            onClose={handleClose}
        >
            <DialogAppBar
                handleClose={handleClose}
                // subtitleID={`navMenu_adminConsoleLabel`}
                steps={steps}
                activeStep={activeStep}
                handleBack={handleBack}
                handleNext={handleNext}
                handleReset={handleReset}
                roleInfoStepIsValid={roleInfoIsValid}
                permissionsStepIsValid={permissionsStepIsValid}
            />
            <div className={classes.stepper}>
                <RoleStepper
                    activeStep={activeStep}
                    steps={steps} />
            </div>
            <Grid
                container
                direction="row"
                justify="center"
                spacing={2}
                className={classes.menuContainer}>
                {getStepContent(activeStep)}
            </Grid>
        </Dialog>
    );
}
