import { useGetPaginatedOrganizationGrades } from "@/api/grades";
import GradeTable,
{ GradeRow } from "@/components/Grades/Table";
import {
    buildGradeFilter,
    buildGradesFilters,
} from "@/operations/queries/getOrganizationGrades";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { NON_SPECIFIED } from "@/types/graphQL";
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
} from '@mui/styles';
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

interface Props {}

export default function GradesPage (props: Props) {
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const [ tableFilters, setTableFilters ] = useState<Filter[]>([]);
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });

    const paginationFilter = buildGradeFilter({
        organizationId: currentOrganization?.id ?? ``,
        search: serverPagination.search,
        filters: buildGradesFilters(tableFilters),
    });

    const {
        loading,
        data,
        refetch,
        fetchMore,
    } = useGetPaginatedOrganizationGrades({
        variables: {
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            orderBy: serverPagination.orderBy,
            order: serverPagination.order,
            filter: paginationFilter,
        },
        skip: !currentOrganization?.id,
        notifyOnNetworkStatusChange: true,
        returnPartialData: true,
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

    const handleTableChange = async (tableData: CursorTableData<GradeRow>) => {
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            rowsPerPage: tableData.rowsPerPage,
            search: tableData.search,
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
        currentOrganization?.id,
    ]);

    const rows =
    data?.gradesConnection?.edges?.map((edge) => ({
        id: edge.node.id ?? ``,
        name: edge.node.name ?? ``,
        system: edge.node.system,
        progressFrom: edge.node.fromGrade?.name ?? NON_SPECIFIED,
        progressTo: edge.node.toGrade?.name ?? NON_SPECIFIED,
    })) ?? [];

    return (
        <GradeTable
            rows={rows}
            loading={loading}
            hasNextPage={data?.gradesConnection?.pageInfo.hasNextPage}
            hasPreviousPage={data?.gradesConnection?.pageInfo.hasPreviousPage}
            startCursor={data?.gradesConnection?.pageInfo.startCursor}
            endCursor={data?.gradesConnection?.pageInfo.endCursor}
            total={data?.gradesConnection?.totalCount}
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
