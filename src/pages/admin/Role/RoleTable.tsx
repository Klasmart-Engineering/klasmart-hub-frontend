import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import { Table } from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Head";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { currentMembershipVar } from "@/cache";
import { useGetAllRoles } from "@/api/roles";
import { getTableLocalization } from "@/utils/table";

const useStyles = makeStyles(() => createStyles({
    root: {
        width: `100%`,
    },
    swatch: {
        height: `27px`,
        width: `27px`,
        border: `1px solid #000`,
    },
    dashedData: {
        borderBottom: `1px dashed`,
        color: `#cacaca`,
    },
}));

interface RoleRow {
    id: string;
    role: string;
}

interface Props {
}

/**
 * Returns function to show Rol Table in "View roles"
 */
export default function RoleTable (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const [ rows, setRows ] = useState<RoleRow[]>([]);
    const membership = useReactiveVar(currentMembershipVar);
    const {
        data,
        loading,
        error,
    } = useGetAllRoles(membership.organization_id);

    useEffect(() => {
        if (!data?.organization?.roles?.length) {
            setRows([]);
            return;
        }
        const rows: RoleRow[] = data.organization.roles.map((role) => ({
            id: role.role_id,
            role: role.role_name ?? ``,
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

    return (
        <>
            <Table
                columns={columns}
                rows={rows}
                loading={loading}
                idField="id"
                orderBy="role"
                localization={getTableLocalization(intl, {
                    toolbar: {
                        title: `Roles`,
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
        </>
    );
}
