import {
    useCreateRole,
    useEditRole,
    useGetOrganizationRolesPermissions,
    useGetRolePermissions,
} from "@/api/roles";
import CreateAndEditRoleDialog, {
    NewRole,
    Role,
} from "@/components/Role/Dialog/CreateEdit";
import DeleteRoleDialog from "@/components/Role/Dialog/Delete";
import ViewRoleDetailsDialog from "@/components/Role/Dialog/ViewDetails";
import globalStyles from "@/globalStyles";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Status } from "@/types/graphQL";
import { usePermission } from "@/utils/permissions";
import {
    getTableLocalization,
    TableProps,
} from "@/utils/table";
import {
    CursorTable,
    useConfirm,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { TableColumn } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Head";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@mui/icons-material";
import { Link } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import { useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => {
    const { clickable, primaryText } = globalStyles(theme);
    return createStyles({
        clickable,
        primaryText,
    });
});

export interface RoleRow {
    id: string;
    name?: string;
    description?: string;
    status?: Status.ACTIVE | Status.INACTIVE;
    type?: string;
    system?: boolean;
}

interface Props extends TableProps<RoleRow> {
}

export default function RoleTable (props: Props) {
    const {
        rows,
        loading,
        order,
        orderBy,
        rowsPerPage,
        search,
        cursor,
        refetch,
        total,
        hasNextPage,
        hasPreviousPage,
        startCursor,
        endCursor,
        onPageChange,
        onTableChange,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const canCreate = usePermission(`create_role_with_permissions_30222`);
    const canDelete = usePermission(`delete_role_30440`);
    const canEdit = usePermission(`edit_role_and_permissions_30332`);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openDeleteDialog, setOpenDeleteDialog ] = useState(false);
    const [ openViewDialog, setOpenViewDialog ] = useState(false);
    const initialRow = {
        id: ``,
        name: ``,
        description: ``,
        type: ``,
        system: false,
    };
    const [ row, setRow ] = useState<RoleRow>(initialRow);
    const [ activeStep, setActiveStep ] = useState(0);
    const steps = [
        intl.formatMessage({
            id: `roles_roleInfoStep`,
        }),
        intl.formatMessage({
            id: `roles_setPermissionsStep`,
        }),
        intl.formatMessage({
            id: `roles_confirmRoleStep`,
        }),
    ];
    const [ newRole, setNewRole ] = useState<NewRole>({
        role_name: ``,
        role_description: ``,
        permission_names: [],
    });

    const currentOrganization = useCurrentOrganization();
    const {
        data,
        loading: getAllRolesLoading,
        refetch: refetchOrganizationRolesPermissions,
    } = useGetOrganizationRolesPermissions(currentOrganization?.id ?? ``);
    const roles: Role[] = data?.organization?.roles ?? [];

    const {
        data: rolePermissions,
        loading: rolePermissionsLoading,
        refetch: refetchRolePermissions,
    } = useGetRolePermissions({
        fetchPolicy: `network-only`,
        variables: {
            role_id: row.id,
        },
        skip: !row.id,
    });

    const [ createRole ] = useCreateRole();
    const [ editRole ] = useEditRole();
    const confirm = useConfirm();
    const { enqueueSnackbar } = useSnackbar();

    const columns: TableColumn<RoleRow>[] = [
        {
            id: `id`,
            label: `Id`,
            hidden: true,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `groups_roleTitle`,
            }),
            persistent: true,
            render: (row) => (
                <Link
                    href={undefined}
                    className={clsx(classes.clickable, classes.primaryText)}
                    onClick={() => handleOpenViewDialog(row)}
                >
                    {row.name}
                </Link>
            ),
        },
        {
            id: `description`,
            label: intl.formatMessage({
                id: `roles_roleDescription`,
            }),
        },
        {
            id: `type`,
            label: intl.formatMessage({
                id: `roles_type`,
            }),
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
    };

    const handleOpenDeleteDialog = (row: RoleRow) => {
        setOpenDeleteDialog(true);
        setRow(row);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleOpenViewDialog = (row: RoleRow) => {
        setOpenViewDialog(true);
        setRow(row);
    };

    const handleCloseViewDialog = () => {
        setOpenViewDialog(false);
        setRow(initialRow);
    };

    const createNewRoleHandler = async (): Promise<void> => {
        try {
            if (
                !(await confirm({
                    title: intl.formatMessage({
                        id: `roles_confirmNewRoleTitle`,
                    }),
                    content: intl.formatMessage({
                        id: `roles_confirmNewRoleContent`,
                    }),
                    okLabel: intl.formatMessage({
                        id: `roles_confirmNewRoleLabel`,
                    }),
                }))
            ) {
                return;
            }

            const response = await createRole({
                variables: {
                    organization_id: currentOrganization?.id ?? ``,
                    role_name: newRole.role_name,
                    role_description: newRole.role_description,
                    permission_names: newRole.permission_names,
                },
            });

            if (response?.data?.organization?.createRole === null) throw new Error();

            await refetch?.();
            enqueueSnackbar(intl.formatMessage({
                id: `roles_confirmSuccess`,
            }), {
                variant: `success`,
            });
            handleCloseDialog();
        } catch (e) {
            enqueueSnackbar(intl.formatMessage({
                id: `roles_confirmError`,
            }), {
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

            await editRole({
                variables: {
                    role_id: row.id,
                    role_name: newRole.role_name ?? ``,
                    role_description: newRole.role_description ?? ``,
                    permission_names: newRole.permission_names,
                },
            });

            await refetch?.();
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
                await editRoleHandler();
            } else {
                await createNewRoleHandler();
            }

        }

        setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
    };

    return (
        <>
            <CursorTable
                columns={columns}
                rows={rows}
                loading={loading}
                idField="id"
                orderBy={orderBy}
                order={order}
                rowsPerPage={rowsPerPage}
                search={search}
                cursor={cursor}
                hasNextPage={!loading ? hasNextPage : false}
                hasPreviousPage={!loading ? hasPreviousPage : false}
                startCursor={startCursor}
                endCursor={endCursor}
                total={total}
                primaryAction={{
                    label: intl.formatMessage({
                        id: `roles_createRole`,
                    }),
                    icon: AddIcon,
                    disabled: !canCreate,
                    onClick: () => handleOpenDialog(initialRow),
                }}
                rowActions={(row) => [
                    {
                        label: intl.formatMessage({
                            id: `roles_editButton`,
                        }),
                        icon: EditIcon,
                        disabled: !canEdit || row.system,
                        onClick: handleOpenDialog,
                    },
                    {
                        label: intl.formatMessage({
                            id: `roles_deleteButton`,
                        }),
                        icon: DeleteIcon,
                        disabled: !canDelete || row.system,
                        onClick: handleOpenDeleteDialog,
                    },
                ]}
                localization={getTableLocalization(intl, {
                    title: intl.formatMessage({
                        id: `roles_title`,
                    }),
                    placeholder: intl.formatMessage({
                        id: `groups_searchPlaceholder`,
                    }),
                })}
                onPageChange={onPageChange}
                onChange={onTableChange}
            />
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
                refetch={refetchOrganizationRolesPermissions}
            />

            <ViewRoleDetailsDialog
                open={openViewDialog}
                row={row}
                handleClose={handleCloseViewDialog}
                roles={roles}
                rolePermissions={rolePermissions}
                rolePermissionsLoading={rolePermissionsLoading}
            />
        </>
    );
}
