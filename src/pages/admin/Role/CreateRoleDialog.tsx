import { useGetOrganizationRolesPermissions } from "@/api/roles";
import { currentMembershipVar } from "@/cache";
import PermissionsActionsCard from "@/components/Roles/PermissionsActionsCard";
import PermissionsCard from "@/components/Roles/PermissionsCard";
import RoleAndNameDescriptionCard from "@/components/Roles/RoleAndNameDescriptionCard";
import RoleInfoCard from "@/components/Roles/RoleInfoCard";
import RoleReviewCard from "@/components/Roles/RoleReviewCard";
import RoleStepper from "@/components/Roles/RoleStepper";
import DialogAppBar from "@/components/styled/dialogAppBar";
import {
    sectionHandler,
    uniquePermissions,
} from "@/pages/admin/Role/permissionsHandler";
import { alphanumeric } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        confirmationCard: {
            width: theme.breakpoints.values.lg,
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
    loadingCreateRole: boolean;
    setNewRole: Dispatch<SetStateAction<NewRole>>;
    handleClose: () => void;
}

export default function CreateRoleDialog(props: Props) {
    const classes = useStyles();
    const {
        open,
        steps,
        activeStep,
        setActiveStep,
        handleNext,
        loadingCreateRole,
        setNewRole,
        handleClose,
    } = props;
    const [ roleInfo, setRoleInfo ] = useState<RoleInfo>({
        name: ``,
        description: ``,
    });
    const [ rolesAndPermissions, setRolesAndPermissions ] = useState<
        PermissionsCategory[]
    >([]);
    const [ loading, setLoading ] = useState(true);
    const [ permissionsStepIsValid, setPermissionsStepIsValid ] = useState(false);
    const membership = useReactiveVar(currentMembershipVar);
    const {
        data: rolePermissions,
        loading: rolePermissionsLoading,
    } = useGetOrganizationRolesPermissions(membership.organization_id);

    useEffect(() => {
        if (rolePermissions) {
            const roles = rolePermissions.organization.roles ?? [];
            const permissions = uniquePermissions(roles) ?? [];
            const data = sectionHandler(permissions) ?? [];

            setRolesAndPermissions(data);
        }
    }, [ rolePermissions ]);

    useEffect(() => {
        if (!rolePermissionsLoading && rolesAndPermissions.length) {
            setLoading(false);
        }
    }, [ rolePermissionsLoading, rolesAndPermissions ]);

    const reviewPermissions = rolesAndPermissions.reduce(
        (acc: PermissionsCategory[], permissionsCategory) => {
            const hasPermissions = permissionsCategory.groups.reduce(
                (acc: Group[], group) => {
                    if (
                        group.permissionDetails.some(
                            (permissionDetail) => permissionDetail.checked,
                        )
                    ) {
                        acc.push(group);
                    }

                    return acc;
                },
                [],
            );

            if (hasPermissions.length) {
                acc.push(permissionsCategory);
            }

            return acc;
        },
        [],
    ) as PermissionsCategory[];

    const roleNameTextHelper = (name: string): string => {
        if (!name.length) return `Role name can't be empty`;

        if (name.length < 2) return `Role name should be at least 2 characters`;

        if (name.length > 20)
            return `Role name should not be longer than 20 characters`;

        if (alphanumeric(name)) return `Only alphanumeric characters are valid`;
        return ``;
    };

    const roleDescriptionTextHelper = (name: string): string => {
        if (name.length > 30)
            return `Description can't be longer than 30 characters`;

        if (alphanumeric(name)) return `Only alphanumeric characters are valid`;
        return ``;
    };

    const roleInfoStepIsValid = (): boolean => {
        return (
            roleNameTextHelper(roleInfo.name).length > 0 ||
            roleDescriptionTextHelper(roleInfo.description).length > 0
        );
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function getStepContent(step: number) {
        switch (step) {
        case 0:
            return (
                <RoleInfoCard
                    roleInfo={roleInfo}
                    setRoleInfo={setRoleInfo}
                    loading={loading}
                    nameTextHelper={roleNameTextHelper}
                    descriptionTextHelper={roleDescriptionTextHelper}
                />
            );
        case 1:
            return (
                <>
                    <PermissionsActionsCard />
                    {rolesAndPermissions.map((permissionsCategory) => (
                        <PermissionsCard
                            key={permissionsCategory.category}
                            category={permissionsCategory.category}
                            groups={permissionsCategory.groups}
                            setPermissionsStepIsValid={
                                setPermissionsStepIsValid
                            }
                            rolesAndPermissions={rolesAndPermissions}
                        />
                    ))}
                </>
            );
        case 2:
            return (
                <>
                    {loadingCreateRole ? (
                        <Card className={classes.confirmationCard}>
                            <CardContent>
                                <div>
                                    <LinearProgress />
                                    <Typography
                                        variant="body1"
                                        color="textSecondary"
                                        component="div"
                                    >
                                        <div
                                            style={{
                                                padding: `10px`,
                                            }}
                                        >
                                                Creating a new role
                                        </div>
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <RoleAndNameDescriptionCard
                                roleInfo={roleInfo}
                            />
                            {reviewPermissions.map(
                                (permissionsCategory) => (
                                    <RoleReviewCard
                                        key={permissionsCategory.category}
                                        category={
                                            permissionsCategory.category
                                        }
                                        groups={permissionsCategory.groups}
                                    />
                                ),
                            )}
                        </>
                    )}
                </>
            );
        default:
            return `You have finish the role creation process`;
        }
    }

    useEffect(() => {
        if (activeStep === 2) {
            const permissions = rolesAndPermissions.reduce(
                (acc: string[], permissionsCategory) => {
                    permissionsCategory.groups.forEach((group) => {
                        group.permissionDetails.forEach((permissionDetail) => {
                            if (permissionDetail.checked) {
                                acc.push(permissionDetail.permissionId);
                            }
                        });
                    });

                    return acc;
                },
                [],
            );

            setNewRole({
                role_name: roleInfo.name,
                role_description: roleInfo.description,
                permission_names: permissions,
            });
        }
    }, [ rolesAndPermissions, activeStep ]);

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
                roleInfoStepIsValid={roleInfoStepIsValid()}
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
                className={classes.menuContainer}
            >
                {getStepContent(activeStep)}
            </Grid>
        </Dialog>
    );
}
