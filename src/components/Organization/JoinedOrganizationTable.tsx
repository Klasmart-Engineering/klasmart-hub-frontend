import {
    useGetOrganizationMemberships,
    useLeaveMembership,
} from "@/api/organizations";
import { userIdVar } from "@/cache";
import { useOrganizationStack } from "@/store/organizationMemberships";
import { Status } from "@/types/graphQL";
import { removeOrganizationMembership } from "@/utils/organizationMemberships";
import { getTableLocalization } from "@/utils/table";
import { useReactiveVar } from "@apollo/client/react";
import {
    createStyles,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";
import { ExitToApp as ExitToAppIcon } from "@material-ui/icons";
import {
    PageTable,
    useConfirm,
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
    const confirm = useConfirm();
    const { enqueueSnackbar } = useSnackbar();
    const userId = useReactiveVar(userIdVar);
    const [ rows, setRows ] = useState<JoinedOrganizationRow[]>([]);
    const {
        data,
        loading,
        refetch,
    } = useGetOrganizationMemberships();
    const [ leaveMembership ] = useLeaveMembership();
    const [ selectedOrganizationIds, setSelectedOrganizationIds ] = useState<string[]>([]);
    const [ organizationMembershipStack, setOrganizationMembershipStack ] = useOrganizationStack();

    const memberships = data?.me?.memberships ?? [];

    useEffect(() => {
        if (memberships.length === 0) {
            setRows([]);
            return;
        }
        const myEmail = data?.me?.email;
        const rows = memberships
            .filter((membership) => myEmail !== membership?.organization?.owner?.email && membership?.status === Status.ACTIVE)
            .map((membership) => ({
                id: membership.organization?.organization_id ?? ``,
                name: membership.organization?.organization_name ?? ``,
                phone: membership.organization?.phone ?? ``,
                email: membership.organization?.owner?.email ?? ``,
                roles: membership.roles?.map((r) => r.role_name ?? ``) ?? [],
                status: membership.status ?? ``,
            }));
        setRows(rows);
    }, [ data ]);

    const handleLeaveSelectedOrganizationsClick = async (rowIds: string[]) => {
        for (const row of rows.filter((row) => rowIds.includes(row.id))) {
            await handleLeaveOrganizationRowClick(row);
        }
    };

    const handleLeaveOrganizationRowClick = async (row: JoinedOrganizationRow) => {
        const membership = memberships.find((membership) => membership.organization_id === row.id);
        if (!membership) return;
        if (!await confirm({
            variant: `warning`,
            title: intl.formatMessage({
                id: `allOrganization_leaveOrganizationButton`,
            }),
            content: <Typography color="textSecondary">
                {intl.formatMessage({
                    id: `allOrganization_leaveOrganizationConfirm`,
                }, {
                    name: <strong>{membership.organization?.organization_name}</strong>,
                })}
            </Typography>,
            okLabel: intl.formatMessage({
                id: `allOrganization_okButton`,
            }),
            cancelLabel: intl.formatMessage({
                id: `allOrganization_cancelButton`,
            }),
        })) return;
        try {
            await leaveMembership({
                variables: {
                    organization_id: membership.organization_id,
                    user_id: userId,
                },
            });
            removeOrganizationMembership(membership, organizationMembershipStack, setOrganizationMembershipStack);
            setSelectedOrganizationIds((ids) => ids.filter((id) => id !== row.id));
            await refetch();
            enqueueSnackbar(intl.formatMessage({
                id: `allOrganization_leftOrganizationSuccess`,
            }), {
                variant: `success`,
            });
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
                    selectedRows={selectedOrganizationIds}
                    loading={loading}
                    idField="id"
                    orderBy="name"
                    selectActions={[
                        {
                            label: intl.formatMessage({
                                id: `allOrganization_leaveOrganizationLabel`,
                            }),
                            icon: ExitToAppIcon,
                            onClick: handleLeaveSelectedOrganizationsClick,
                        },
                    ]}
                    rowActions={(row) => [
                        {
                            label: intl.formatMessage({
                                id: `allOrganization_leaveOrganizationButton`,
                            }),
                            icon: ExitToAppIcon,
                            disabled: row.status === Status.INACTIVE,
                            onClick: handleLeaveOrganizationRowClick,
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
                    onSelected={(ids: string[]) => setSelectedOrganizationIds(ids)}
                />
            </Paper>
        </>
    );
}
