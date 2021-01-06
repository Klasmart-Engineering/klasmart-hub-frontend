import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { ExitToApp as ExitToAppIcon } from "@material-ui/icons";
import React, { useState } from "react";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { TableColumn } from "kidsloop-px/dist/types/components/Base/Table/Head";
import { BaseTable } from "kidsloop-px";
import { useGetOrganizations } from "@/api/organizations";
import { getTableLocalization } from "@/utils/table";

const useStyles = makeStyles((theme) => makeStyles({
}));

interface JoinedOrganizationRow {
    id: string
    name: string
    phone: string
    email: string
    roles: string[]
}

interface Props {
}

/**
 * Returns function to show Joined Organizations table
 */
export default function JoinedOrganizationTable (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const {
        data,
        loading
    } = useGetOrganizations();
    const [rows, setRows] = useState<JoinedOrganizationRow[]>([]);

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
            }));
        setRows(rows);
    }, [data]);

    const [
        confirmLeaveOrganizationDialogOpen,
        setConfirmLeaveOrganizationDialogOpen,
    ] = useState(false);

    const showConfirmLeaveOrganization = () => {
        setConfirmLeaveOrganizationDialogOpen(true);
    };

    const closeConfirmLeaveOrganization = () => {
        setConfirmLeaveOrganizationDialogOpen(false);
    };

    const [dialogMessageConfirmMessage, setConfirmationMessage] = useState(false);

    const showConfimationMessage = () => {
        setConfirmLeaveOrganizationDialogOpen(false);
        setConfirmationMessage(true);
    };

    const closeConfimationMessage = () => {
        setConfirmationMessage(false);
    };

    const columns: TableColumn<JoinedOrganizationRow>[] = [
        {
            id: "id",
            label: "Id",
            hidden: true,
        },
        {
            id: "name",
            label: intl.formatMessage({ id: "allOrganization_organizationName" }),
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
            render: (row) => row?.roles?.map((role, i) =>
                <Typography
                    key={`role-${i}`}
                    noWrap
                    variant="body2"
                >
                    {role}
                </Typography>
            )
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
                        onClick: (data) => showConfirmLeaveOrganization(),
                    },
                ]}
                rowActions={(row) => [
                    {
                        label: intl.formatMessage({ id: "allOrganization_leaveOrganizationButton" }),
                        icon: ExitToAppIcon,
                        onClick: (row) => showConfirmLeaveOrganization(),
                    },
                ]}
                localization={getTableLocalization(intl, {
                    toolbar: {
                        title: intl.formatMessage({ id: "allOrganization_joinedOrganizations" }),
                    },
                    search: {
                        placeholder: intl.formatMessage({ id: "allOrganization_searchPlaceholder" }),
                    },
                    body: {
                        noData: intl.formatMessage({ id: "allOrganization_noRecords" })
                    },
                })}
            />

            <Dialog
                open={confirmLeaveOrganizationDialogOpen}
                onClose={closeConfirmLeaveOrganization}
            >
                <DialogTitle></DialogTitle>
                <DialogContent dividers>
                    <p>
                        {intl.formatMessage({ id: "allOrganization_leaveOrganizationConfirm" })}
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={showConfimationMessage} color="primary">
                        {intl.formatMessage({ id: "allOrganization_okButton" })}
                    </Button>
                    <Button color="primary" onClick={closeConfirmLeaveOrganization}>
                        {intl.formatMessage({ id: "allOrganization_cancelButton" })}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={dialogMessageConfirmMessage}
                onClose={closeConfirmLeaveOrganization}
            >
                <DialogTitle></DialogTitle>
                <DialogContent dividers>
                    <p>
                        {intl.formatMessage({ id: "allOrganization_leftOrganizationMessage" })}
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfimationMessage} color="primary">
                        {intl.formatMessage({ id: "allOrganization_okButton" })}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
