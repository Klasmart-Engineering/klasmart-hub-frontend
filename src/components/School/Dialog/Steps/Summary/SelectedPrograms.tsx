import { TabContent } from "../shared";
import { useGetAllPaginatedPrograms } from "@/api/programs";
import ProgramsTable,
{ ProgramRow } from "@/components/Program/Table";
import { buildProgramIdsFilter } from "@/operations/queries/getPaginatedOrganizationPrograms";
import { mapProgramEdgesToPrograms } from "@/utils/programs";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    serverToTableOrder,
    TableState,
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

export default function SelectSchoolPrograms (props: TabContent) {
    const {
        programIds,
        disabled,
    } = props;
    const [ tableState, setTableState ] = useState<TableState>({
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });
    const queryFilter = buildProgramIdsFilter(programIds ?? []);

    const {
        data,
        refetch,
        fetchMore: fetchMorePrograms,
        loading,
    } = useGetAllPaginatedPrograms({
        variables: {
            direction: `FORWARD`,
            count: tableState.rowsPerPage,
            orderBy: tableState.orderBy,
            order: tableState.order,
            filter: queryFilter,
        },
        fetchPolicy: `network-only`,
        notifyOnNetworkStatusChange: true,
    });

    const onPageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);
        await fetchMorePrograms({
            variables: {
                count,
                cursor,
                direction,
            },
        });
    };

    const onTableChange = async (tableData: CursorTableData<ProgramRow>) => {
        if (loading) return;
        setTableState({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });
    };

    useEffect(() => {
        if (loading) return;
        refetch({
            count: tableState.rowsPerPage,
            filter: queryFilter,
        });
    }, [ tableState.rowsPerPage, tableState.search ]);

    return (
        <>
            <ProgramsTable
                disabled={disabled}
                programs={mapProgramEdgesToPrograms(data?.programsConnection?.edges ?? [])}
                rowsPerPage={tableState.rowsPerPage}
                loading={loading}
                total={data?.programsConnection.totalCount}
                pageInfo={data?.programsConnection?.pageInfo}
                order={serverToTableOrder(tableState.order)}
                orderBy={tableState.orderBy}
                onPageChange={onPageChange}
                onTableChange={onTableChange}
            />
        </>
    );
}
