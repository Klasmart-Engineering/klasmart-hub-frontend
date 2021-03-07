import {
    useGetOrganizations,
    useLeaveMembership,
} from "@/api/organizations";
import { userIdVar } from "@/cache";
import { getTableLocalization } from "@/utils/table";
import { useReactiveVar } from "@apollo/client/react";
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
import { ExitToApp as ExitToAppIcon } from "@material-ui/icons";
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
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
    },
}));

interface JoinedOrganizationRow {
    id: string;
    name: string;
    phone: string;
    email: string;
    roles: string[];
    status: string;
}

interface Props {
}

export default function JoinedOrganizationTable (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const userId = useReactiveVar(userIdVar);
    const [ organizationId, setOrganizationId ] = useState(``);
    const [ rows, setRows ] = useState<JoinedOrganizationRow[]>([]);
    const {
        data,
        loading,
        refetch,
    } = useGetOrganizations();
    const [ leaveMembership, { loading: leaveLoading } ] = useLeaveMembership();

    useEffect(() => {
        const memberships = data?.me?.memberships ?? [];
        if (memberships.length === 0) {
            setRows([]);
            return;
        }
        const myEmail = data?.me?.email;
        const rows = memberships
            .filter((membership) => myEmail !== membership?.organization?.owner?.email && membership?.status === `active`)
            .map((membership) => ({
                id: membership.organization?.organization_id ?? ``,
                name: membership.organization?.organization_name ?? ``,
                phone: membership.organization?.phone ?? ``,
                email: membership.organization?.owner?.email ?? ``,
                roles: membership.roles?.map((r) => r.role_name ?? ``) ?? [],
                status: membership.status ? intl.formatMessage({
                    id: `data_${membership.status}Status`,
                }) : ``,
            }));

        setRows(rows);
    }, [ data ]);

    const [ confirmLeaveOrganizationDialogOpen, setConfirmLeaveOrganizationDialogOpen ] = useState(false);

    const showConfirmLeaveOrganization = (organization: JoinedOrganizationRow) => {
        setConfirmLeaveOrganizationDialogOpen(true);
        setOrganizationId(organization.id);
    };

    const closeConfirmLeaveOrganization = () => {
        setConfirmLeaveOrganizationDialogOpen(false);
    };

    const leaveSelectedOrganization = async (): Promise<void> => {
        try {
            await leaveMembership({
                variables: {
                    organization_id: organizationId,
                    user_id: userId,
                },
            });
            await refetch();
            enqueueSnackbar(intl.formatMessage({
                id: `allOrganization_leftOrganizationSuccess`,
            }), {
                variant: `success`,
            });
            setConfirmLeaveOrganizationDialogOpen(false);
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `allOrganization_leftOrganizationError`,
            }), {
                variant: `error`,
            });
        }
    };

    const columns: TableColumn<JoinedOrganizationRow>[] = [
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
                id: `joinedOrganization_email`,
            }),
        },
        {
            id: `roles`,
            label: intl.formatMessage({
                id: `joinedOrganization_role`,
            }),
            disableSort: true,
            render: (row) =>
                row?.roles?.map((role, i) => (
                    <Typography
                        key={`role-${i}`}
                        noWrap
                        variant="body2">
                        {role}
                    </Typography>
                )),
        },
    ];

    return (
        <>
            <Paper className={classes.root}>
                <PageTable
                    columns={columns}
                    rows={rows}
                    loading={loading}
                    idField="id"
                    orderBy="name"
                    selectActions={[
                        {
                            label: intl.formatMessage({
                                id: `allOrganization_leaveOrganizationLabel`,
                            }),
                            icon: ExitToAppIcon,
                            onClick: (rowIds) => console.log(rowIds),
                        },
                    ]}
                    rowActions={(row) => [
                        {
                            label: intl.formatMessage({
                                id: `allOrganization_leaveOrganizationButton`,
                            }),
                            icon: ExitToAppIcon,
                            disabled: row.status === `inactive`,
                            onClick: (row) => showConfirmLeaveOrganization(row),
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `allOrganization_joinedOrganizations`,
                            }),
                        },
                        search: {
                            placeholder: intl.formatMessage({
                                id: `allOrganization_searchPlaceholder`,
                            }),
                        },
                        body: {
                            noData: intl.formatMessage({
                                id: `allOrganization_noRecords`,
                            }),
                        },
                    })}
                />
            </Paper>
            <Dialog
                open={confirmLeaveOrganizationDialogOpen}
                onClose={closeConfirmLeaveOrganization}
            >
                <DialogTitle />
                <DialogContent dividers>
                    <p>
                        {intl.formatMessage({
                            id: `allOrganization_leaveOrganizationConfirm`,
                        })}
                    </p>
                    {leaveLoading && (
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
                        onClick={leaveSelectedOrganization}>
                        {intl.formatMessage({
                            id: `allOrganization_okButton`,
                        })}
                    </Button>
                    <Button
                        color="primary"
                        onClick={closeConfirmLeaveOrganization}
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
