import { useQueryMyUser } from "@/api/myUser";
import { useLeaveMembership } from "@/api/organizations";
import { getTableLocalization } from "@/utils/table";
import {
    PageTable,
    useConfirm,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { TableColumn } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Head";
import { ExitToApp as ExitToAppIcon } from "@mui/icons-material";
import { Typography } from "@mui/material";
import React,
{
    useMemo,
    useState,
} from "react";
import { useIntl } from "react-intl";

interface JoinedOrganizationRow {
    id: string;
    name: string;
    phone: string;
    email: string;
    roles: string[];
}

interface Props {
}

export default function JoinedOrganizationTable (props: Props) {
    const intl = useIntl();
    const confirm = useConfirm();
    const { enqueueSnackbar } = useSnackbar();
    const {
        data: myUserData,
        loading: myUserLoading,
        refetch: myUserRefetch,
    } = useQueryMyUser({
        nextFetchPolicy: `network-only`,
    });
    const [ leaveMembership ] = useLeaveMembership();
    const [ selectedOrganizationIds, setSelectedOrganizationIds ] = useState<string[]>([]);

    const currentUser = myUserData?.myUser.node;

    const rows = useMemo(() => {
        const myEmail = currentUser?.contactInfo?.email;
        return currentUser?.organizationMembershipsConnection.edges
            ?.filter((organizationMembershipEdge) => myEmail !== organizationMembershipEdge?.node.organization?.owners?.[0]?.email)
            ?.map((organizationMembershipEdge) => ({
                id: organizationMembershipEdge.node.organization?.id ?? ``,
                name: organizationMembershipEdge.node.organization?.name ?? ``,
                phone: organizationMembershipEdge.node.organization?.contactInfo?.phone ?? ``,
                email: organizationMembershipEdge.node.organization?.owners?.[0].email ?? ``,
                roles: organizationMembershipEdge.node.rolesConnection?.edges?.map((rolesConnectionEdge) => rolesConnectionEdge.node.name ?? ``) ?? [],
            })) ?? [];
    }, [ myUserData ]);

    const handleLeaveSelectedOrganizationsClick = async (rowIds: string[]) => {
        for (const row of rows.filter((row) => rowIds.includes(row.id))) {
            await handleLeaveOrganizationRowClick(row);
        }
    };

    const handleLeaveOrganizationRowClick = async (row: JoinedOrganizationRow) => {
        if (!currentUser?.id) return;
        if (!(await confirm({
            variant: `warning`,
            title: intl.formatMessage({
                id: `allOrganization_leaveOrganizationButton`,
            }),
            content: (
                <Typography color="textSecondary">
                    {intl.formatMessage({
                        id: `allOrganization_leaveOrganizationConfirm`,
                    }, {
                        name: <strong>{row.name}</strong>,
                    })}
                </Typography>
            ),
            okLabel: intl.formatMessage({
                id: `allOrganization_okButton`,
            }),
            cancelLabel: intl.formatMessage({
                id: `allOrganization_cancelButton`,
            }),
        }))) return;
        try {
            await leaveMembership({
                variables: {
                    organizationId: row.id,
                    userIds: [ currentUser.id ],
                },
            });
            const membership = myUserData?.myUser.node.organizationMembershipsConnection.edges.map((organizationMembershipEdge) => organizationMembershipEdge.node)
                .find((organizationMembershipNode) => row.id === organizationMembershipNode.organization?.id);
            if (!membership) return;
            await myUserRefetch();
            setSelectedOrganizationIds((ids) => ids.filter((id) => id !== row.id));
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
            secret: true,
        },
        {
            id: `name`,
            persistent: true,
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
            render: (row) => row?.roles?.map((role, i) => (
                <Typography
                    key={`role-${i}`}
                    noWrap
                    variant="body2"
                >
                    {role}
                </Typography>
            )),
        },
    ];

    return (
        <PageTable
            columns={columns}
            rows={rows}
            selectedRows={selectedOrganizationIds}
            loading={myUserLoading}
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
                    onClick: handleLeaveOrganizationRowClick,
                },
            ]}
            localization={getTableLocalization(intl, {
                title: intl.formatMessage({
                    id: `allOrganization_joinedOrganizations`,
                }),
                placeholder: intl.formatMessage({
                    id: `allOrganization_searchPlaceholder`,
                }),
            })}
            onSelected={(ids: string[]) => setSelectedOrganizationIds(ids)}
        />
    );
}
