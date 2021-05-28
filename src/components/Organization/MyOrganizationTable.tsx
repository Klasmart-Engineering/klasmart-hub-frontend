import {
    useDeleteOrganizationOwnership,
    useGetOrganizationOwnerships,
} from "@/api/organizations";
import globalStyles from "@/globalStyles";
import { useOrganizationStack } from "@/store/organizationMemberships";
import {
    OrganizationOwnership,
    Status,
} from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { history } from "@/utils/history";
import { removeOrganizationMembership } from "@/utils/organizationMemberships";
import { getTableLocalization } from "@/utils/table";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    DialogContentText,
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
    usePrompt,
    useSnackbar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => {
    const {
        statusText,
        successColor,
        errorColor,
    } = globalStyles(theme);
    return createStyles({
        statusText,
        successColor,
        errorColor,
        root: {
            width: `100%`,
        },
    });
});

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

export default function MyOrganizationTable (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const { equals, required } = useValidations();
    const prompt = usePrompt();
    const {
        data,
        loading,
        refetch,
    } = useGetOrganizationOwnerships();
    const [ deleteOrganization ] = useDeleteOrganizationOwnership();
    const [ organizationMembershipStack, setOrganizationMembershipStack ] = useOrganizationStack();
    const [ rows, setRows ] = useState<MyOrganizationRow[]>([]);
    const canCreate = usePermission(`create_own_organization_10220`);
    const canCreateAdmin = usePermission(`create_an_organization_account_1`);
    const organizationOwnerships = data?.me?.organization_ownerships ?? [];

    useEffect(() => {
        if (!organizationOwnerships.length) {
            setRows([]);
            return;
        }

        const rows: MyOrganizationRow[] = organizationOwnerships.map((organizationOwnership: OrganizationOwnership) => ({
            id: organizationOwnership?.organization?.organization_id ?? ``,
            name: organizationOwnership?.organization?.organization_name ?? ``,
            phone: organizationOwnership?.organization?.phone ?? ``,
            email: organizationOwnership?.user?.email ?? ``,
            roles: organizationOwnership?.organization?.roles
                ?.filter((role) => role.status === Status.ACTIVE)
                .map((role) => role.role_name ?? ``) ?? [],
            status: organizationOwnership?.status ?? ``,
        }));

        setRows(rows);
    }, [ data ]);

    const handleDeleteSelectedOrganizationClick = async (row: MyOrganizationRow): Promise<void> => {
        const membership = organizationOwnerships.find((membership) => membership.organization_id === row.id);
        if (!membership) return;
        const organizationName = membership.organization?.organization_name;
        if (!await prompt({
            variant: `error`,
            title: intl.formatMessage({
                id: `allOrganization_deleteButton`,
            }),
            content: <>
                <DialogContentText>{intl.formatMessage({
                    id: `allOrganization_deleteConfirmLabel`,
                }, {
                    name: <strong>{organizationName}</strong>,
                })}</DialogContentText>
                <DialogContentText>{intl.formatMessage({
                    id: `generic_typeToDeletePrompt`,
                }, {
                    value: <strong>{organizationName}</strong>,
                })}</DialogContentText>
            </>,
            okLabel: intl.formatMessage({
                id: `allOrganization_okButton`,
            }),
            cancelLabel: intl.formatMessage({
                id: `allOrganization_cancelButton`,
            }),
            validations: [ required(), equals(organizationName) ],
        })) return;
        try {
            await deleteOrganization({
                variables: {
                    organization_id: membership.organization_id,
                },
            });
            removeOrganizationMembership(membership, organizationMembershipStack, setOrganizationMembershipStack);
            await refetch();
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
            disableSearch: true,
            disableSort: true,
        },
        {
            id: `name`,
            disableSearch: true,
            disableSort: true,
            label: intl.formatMessage({
                id: `allOrganization_organizationName`,
            }),
        },
        {
            id: `phone`,
            disableSearch: true,
            disableSort: true,
            label: intl.formatMessage({
                id: `allOrganization_phone`,
            }),
        },
        {
            id: `email`,
            disableSearch: true,
            disableSort: true,
            label: intl.formatMessage({
                id: `allOrganization_email`,
            }),
        },
        {
            id: `roles`,
            disableSearch: true,
            disableSort: true,
            label: intl.formatMessage({
                id: `allOrganization_roles`,
            }),
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
            disableSearch: true,
            disableSort: true,
            id: `status`,
            label: intl.formatMessage({
                id: `organizations_statusLabel`,
            }),
            render: (row) =>
                <span
                    className={clsx(classes.statusText, {
                        [classes.successColor]: row.status === Status.ACTIVE,
                        [classes.errorColor]: row.status === Status.INACTIVE,
                    })}
                >
                    {intl.formatMessage({
                        id: `data_${row.status}Status`,
                    })}
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
                        disabled: organizationOwnerships.length > 0 || (!canCreate && !canCreateAdmin),
                    }}
                    rowActions={(row) => [
                        {
                            label: intl.formatMessage({
                                id: `allOrganization_editButton`,
                            }),
                            icon: EditIcon,
                            disabled: row.status === Status.INACTIVE,
                            onClick: (row) => history.push(`/admin/organizations/${row.id}/edit`),
                        },
                        {
                            label: intl.formatMessage({
                                id: `allOrganization_deleteButton`,
                            }),
                            icon: DeleteIcon,
                            disabled: row.status === Status.INACTIVE,
                            onClick: handleDeleteSelectedOrganizationClick,
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
        </>
    );
}