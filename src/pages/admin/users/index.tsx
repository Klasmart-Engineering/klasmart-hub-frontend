import {
    useGetPaginatedOrganizationMemberships,
    UserEdge,
} from "@/api/organizationMemberships";
import UserTable,
{ UserRow } from "@/components/User/Table";
import {
    buildOrganizationUserFilter,
    buildOrganizationUserFilters,
} from "@/operations/queries/getPaginatedOrganizationUsers";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Status } from "@/types/graphQL";
import { sortSchoolNames } from "@/utils/schools";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    ServerCursorPagination,
    serverToTableOrder,
    tableToServerOrder,
} from "@/utils/table";
import { sortRoleNames } from "@/utils/userRoles";
import { Filter } from "kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import { Order } from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";

export const mapUserRow = (edge: UserEdge) => {
    const user = edge.node;
    return {
        id: user.id,
        givenName: user.givenName ?? ``,
        familyName: user.familyName ?? ``,
        avatar: user.avatar ?? ``,
        contactInfo: user.contactInfo.email ?? user.contactInfo.phone ?? ``,
        roleNames: user.roles.filter((role) => role.status === Status.ACTIVE && !!role.organizationId).map((role) => role.name).sort(sortRoleNames),
        schoolNames: user.schools.filter((school) => school.status === Status.ACTIVE).map((school) => school.name).sort(sortSchoolNames),
        status: user.organizations?.[0].userStatus,
        joinDate: new Date(user.organizations?.[0].joinDate),
    };
};

export default function UsersPage () {
    const [ rows, setRows ] = useState<UserRow[]>([]);
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;
    const [ tableFilters, setTableFilters ] = useState<Filter[]>([]);
    const [ serverPagination, setServerPagination ] = useState<ServerCursorPagination>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `givenName`,
    });

    const paginationFilter = buildOrganizationUserFilter({
        organizationId,
        search: serverPagination.search,
        filters: buildOrganizationUserFilters(tableFilters),
    });

    const {
        data: usersData,
        refetch: refetchUsers,
        fetchMore: fetchMoreUsers,
        loading: loadingOrganizationMemberships,
    } = useGetPaginatedOrganizationMemberships({
        variables: {
            direction: `FORWARD`,
            count: serverPagination.rowsPerPage,
            order: serverPagination.order,
            orderBy: serverPagination.orderBy,
            filter: paginationFilter,
        },
        notifyOnNetworkStatusChange: true,
    });

    const pageInfo = usersData?.usersConnection.pageInfo;

    const handlePageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);
        await fetchMoreUsers({
            variables: {
                count,
                cursor,
                direction,
            },
        });
    };

    const handleTableChange = async (tableData: CursorTableData<UserRow>) => {
        if (loadingOrganizationMemberships) return;
        setServerPagination({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            search: tableData.search,
            rowsPerPage: tableData.rowsPerPage,
        });

        setTableFilters(tableData?.filters ?? []);
    };

    useEffect(() => {
        refetchUsers({
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

    useEffect(() => {
        const rows = usersData?.usersConnection.edges?.map(mapUserRow);
        setRows(rows ?? []);
    }, [ usersData ]);

    return (
        <UserTable
            rows={rows}
            loading={loadingOrganizationMemberships}
            refetch={refetchUsers}
            order={serverToTableOrder(serverPagination.order)}
            orderBy={serverPagination.orderBy}
            rowsPerPage={serverPagination.rowsPerPage}
            search={serverPagination.search}
            total={usersData?.usersConnection.totalCount}
            hasNextPage={pageInfo?.hasNextPage}
            hasPreviousPage={pageInfo?.hasPreviousPage}
            startCursor={pageInfo?.startCursor}
            endCursor={pageInfo?.endCursor}
            onPageChange={handlePageChange}
            onTableChange={handleTableChange}
        />
    );
}
