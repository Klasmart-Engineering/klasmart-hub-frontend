import { GetRolePermissionsResponse } from "@/api/roles";
import RoleAndNameDescriptionCard from "@/components/Role/Card/ConfirmRoleInfo";
import PermissionsCard from "@/components/Role/Card/Permissions";
import RoleInfoCard from "@/components/Role/Card/RoleInfo";
import RoleReviewCard from "@/components/Role/Card/RoleReview";
import RolePermissionsActionsCard from "@/components/Role/PermissionsActions";
import RoleStepper from "@/components/Role/Stepper/Stepper";
import { RoleRow } from "@/components/Role/Table";
import DialogAppBar from "@/components/styled/dialogAppBar";
import {
    permissionsCategoriesHandler,
    sectionHandler,
    uniquePermissions,
} from "@/utils/permissions";
import { LinearProgress } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import { Theme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { xor } from "lodash";
import React,
{
    Dispatch,
    SetStateAction,
    useEffect,
    useMemo,
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
    name: string | null;
    description: string | null;
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
    loading: boolean | undefined;
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
        name: row.name ?? ``,
        description: row.description ?? ``,
    });
    const [ roleInfoIsValid, setRoleInfoIsValid ] = useState(true);
    const [ permissionCategories, setPermissionCategories ] = useState<PermissionsCategory[]>([]);
    const [ roleId, setRoleId ] = useState(``);
    const [ roleInfoLoading, setRoleInfoLoading ] = useState(true);
    const [ editedRolePermissions, setEditedRolePermissions ] = useState<string[]>([]);
    const [ checkedPermissions, setCheckedPermissions ] = useState<string[]>([]);
    const [ copiedRolePermissions, setCopiedRolePermissions ] = useState<string[]>([]);

    const isEditing = !!row.id;

    useEffect(() => {
        if (open && roles.length) {
            const permissions = uniquePermissions(roles) ?? [];
            const data = sectionHandler(permissions) ?? [];
            const permissionIds: string[] = [];

            if (rolePermissions?.role) {
                data.forEach((permissionCategory) => {
                    permissionCategory.groups.forEach((group) => {
                        group.permissionDetails.forEach((permissionDetail) => {
                            permissionDetail.checked = rolePermissions?.role.permissions.some((permission) => permission.permission_id === permissionDetail.permissionId);
                            if (permissionDetail.checked) {
                                permissionIds.push(permissionDetail.permissionId);
                            }
                        });
                    });
                });
            }

            setEditedRolePermissions(permissionIds);
            setCheckedPermissions(permissionIds);
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
            name: row.name ?? ``,
            description: row.description ?? ``,
        });
    }, [ row ]);

    useEffect(() => {
        if (!open) {
            setRoleId(``);
            setPermissionCategories([]);
            setRoleInfoLoading(true);
            setEditedRolePermissions([]);
            setCheckedPermissions([]);
            setCopiedRolePermissions([]);
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
        const newPermissionCategories = [ ...permissionCategories ];
        const permissionIds: string[] = [];

        newPermissionCategories.forEach((permissionCategory) => {
            permissionCategory.groups.forEach((group) => {
                group.permissionDetails.forEach((permissionDetail) => {
                    permissionDetail.checked = !!getPermissionIdsByRoleId(roles, roleId)?.includes(permissionDetail.permissionId);

                    if (permissionDetail.checked) {
                        permissionIds.push(permissionDetail.permissionId);
                    }
                });

                group.open = group.permissionDetails.some((permissionDetail) => permissionDetail.checked);

                group.selectAll = group.permissionDetails.every((permissionDetail) => permissionDetail.checked);
            });
        });

        setCheckedPermissions(permissionIds);
        setCopiedRolePermissions(permissionIds);
        setPermissionCategories(newPermissionCategories);
    };

    const replayButtonIsVisible = useMemo(() => {
        return roleId.length > 0 && xor(checkedPermissions, copiedRolePermissions).length !== 0;
    }, [
        roleId,
        checkedPermissions,
        copiedRolePermissions,
    ]);

    const resetToDefaultIsDisabled = useMemo(() => {
        return !editedRolePermissions.length ? true : xor(editedRolePermissions, checkedPermissions).length === 0;
    }, [ editedRolePermissions, checkedPermissions ]);

    const permissionsStepIsValid = useMemo(() => {
        return checkedPermissions.length > 0;
    }, [ checkedPermissions ]);

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

        setCheckedPermissions([]);
        setPermissionCategories(newPermissions);
    };

    const handleCopyFromRoleReset = () => {
        newRolesAndPermissionsByRoleId(roles, roleId);
    };

    const handleResetToDefault = () => {
        const newPermissionCategories = [ ...permissionCategories ];
        const permissionIds: string[] = [];
        setRoleId(``);

        newPermissionCategories.forEach((permissionCategory) => {
            permissionCategory.groups.forEach((group) => {
                group.permissionDetails.forEach((permissionDetail) => {
                    permissionDetail.checked = !!getPermissionIdsByRoleId(roles, row.id)?.includes(permissionDetail.permissionId);
                    if (permissionDetail.checked) {
                        permissionIds.push(permissionDetail.permissionId);
                    }
                });

                group.open = group.permissionDetails.some((permissionDetail) => permissionDetail.checked);

                group.selectAll = group.permissionDetails.every((permissionDetail) => permissionDetail.checked);
            });
        });

        setCheckedPermissions(permissionIds);
        setPermissionCategories(newPermissionCategories);
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
            return <>
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
                        ...(isEditing ? [
                            {
                                text: intl.formatMessage({
                                    id: `rolesInfoCard_resetLabel`,
                                }),
                                disabled: resetToDefaultIsDisabled,
                                onClick: handleResetToDefault,
                            },
                        ] : []),
                    ]}
                    textFieldLabel={intl.formatMessage({
                        id: `rolesInfoCard_copyLabel`,
                    })}
                    handleCopyFromRoleReset={handleCopyFromRoleReset}
                    replayButtonIsVisible={replayButtonIsVisible}
                    onChange={copyRoleHandler}
                />
                {permissionCategories.map((permissionsCategory) => (
                    <PermissionsCard
                        key={permissionsCategory.category}
                        category={permissionsCategory.category}
                        groups={permissionsCategory.groups}
                        checkedPermissions={checkedPermissions}
                        setCheckedPermissions={setCheckedPermissions}
                    />
                ))}
            </>;
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
                                            {isEditing ? `Editing role` : <FormattedMessage id="rolesInfoCard_createNewRoleLabel" />}
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
                role_name: roleInfo.name ?? ``,
                role_description: roleInfo.description ?? ``,
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
                createOrEditTitle={isEditing ? intl.formatMessage({
                    id: `rolesInfoCard_editTitle`,
                }) : intl.formatMessage({
                    id: `rolesInfoCard_createTitle`,
                })}
            />
            <div className={classes.stepper}>
                <RoleStepper
                    activeStep={activeStep}
                    steps={steps} />
            </div>
            <Grid
                container
                direction="row"
                justifyContent="center"
                spacing={2}
                className={classes.menuContainer}>
                {getStepContent(activeStep)}
            </Grid>
        </Dialog>
    );
}
