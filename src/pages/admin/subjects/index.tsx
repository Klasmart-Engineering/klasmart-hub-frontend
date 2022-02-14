import { useGetAllPaginatedSubjects } from "@/api/subjects";
import SubjectTable,
{ SubjectRow } from "@/components/Subject/Table";
import {
    buildOrganizationSubjectFilter,
    buildSubjectsFilters,
} from "@/operations/queries/getPaginatedOrganizationSubjects";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { mapSubjectNodeToSubjectRow } from "@/utils/subjects";
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

interface Props {
}

export default function SubjectsPage (props: Props) {
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const [ tableFilters, setTableFilters ] = useState<Filter[]>([]);
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });

    const paginationFilter = buildOrganizationSubjectFilter({
        organizationId: currentOrganization?.organization_id ?? ``,
        search: serverPagination.search,
        filters: buildSubjectsFilters(tableFilters),
    });

    const {
        data,
        refetch,
        fetchMore,
        loading,
    } = useGetAllPaginatedSubjects({
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

    const handleTableChange = async (tableData: CursorTableData<SubjectRow>) => {
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

    const rows = data?.subjectsConnection?.edges
        .map((edge) => mapSubjectNodeToSubjectRow(edge.node))
        ?? [];

    return (
        <SubjectTable
            rows={rows}
            loading={loading}
            hasNextPage={data?.subjectsConnection?.pageInfo.hasNextPage}
            hasPreviousPage={data?.subjectsConnection?.pageInfo.hasPreviousPage}
            startCursor={data?.subjectsConnection?.pageInfo.startCursor}
            endCursor={data?.subjectsConnection?.pageInfo.endCursor}
            total={data?.subjectsConnection?.totalCount}
            order={serverToTableOrder(serverPagination.order)}
            orderBy={serverPagination.orderBy}
            rowsPerPage={serverPagination.rowsPerPage}
            search={serverPagination.search}
            onPageChange={handlePageChange}
            onTableChange={handleTableChange}
        />
    );

}
