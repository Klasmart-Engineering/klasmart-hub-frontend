import {
    RoleEdge,
    useGetPaginatedOrganizationRoles,
} from "@/api/roles";
import RolesTable,
{ RoleRow } from "@/components/Role/Table";
import { buildOrganizationRoleFilter } from "@/operations/queries/getPaginatedOrganizationRoles";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Status } from "@/types/graphQL";
import { usePermission } from "@/utils/permissions";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    ServerCursorPagination,
    serverToTableOrder,
    tableToServerOrder,
} from "@/utils/table";
import { Order } from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";

const systemTypeHandler = (systemRole: boolean | null | undefined) => {
    return systemRole ? `System Role` : `Custom Role`;
};

export const mapRoleRow = (edge: RoleEdge) => {
    const role = edge.node;
    return {
        id: role.id,
        name: role.name ?? ``,
        description: role.description ?? ``,
        status: role.status ?? Status.INACTIVE,
        type: systemTypeHandler(role.system),
        system: role.system,
    };
};

export default function RolesPage () {
    const [ rows, setRows ] = useState<RoleRow[]>([]);
    const canView = usePermission(`view_roles_and_permissions_30110`);
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });

    const paginationFilter = buildOrganizationRoleFilter({
        organizationId,
        search: serverPagination.search,
        filters: [],
    });

    const {
        data: rolesData,
        refetch: refetchRoles,
        fetchMore: fetchMoreRoles,
        loading: loadingOrganizationRoles,
    } = useGetPaginatedOrganizationRoles({
        variables: {
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        },
        skip: !organizationId || !canView,
        notifyOnNetworkStatusChange: true,
    });

    const pageInfo = rolesData?.rolesConnection.pageInfo;

    const handlePageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);
        await fetchMoreRoles({
            variables: {
                count,
                cursor,
                direction,
            },
        });
    };

    const handleTableChange = async (tableData: CursorTableData<RoleRow>) => {
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });
    };

    useEffect(() => {
        refetchRoles({
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        });
    }, [
        serverPagination.search,
        serverPagination.order,
        serverPagination.orderBy,
        serverPagination.rowsPerPage,
        currentOrganization?.organization_id,
    ]);

    useEffect(() => {
        const rows = rolesData?.rolesConnection.edges?.map(mapRoleRow);
        setRows(rows ?? []);
    }, [ rolesData ]);

    return (
        <RolesTable
            rows={rows}
            loading={loadingOrganizationRoles}
            refetch={refetchRoles}
            order={serverToTableOrder(serverPagination.order)}
            orderBy={serverPagination.orderBy}
            rowsPerPage={serverPagination.rowsPerPage}
            search={serverPagination.search}
            total={rolesData?.rolesConnection.totalCount}
            hasNextPage={pageInfo?.hasNextPage}
            hasPreviousPage={pageInfo?.hasPreviousPage}
            startCursor={pageInfo?.startCursor}
            endCursor={pageInfo?.endCursor}
            onPageChange={handlePageChange}
            onTableChange={handleTableChange}/>
    );
}
