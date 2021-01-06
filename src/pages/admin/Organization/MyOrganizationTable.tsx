import { useReactiveVar } from "@apollo/client/react";
import {
    createStyles,
    makeStyles,
    Typography,
} from "@material-ui/core";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { userIdVar } from "@/cache";
import { history } from "@/utils/history";
import { TableColumn } from "kidsloop-px/dist/types/components/Base/Table/Head";
import { BaseTable } from "kidsloop-px";
import { useGetMyOrganization } from "@/api/organizations";
import { getTableLocalization } from "@/utils/table";

const useStyles = makeStyles((theme) => createStyles({
}));

interface MyOrganizationRow {
    id: string
    name: string
    phone: string
    email: string
    roles: string[]
}

interface Props {
}

/**
 * Returns function to show My Organizations Table for "All Organizations" section
 */
export default function MyOrganizationTable (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const userId = useReactiveVar(userIdVar);

    const {
        data,
        loading
    } = useGetMyOrganization(userId);
    
    const [rows, setRows] = useState<MyOrganizationRow[]>([]);

    useEffect(() => {
        const myOrganization = data?.user.my_organization;
        if (!myOrganization?.organization_id) {
            setRows([]);
            return;
        }
        const rows: MyOrganizationRow[] = [ myOrganization ].map((myOrganization) => ({
            id: myOrganization.organization_id,
            name: myOrganization.organization_name ?? "",
            phone: myOrganization.phone ?? "",
            email: myOrganization.owner?.email ?? "",
            roles: myOrganization.roles?.map((role) => role.role_name ?? "") ?? []
        }));
        setRows(rows);
    }, [data]);

    const columns: TableColumn<MyOrganizationRow>[] = [
        {
            id: "id",
            label: "Id",
            hidden: true,
        },
        {
            id: "name",
            label: intl.formatMessage({ id: "allOrganization_organizationName" }),
        },
        {
            id: "phone",
            label: intl.formatMessage({ id: "allOrganization_phone" }),
        },
        {
            id: "email",
            label: intl.formatMessage({ id: "allOrganization_email" }),
        },
        {
            id: "roles",
            label: intl.formatMessage({ id: "allOrganization_roles" }),
            disableSort: true,
            render: (row) => row.roles?.map((role, i) =>
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
                idField={"id"}
                primaryAction={{
                    label: "Create",
                    icon: AddIcon,
                    onClick: (tableData) => history.push("/admin/create-organization"),
                }}
                rowActions={(row) => [
                    {
                        label: "Edit",
                        icon: EditIcon,
                        onClick: (row) => history.push(`/admin/edit-organization/${row.id}`),
                    },
                    {
                        label: "Delete",
                        icon: DeleteIcon,
                        onClick: (row) => {
                            if (!confirm(`Are you sure you want to delete "${row.name}"?`)) return;
                        },
                    },
                ]}
                rowsPerPage={1}
                rowsPerPageOptions={[]}
                localization={getTableLocalization(intl, {
                    toolbar: {
                        title: intl.formatMessage({ id: "allOrganization_myOrganizations" }),
                    },
                    body: {
                        noData: intl.formatMessage({ id: "allOrganization_noRecords" })
                    },
                })}
            />
        </>
    );
}
