import {
    useCreateRole,
    useEditRole,
    useGetOrganizationRolesPermissions,
    useGetRolePermissions,
} from "@/api/roles";
import { currentMembershipVar } from "@/cache";
import CreateAndEditRoleDialog, {
    NewRole,
    Role,
} from "@/pages/admin/Role/CreateAndEditRoleDialog";
import DeleteRoleDialog from "@/pages/admin/Role/DeleteRoleDialog";
import { usePermission } from "@/utils/checkAllowed";
import { systemRoles } from "@/utils/permissions/systemRoles";
import { getTableLocalization } from "@/utils/table";
import { useReactiveVar } from "@apollo/client";
import { Paper } from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@material-ui/icons";
import {
    PageTable,
    useConfirm,
    useSnackbar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: `100%`,
        },
    }),
);

export interface RoleRow {
    id: string;
    role: string;
    description: string;
    type: string;
    systemRole: boolean;
}

/**
 * Returns a match if property needs to be localized.
 * @param role Role to be checked.
 */
const checkRoleMatch = (role: string | undefined | null) => {
    if (!role) {
        return null;
    }

    return systemRoles.includes(role.trim());
};

/**
 * Returns function to show Rol Table in "View roles"
 */
export default function RoleTable() {
    const classes = useStyles();
    const intl = useIntl();
    const canView = usePermission(`view_role_permissions_30112`);
    const canCreate = usePermission(`create_role_with_permissions_30222`);
    const canDelete = usePermission(`delete_groups_30440`);
    const canEdit  = usePermission(`edit_role_permissions_30332`);
    const [ rows, setRows ] = useState<RoleRow[]>([]);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openDeleteDialog, setOpenDeleteDialog ] = useState(false);
    const initialRow = {
        id: ``,
        role: ``,
        description: ``,
        type: ``,
        systemRole: false,
    };
    const [ row, setRow ] = useState<RoleRow>(initialRow);
    const [ activeStep, setActiveStep ] = useState(0);
    const steps = [
        `Role Info`,
        `Set Permissions`,
        `Confirm role`,
    ];
    const [ newRole, setNewRole ] = useState<NewRole>({
        role_name: ``,
        role_description: ``,
        permission_names: [],
    });

    const membership = useReactiveVar(currentMembershipVar);
    const {
        data,
        loading: getAllRolesLoading,
        refetch,
    } = useGetOrganizationRolesPermissions(
        membership.organization_id,
    );
    const roles: Role[] = data?.organization?.roles ?? [];
    const {
        data: rolePermissions,
        loading: rolePermissionsLoading,
        refetch: refetchRolePermissions,
    } = useGetRolePermissions(row.id);
    const [ createRole ] = useCreateRole();
    const [ editRole ] = useEditRole();
    const confirm = useConfirm();
    const { enqueueSnackbar } = useSnackbar();
    const [ loading, setLoading ] = useState(false);

    const systemTypeHandler = (systemRole: boolean | null | undefined) => {
        return systemRole ? `System Role` : `Custom Role`;
    };

    useEffect(() => {
        if (roles.length) {
            const rows: RoleRow[] = roles
                .filter((role) => role.status === `active`)
                .map((role) => ({
                    id: role.role_id,
                    role: checkRoleMatch(role.role_name)
                        ? intl.formatMessage({
                            id: `roles_type${role.role_name?.replace(` `, ``)}`,
                        })
                        : role.role_name || ``,
                    description: role.role_description || ``,
                    type: systemTypeHandler(role.system_role),
                    systemRole: role.system_role ?? false,
                }));

            if (!canView) {
                setRows([]);
                return;
            }

            setRows(rows);
        }
    }, [ roles, canView ]);

    const columns: TableColumn<RoleRow>[] = [
        {
            id: `id`,
            label: `Id`,
            hidden: true,
        },
        {
            id: `role`,
            label: intl.formatMessage({
                id: `groups_roleTitle`,
            }),
            persistent: true,
        },
        {
            id: `description`,
            label: `Role Description`,
        },
        {
            id: `type`,
            label: `Type`,
        },
    ];

    const handleOpenDialog = (row: RoleRow) => {
        setOpenCreateDialog(true);
        setRow(row);
    };

    const handleCloseDialog = () => {
        setOpenCreateDialog(false);
        setActiveStep(0);
        setRow(initialRow);
        setLoading(false);
    };

    const handleOpenDeleteDialog = (row: RoleRow) => {
        setOpenDeleteDialog(true);
        setRow(row);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const createNewRoleHandler = async (): Promise<void> => {
        try {
            if (
                !(await confirm({
                    title: `Create New Role?`,
                    content: `This will create a new role in this organization`,
                    okLabel: `Create`,
                }))
            ) {
                return;
            }

            setLoading(true);

            const response = await createRole({
                variables: {
                    organization_id: membership.organization_id,
                    role_name: newRole.role_name,
                    role_description: newRole.role_description,
                    permission_names: newRole.permission_names,
                },
            });

            if (response?.data?.organization?.createRole === null) {
                throw new Error();
            }

            await refetch();
            enqueueSnackbar(`A new role has been created successfully`, {
                variant: `success`,
            });
            handleCloseDialog();
        } catch (e) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    const editRoleHandler = async (): Promise<void> => {
        try {
            if (
                !(await confirm({
                    title: `Edit this Role?`,
                    content: `This will edit the role in this organization`,
                    okLabel: `Edit`,
                }))
            ) {
                return;
            }

            setLoading(true);

            await editRole({
                variables: {
                    role_id: row.id,
                    role_name: newRole.role_name,
                    role_description: newRole.role_description,
                    permission_names: newRole.permission_names,
                },
            });

            await refetch();
            await refetchRolePermissions();
            enqueueSnackbar(`The role has been edited successfully`, {
                variant: `success`,
            });
            handleCloseDialog();
        } catch (e) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    const handleNext = async (): Promise<void> => {
        if (steps && activeStep === steps.length - 1) {
            if (row.id) {
                return await editRoleHandler();
            }

            return await createNewRoleHandler();
        }

        setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
    };

    return (
        <>
            <Paper className={classes.root}>
                <PageTable
                    columns={columns}
                    rows={rows}
                    loading={getAllRolesLoading}
                    idField="id"
                    orderBy="role"
                    primaryAction={{
                        label: `Create`,
                        icon: AddIcon,
                        disabled: !canCreate,
                        onClick: () => handleOpenDialog(initialRow),
                    }}
                    rowActions={(row) => [
                        {
                            label: `Edit`,
                            icon: EditIcon,
                            disabled: !canEdit || row.systemRole,
                            onClick: (row) => handleOpenDialog(row),
                        },
                        {
                            label: `Delete`,
                            icon: DeleteIcon,
                            disabled: !canDelete || row.systemRole,
                            onClick: (row) => handleOpenDeleteDialog(row),
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `roles_title`,
                            }),
                        },
                        search: {
                            placeholder: intl.formatMessage({
                                id: `groups_searchPlaceholder`,
                            }),
                        },
                        body: {
                            noData: intl.formatMessage({
                                id: `groups_noRecords`,
                            }),
                        },
                    })}
                />
            </Paper>

            <CreateAndEditRoleDialog
                open={openCreateDialog}
                steps={steps}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setNewRole={setNewRole}
                handleNext={handleNext}
                handleClose={handleCloseDialog}
                row={row}
                roles={roles}
                loading={loading}
                rolePermissions={rolePermissions}
                rolePermissionsLoading={rolePermissionsLoading}
            />

            <DeleteRoleDialog
                open={openDeleteDialog}
                handleClose={handleCloseDeleteDialog}
                row={row}
                roles={roles}
                getAllRolesLoading={getAllRolesLoading}
                refetch={refetch}
            />
        </>
    );
}
