import {
    useDeleteOrganizationOwnership,
    useGetOrganizationOwnerships,
} from "@/api/organizations";
import { OrganizationOwnership } from "@/types/graphQL";
import { history } from "@/utils/history";
import { getTableLocalization } from "@/utils/table";
import {
    Button,
    CircularProgress,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import {
    BaseTable,
    useSnackbar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Base/Table/Head";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) =>
    createStyles({
        activeColor: {
            color: `#2BA600`,
            fontWeight: `bold`,
            textTransform: `capitalize`,
        },
        inactiveColor: {
            color: `#FF0000`,
            fontWeight: `bold`,
            textTransform: `capitalize`,
        },
    }),
);

interface MyOrganizationRow {
    id: string;
    name: string;
    phone: string;
    email: string;
    roles: string[];
    status: string;
}

interface Props {
}

/**
 * Returns function to show My Organizations Table for "All Organizations" section
 */
export default function MyOrganizationTable(props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ selectedOrganization, setSelectedOrganization ] = useState<MyOrganizationRow>();
    const {
        data,
        loading,
        refetch,
    } = useGetOrganizationOwnerships();
    const [ deleteOrganization, { loading: deleteLoading } ] = useDeleteOrganizationOwnership();
    const [ rows, setRows ] = useState<MyOrganizationRow[]>([]);
    const [ confirmLeaveOrganizationDialogOpen, setConfirmLeaveOrganizationDialogOpen ] = useState(false);

    const showConfirmDeleteOrganization = (row: MyOrganizationRow) => {
        setConfirmLeaveOrganizationDialogOpen(true);
        setSelectedOrganization(row);
    };

    const closeConfirmDeleteOrganization = () => {
        setConfirmLeaveOrganizationDialogOpen(false);
    };

    useEffect(() => {
        const organizationOwnerships = data?.me?.organization_ownerships ?? [];
        if (!organizationOwnerships.length) {
            setRows([]);
            return;
        }

        const rows: MyOrganizationRow[] = organizationOwnerships.map(
            (organizationOwnership: OrganizationOwnership) => ({
                id: organizationOwnership?.organization?.organization_id ?? ``,
                name: organizationOwnership?.organization?.organization_name ?? ``,
                phone: organizationOwnership?.organization?.phone ?? ``,
                email: organizationOwnership?.user?.email ?? ``,
                roles: organizationOwnership?.organization?.roles?.map((role) => role.role_name ?? ``) ?? [],
                status: organizationOwnership?.status ?? ``,
            }),
        );

        setRows(rows);
    }, [ data ]);

    const deleteSelectedOrganization = async (): Promise<void> => {
        if (!selectedOrganization?.id) return;
        try {
            await deleteOrganization({
                variables: {
                    organization_id: selectedOrganization.id,
                },
            });
            await refetch();
            setConfirmLeaveOrganizationDialogOpen(false);
            enqueueSnackbar(`The organization has been deleted successfully`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`An error occurred while deleting the organization`, {
                variant: `error`,
            });
        }
    };

    const columns: TableColumn<MyOrganizationRow>[] = [
        {
            id: `id`,
            label: `Id`,
            hidden: true,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `allOrganization_organizationName`,
            }),
        },
        {
            id: `phone`,
            label: intl.formatMessage({
                id: `allOrganization_phone`,
            }),
        },
        {
            id: `email`,
            label: intl.formatMessage({
                id: `allOrganization_email`,
            }),
        },
        {
            id: `roles`,
            label: intl.formatMessage({
                id: `allOrganization_roles`,
            }),
            disableSort: true,
            render: (row) =>
                row.roles?.map((role, i) => (
                    <Typography
                        key={`role-${i}`}
                        noWrap
                        variant="body2">
                        {role}
                    </Typography>
                )),
        },
        {
            id: `status`,
            label: `Status`,
            render: (row) =>
                <span
                    className={clsx({
                        [classes.activeColor]: row.status === `active`,
                        [classes.inactiveColor]: row.status === `inactive`,
                    })}
                >
                    {row.status}
                </span>,
        },
    ];

    return (
        <>
            <BaseTable
                columns={columns}
                rows={rows}
                loading={loading}
                idField={`id`}
                primaryAction={{
                    label: `Create`,
                    icon: AddIcon,
                    onClick: (tableData) => history.push(`/admin/create-organization`),
                }}
                rowActions={(row) => [
                    {
                        label: `Edit`,
                        icon: EditIcon,
                        onClick: (row) => history.push(`/admin/edit-organization/${row.id}`),
                    },
                    {
                        label: `Delete`,
                        icon: DeleteIcon,
                        onClick: (row) => showConfirmDeleteOrganization(row),
                    },
                ]}
                rowsPerPage={1}
                rowsPerPageOptions={[]}
                localization={getTableLocalization(intl, {
                    toolbar: {
                        title: intl.formatMessage({
                            id: `allOrganization_myOrganizations`,
                        }),
                    },
                    body: {
                        noData: intl.formatMessage({
                            id: `allOrganization_noRecords`,
                        }),
                    },
                })}
            />
            <Dialog
                open={confirmLeaveOrganizationDialogOpen}
                onClose={closeConfirmDeleteOrganization}
            >
                <DialogTitle />
                <DialogContent dividers>
                    <p>
                        Are you sure you want to delete {selectedOrganization?.name}?
                    </p>
                    {deleteLoading && (
                        <Grid
                            container
                            justify="center">
                            <CircularProgress />
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={deleteSelectedOrganization}
                    >
                        {intl.formatMessage({
                            id: `allOrganization_okButton`,
                        })}
                    </Button>
                    <Button
                        color="primary"
                        onClick={closeConfirmDeleteOrganization}
                    >
                        {intl.formatMessage({
                            id: `allOrganization_cancelButton`,
                        })}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
