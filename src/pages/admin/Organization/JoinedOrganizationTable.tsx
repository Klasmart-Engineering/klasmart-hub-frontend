import { useGetOrganizations, useLeaveMembership } from "@/api/organizations";
import { userIdVar } from "@/cache";
import { getTableLocalization } from "@/utils/table";
import { useReactiveVar } from "@apollo/client/react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from "@material-ui/core";
import { ExitToApp as ExitToAppIcon } from "@material-ui/icons";
import { BaseTable } from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Base/Table/Head";
import React, { useState } from "react";
import { useEffect } from "react";
import { useIntl } from "react-intl";

interface JoinedOrganizationRow {
    id: string;
    name: string;
    phone: string;
    email: string;
    roles: string[];
    status: string;
}

interface Props {}

/**
 * Returns function to show Joined Organizations table
 */
export default function JoinedOrganizationTable(props: Props) {
    const intl = useIntl();
    const userId = useReactiveVar(userIdVar);
    const [organizationId, setOrganizationId] = useState("");
    const [rows, setRows] = useState<JoinedOrganizationRow[]>([]);
    const { data, loading, refetch } = useGetOrganizations();
    const [leaveMembership, { loading: leaveLoading }] = useLeaveMembership();

    useEffect(() => {
        const memberships = data?.me.memberships ?? [];
        if (memberships.length === 0) {
            setRows([]);
            return;
        }
        const myEmail = data?.me.email;
        const rows = memberships
            .filter((m) => myEmail !== m?.organization?.owner?.email)
            .map((m) => ({
                id: m.organization?.organization_id ?? "",
                name: m.organization?.organization_name ?? "",
                phone: m.organization?.phone ?? "",
                email: m.organization?.owner?.email ?? "",
                roles: m.roles?.map((r) => r.role_name ?? "") ?? [],
                status: m.status ?? "",
            }));

        setRows(rows);
    }, [data]);

    const [
        confirmLeaveOrganizationDialogOpen,
        setConfirmLeaveOrganizationDialogOpen,
    ] = useState(false);

    const showConfirmLeaveOrganization = (
        organization: JoinedOrganizationRow,
    ) => {
        setConfirmLeaveOrganizationDialogOpen(true);
        setOrganizationId(organization.id);
    };

    const closeConfirmLeaveOrganization = () => {
        setConfirmLeaveOrganizationDialogOpen(false);
    };

    const [leftMembershipDialog, setLeftMembershipDialog] = useState(false);

    const closeConfirmationMessage = () => {
        setLeftMembershipDialog(false);
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

            // Snackbar message "You have leave the organization successfully"
        } catch (error) {
            console.log({ error });
            // snackbar message "An error occurred while leaving the organization"
        } finally {
            setConfirmLeaveOrganizationDialogOpen(false);
            setLeftMembershipDialog(true);
        }
    };

    const columns: Array<TableColumn<JoinedOrganizationRow>> = [
        {
            id: "id",
            label: "Id",
            hidden: true,
        },
        {
            id: "name",
            label: intl.formatMessage({
                id: "allOrganization_organizationName",
            }),
            searchable: true,
        },
        {
            id: "phone",
            label: intl.formatMessage({ id: "allOrganization_phone" }),
            searchable: true,
        },
        {
            id: "email",
            label: intl.formatMessage({ id: "joinedOrganization_email" }),
            searchable: true,
        },
        {
            id: "roles",
            label: intl.formatMessage({ id: "joinedOrganization_role" }),
            searchable: true,
            disableSort: true,
            render: (row) =>
                row?.roles?.map((role, i) => (
                    <Typography key={`role-${i}`} noWrap variant="body2">
                        {role}
                    </Typography>
                )),
        },
    ];

    return (
        <>
            <BaseTable
                columns={columns}
                rows={rows}
                loading={loading}
                idField="id"
                orderBy="name"
                selectActions={[
                    {
                        label: "Leave selected organizations",
                        icon: ExitToAppIcon,
                        onClick: (data) => console.log(data),
                    },
                ]}
                rowActions={(row) => [
                    {
                        label: intl.formatMessage({
                            id: "allOrganization_leaveOrganizationButton",
                        }),
                        icon: ExitToAppIcon,
                        disabled: row.status === "inactive",
                        onClick: (row) => showConfirmLeaveOrganization(row),
                    },
                ]}
                localization={getTableLocalization(intl, {
                    toolbar: {
                        title: intl.formatMessage({
                            id: "allOrganization_joinedOrganizations",
                        }),
                    },
                    search: {
                        placeholder: intl.formatMessage({
                            id: "allOrganization_searchPlaceholder",
                        }),
                    },
                    body: {
                        noData: intl.formatMessage({
                            id: "allOrganization_noRecords",
                        }),
                    },
                })}
            />

            <Dialog
                open={confirmLeaveOrganizationDialogOpen}
                onClose={closeConfirmLeaveOrganization}
            >
                <DialogTitle />
                <DialogContent dividers>
                    <p>
                        {intl.formatMessage({
                            id: "allOrganization_leaveOrganizationConfirm",
                        })}
                    </p>
                    {leaveLoading && (
                        <Grid container justify="center">
                            <CircularProgress />
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={leaveSelectedOrganization} color="primary">
                        {intl.formatMessage({ id: "allOrganization_okButton" })}
                    </Button>
                    <Button
                        color="primary"
                        onClick={closeConfirmLeaveOrganization}
                    >
                        {intl.formatMessage({
                            id: "allOrganization_cancelButton",
                        })}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={leftMembershipDialog}
                onClose={closeConfirmLeaveOrganization}
            >
                <DialogTitle />
                <DialogContent dividers>
                    <p>
                        {intl.formatMessage({
                            id: "allOrganization_leftOrganizationMessage",
                        })}
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmationMessage} color="primary">
                        {intl.formatMessage({ id: "allOrganization_okButton" })}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
