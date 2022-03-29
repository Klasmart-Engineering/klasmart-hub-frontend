import { useGetPaginatedSchools } from "@/api/schools";
import SchoolTable,
{ SchoolRow }  from "@/components/School/Table";
import { buildOrganizationSchoolFilter } from "@/operations/queries/getPaginatedOrganizationSchools";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { isActive } from "@/types/graphQL";
import { usePermission } from "@/utils/permissions";
import { mapSchoolNodeToSchoolRow } from "@/utils/schools";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    ServerCursorPagination,
    serverToTableOrder,
    tableToServerOrder,
} from "@/utils/table";
import { Order } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";

interface Props {
}

export default function SchoolsPage (props: Props) {
    const currentOrganization = useCurrentOrganization();
    const canView = usePermission({
        OR: [ `view_school_20110`, `view_my_school_20119` ],
    });
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });

    const paginationFilter = buildOrganizationSchoolFilter({
        organizationId: currentOrganization?.id ?? ``,
        search: serverPagination.search,
    });

    const {
        loading,
        data,
        refetch,
        fetchMore,
    } = useGetPaginatedSchools({
        variables: {
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        },
        skip: !currentOrganization?.id || !canView,
        notifyOnNetworkStatusChange: true,
    });

    const handlePageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);
        await fetchMore({
            variables: {
                count,
                cursor,
                direction,
            },
        });
    };

    const handleTableChange = async (tableData: CursorTableData<SchoolRow>) => {
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            rowsPerPage: tableData.rowsPerPage,
            search: tableData.search,
        });
    };

    useEffect(() => {
        refetch({
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        });
    }, [
        serverPagination.search,
        serverPagination.rowsPerPage,
        serverPagination.order,
        serverPagination.orderBy,
        currentOrganization?.id,
    ]);

    const rows = data?.schoolsConnection?.edges
        ?.filter((edge) => isActive(edge.node))
        .map((edge) => mapSchoolNodeToSchoolRow(edge.node))
        ?? [];

    return (
        <SchoolTable
            rows={rows}
            loading={loading}
            order={serverToTableOrder(serverPagination.order)}
            orderBy={serverPagination.orderBy}
            rowsPerPage={serverPagination.rowsPerPage}
            search={serverPagination.search}
            total={data?.schoolsConnection?.totalCount}
            hasNextPage={data?.schoolsConnection?.pageInfo?.hasNextPage}
            hasPreviousPage={data?.schoolsConnection?.pageInfo?.hasPreviousPage}
            startCursor={data?.schoolsConnection?.pageInfo?.startCursor}
            endCursor={data?.schoolsConnection?.pageInfo?.endCursor}
            onPageChange={handlePageChange}
            onTableChange={handleTableChange}
        />
    );

}
