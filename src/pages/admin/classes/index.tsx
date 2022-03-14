import { useGetAllPaginatedClasses } from "@/api/classes";
import ClassTable,
{ ClassRow } from "@/components/Class/Table";
import {
    buildClassesFilters,
    buildOrganizationClassesFilter,
} from "@/operations/queries/getPaginatedOrganizationClasses";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { organizationPaginatedClasses } from "@/utils/classes";
import { usePermission } from "@/utils/permissions";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    ServerCursorPagination,
    serverToTableOrder,
    tableToServerOrder,
} from "@/utils/table";
import { Filter } from "kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import { Order } from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";

interface Props {
}

export default function ClassesPage (props: Props) {
    const currentOrganization = useCurrentOrganization();
    const canView = usePermission({
        OR: [ `view_classes_20114`, `view_school_classes_20117` ],
    });
    const [ tableFilters, setTableFilters ] = useState<Filter[]>([]);
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });

    const paginationFilter = buildOrganizationClassesFilter({
        organizationId: currentOrganization?.id ?? ``,
        search: serverPagination.search,
        filters: buildClassesFilters(tableFilters),
    });

    const {
        data,
        refetch,
        loading,
        fetchMore,
    } = useGetAllPaginatedClasses({
        variables: {
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            orderBy: serverPagination.orderBy,
            order: serverPagination.order,
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

    const handleTableChange = async (tableData: CursorTableData<ClassRow>) => {
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
        serverPagination.rowsPerPage,
        serverPagination.order,
        serverPagination.orderBy,
        tableFilters,
        currentOrganization?.id,
    ]);

    const rows = data?.classesConnection?.edges?.map(organizationPaginatedClasses) ?? [];

    return <ClassTable
        rows={rows}
        loading={loading}
        hasNextPage={data?.classesConnection?.pageInfo.hasNextPage}
        hasPreviousPage={data?.classesConnection?.pageInfo.hasPreviousPage}
        startCursor={data?.classesConnection?.pageInfo.startCursor}
        endCursor={data?.classesConnection?.pageInfo.endCursor}
        total={data?.classesConnection?.totalCount}
        order={serverToTableOrder(serverPagination.order)}
        orderBy={serverPagination.orderBy}
        rowsPerPage={serverPagination.rowsPerPage}
        refetch={refetch}
        onPageChange={handlePageChange}
        onTableChange={handleTableChange}
    />;
}
