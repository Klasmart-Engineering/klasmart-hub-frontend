import {
    useCreateRole,
    useGetAllRoles,
} from "@/api/roles";
import { currentMembershipVar } from "@/cache";
import CreateRoleDialog, { NewRole } from "@/pages/admin/Role/CreateRoleDialog";
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
    Table,
    useConfirm,
    useSnackbar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Head";
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

interface RoleRow {
    id: string;
    role: string;
}

interface Props {}

/**
 * Returns a match if property needs to be localized.
 * @param role Role to be checked.
 */
const checkRoleMatch = (role: string | undefined | null) => {
    if (!role) {
        return null;
    }

    const regex = new RegExp(
        `Organization Admin|Parent|School Admin|Student|Teacher`,
        `gmi`,
    );
    return regex.test(role);
};

/**
 * Returns function to show Rol Table in "View roles"
 */
export default function RoleTable(props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const [ rows, setRows ] = useState<RoleRow[]>([]);
    const [ open, setOpen ] = useState(false);
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
        loading,
        refetch,
    } = useGetAllRoles(
        membership.organization_id,
    );
    const [ createRole, { loading: loadingCreateRole } ] = useCreateRole();
    const confirm = useConfirm();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!data?.organization?.roles?.length) {
            setRows([]);
            return;
        }
        const rows: RoleRow[] = data.organization.roles.map((role) => ({
            id: role.role_id,
            role: checkRoleMatch(role.role_name)
                ? intl.formatMessage({
                    id: `roles_type${role.role_name?.replace(` `, ``)}`,
                })
                : role.role_name || ``,
        }));

        setRows(rows);
    }, [ data ]);

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
    ];

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setActiveStep(0);
    };

    const handleNext = async (): Promise<void> => {
        if (steps && activeStep === steps.length - 1) {
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
                handleClose();
            } catch (e) {
                enqueueSnackbar(
                    `Sorry, something went wrong, please try again`,
                    {
                        variant: `error`,
                    },
                );
            }
            return;
        }

        setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
    };

    return (
        <>
            <Paper className={classes.root}>
                <Table
                    columns={columns}
                    rows={rows}
                    loading={loading}
                    idField="id"
                    orderBy="role"
                    primaryAction={{
                        label: `Create`,
                        icon: AddIcon,
                        onClick: () => handleOpen(),
                    }}
                    rowActions={(row) => [
                        {
                            label: `Edit`,
                            icon: EditIcon,
                            onClick: (row) => console.log(`clicked`, row),
                        },
                        {
                            label: `Delete`,
                            icon: DeleteIcon,
                            onClick: async (row) => {
                                if (
                                    !(await confirm({
                                        variant: `error`,
                                        title: `Delete`,
                                        content: `Are you sure you to delete this role? This will permanently remove the role.`,
                                    }))
                                )
                                    return;
                                console.log(`we done`);
                            },
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
            {open && (
                <CreateRoleDialog
                    open={open}
                    steps={steps}
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    setNewRole={setNewRole}
                    handleNext={handleNext}
                    loadingCreateRole={loadingCreateRole}
                    handleClose={handleClose}
                />
            )}
        </>
    );
}
