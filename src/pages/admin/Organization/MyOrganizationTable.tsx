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
    Paper,
    Typography,
} from "@material-ui/core";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import {
    PageTable,
    useSnackbar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import React,
{
    useEffect,
    useState,
} from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
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
    root: {
        width: `100%`,
    },
}));

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
                status: organizationOwnership?.status ? intl.formatMessage({ id: `data_${organizationOwnership?.status}Status` }) : ``,
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
            enqueueSnackbar(intl.formatMessage({
                id: `allOrganization_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `allOrganization_deleteError`,
            }), {
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
            label: intl.formatMessage({
                id: `organizations_statusLabel`,
            }),
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
            <Paper className={classes.root}>
                <PageTable
                    columns={columns}
                    rows={rows}
                    loading={loading}
                    idField={`id`}
                    primaryAction={{
                        label: intl.formatMessage({
                            id: `button_create`,
                        }),
                        icon: AddIcon,
                        onClick: () => history.push(`/admin/organizations/create`),
                    }}
                    rowActions={(row) => [
                        {
                            label: intl.formatMessage({
                                id: `allOrganization_editButton`,
                            }),
                            icon: EditIcon,
                            onClick: (row) => history.push(`/admin/organizations/${row.id}/edit`),
                        },
                        {
                            label: intl.formatMessage({
                                id: `allOrganization_deleteButton`,
                            }),
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
                        search: {
                            placeholder: intl.formatMessage({
                                id: `allOrganization_searchPlaceholder`,
                            }),
                        },
                    })}
                />
            </Paper>
            <Dialog
                open={confirmLeaveOrganizationDialogOpen}
                onClose={closeConfirmDeleteOrganization}
            >
                <DialogTitle />
                <DialogContent dividers>
                    <p>
                        <FormattedMessage id="allOrganization_deleteConfirmLabel" values={{ name: selectedOrganization?.name }}></FormattedMessage>
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
