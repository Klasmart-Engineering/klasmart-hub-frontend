import { useGetAllPaginatedPrograms } from "@/api/programs";
import ProgramTable,
{ ProgramRow } from "@/components/Program/Table";
import {
    buildOrganizationProgramFilter,
    buildProgramFilters,
} from "@/operations/queries/getPaginatedOrganizationPrograms";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { isActive } from "@/types/graphQL";
import { mapProgramNodeToProgramRow } from "@/utils/programs";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    ServerCursorPagination,
    serverToTableOrder,
    tableToServerOrder,
} from "@/utils/table";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import { Filter } from "kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import { Order } from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
}

export default function ProgramsPage (props: Props) {
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const [ tableFilters, setTableFilters ] = useState<Filter[]>([]);
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });

    const paginationFilter = buildOrganizationProgramFilter({
        organizationId: currentOrganization?.organization_id ?? ``,
        search: serverPagination.search,
        filters: buildProgramFilters(tableFilters),
    });

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
        skip: !currentOrganization?.organization_id,
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

    const handleTableChange = async (tableData: CursorTableData<ProgramRow>) => {
        if (loading) return;
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });
        setTableFilters(tableData?.filters ?? []);
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
        serverPagination.order,
        serverPagination.orderBy,
        serverPagination.rowsPerPage,
        tableFilters,
    ]);

    const rows = data?.programsConnection?.edges
        .filter((edge) => isActive(edge.node))
        .map((edge) => mapProgramNodeToProgramRow(edge.node))
        ?? [];

    return (
        <ProgramTable
            rows={rows}
            loading={loading}
            hasNextPage={data?.programsConnection?.pageInfo.hasNextPage}
            hasPreviousPage={data?.programsConnection?.pageInfo.hasPreviousPage}
            startCursor={data?.programsConnection?.pageInfo.startCursor}
            endCursor={data?.programsConnection?.pageInfo.endCursor}
            total={data?.programsConnection?.totalCount}
            order={serverToTableOrder(serverPagination.order)}
            orderBy={serverPagination.orderBy}
            rowsPerPage={serverPagination.rowsPerPage}
            search={serverPagination.search}
            refetch={refetch}
            onPageChange={handlePageChange}
            onTableChange={handleTableChange}
        />
    );
}
