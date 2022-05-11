import { useGetPaginatedAgeRangesList } from "@/api/ageRanges";
import AgeRangesTable,
{ AgeRangeRow } from "@/components/AgeRanges/Table";
import {
    buildAgeRangesFilters,
    buildOrganizationAgeRangeFilter,
} from "@/operations/queries/getPaginatedAgeRanges";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { mapAgeRangeNodeToAgeRangeRow } from "@/utils/ageRanges";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    ServerCursorPagination,
    serverToTableOrder,
    tableToServerOrder,
} from "@/utils/table";
import { Filter } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import { Order } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";

export default function AgeRangesPage () {
    const currentOrganization = useCurrentOrganization();
    const combinedOrderBy = [
        `lowValueUnit`,
        `lowValue`,
        `highValueUnit`,
        `highValue`,
    ];
    const [ tableFilters, setTableFilters ] = useState<Filter[]>([]);
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `ageRange`,
    });

    const paginationFilter = buildOrganizationAgeRangeFilter({
        organizationId: currentOrganization?.id ?? ``,
        filters: buildAgeRangesFilters(tableFilters),
    });

    const {
        loading,
        data,
        refetch,
        fetchMore,
    } = useGetPaginatedAgeRangesList({
        variables: {
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            orderBy: serverPagination.orderBy === `ageRange` ? combinedOrderBy : serverPagination.orderBy,
            order: serverPagination.order,
            filter: paginationFilter,
        },
        skip: !currentOrganization?.id,
        notifyOnNetworkStatusChange: true,
        returnPartialData: true,
        fetchPolicy: `cache-and-network`,
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

    const handleTableChange = async (tableData: CursorTableData<AgeRangeRow>) => {
        setTableFilters(tableData?.filters ?? []);

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
            orderBy: serverPagination.orderBy === `ageRange` ? combinedOrderBy : serverPagination.orderBy,
            filter: paginationFilter,
        });
    }, [
        serverPagination.order,
        serverPagination.orderBy,
        serverPagination.rowsPerPage,
        tableFilters,
        currentOrganization?.id,
    ]);

    const rows =
    data?.ageRangesConnection?.edges
        .map((edge) => mapAgeRangeNodeToAgeRangeRow(edge.node))
        ?? [];

    return (
        <AgeRangesTable
            rows={rows}
            loading={loading}
            hasNextPage={data?.ageRangesConnection?.pageInfo.hasNextPage}
            hasPreviousPage={data?.ageRangesConnection?.pageInfo.hasPreviousPage}
            startCursor={data?.ageRangesConnection?.pageInfo.startCursor}
            endCursor={data?.ageRangesConnection?.pageInfo.endCursor}
            total={data?.ageRangesConnection?.totalCount}
            order={serverToTableOrder(serverPagination.order)}
            orderBy={serverPagination.orderBy}
            rowsPerPage={serverPagination.rowsPerPage}
            search={serverPagination.search}
            onPageChange={handlePageChange}
            onTableChange={handleTableChange}
        />
    );
}
