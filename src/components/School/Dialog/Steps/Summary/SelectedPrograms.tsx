import { useGetAllPaginatedPrograms } from "@/api/programs";
import ProgramsTable,
{ ProgramRow } from "@/components/Program/Table";
import { buildProgramIdsFilter } from "@/operations/queries/getPaginatedOrganizationPrograms";
import { mapProgramNodeToProgramRow } from "@/utils/programs";
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

interface Props {
    programIds?: string[];
    disabled?: boolean;
}

export default function SelectedSchoolPrograms (props: Props) {
    const {
        disabled,
        programIds,
    } = props;
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
        search: ``,
    });
    const paginationFilter = buildProgramIdsFilter(programIds ?? []);
    const {
        data,
        refetch,
        fetchMore,
        loading,
    } = useGetAllPaginatedPrograms({
        variables: {
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            orderBy: serverPagination.orderBy,
            order: serverPagination.order,
            filter: paginationFilter,
        },
        fetchPolicy: `network-only`,
        notifyOnNetworkStatusChange: true,
    });

    const onPageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);
        await fetchMore({
            variables: {
                count,
                cursor,
                direction,
            },
        });
    };

    const onTableChange = async (tableData: CursorTableData<ProgramRow>) => {
        if (loading) return;
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });
    };

    useEffect(() => {
        if (loading) return;
        refetch({
            count: serverPagination.rowsPerPage,
            filter: paginationFilter,
        });
    }, [ serverPagination.rowsPerPage, serverPagination.search ]);

    const rows = data?.programsConnection?.edges
        .map((edge) => mapProgramNodeToProgramRow(edge.node))
        ?? [];

    return (
        <ProgramsTable
            hideFilters
            disabled={disabled}
            rows={rows}
            rowsPerPage={serverPagination.rowsPerPage}
            loading={loading}
            total={data?.programsConnection.totalCount}
            hasNextPage={data?.programsConnection?.pageInfo.hasNextPage}
            hasPreviousPage={data?.programsConnection?.pageInfo.hasPreviousPage}
            startCursor={data?.programsConnection?.pageInfo.startCursor}
            endCursor={data?.programsConnection?.pageInfo.endCursor}
            order={serverToTableOrder(serverPagination.order)}
            orderBy={serverPagination.orderBy}
            onPageChange={onPageChange}
            onTableChange={onTableChange}
        />
    );
}
