import {
    useGetPaginatedOrganizationMemberships,
    UserEdge,
} from "@/api/organizationMemberships";
import UserTable,
{ UserItem } from "@/components/User/Table";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Status } from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { sortSchoolNames } from "@/utils/schools";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    serverToTableOrder,
    TableState,
    tableToServerOrder,
} from "@/utils/table";
import { sortRoleNames } from "@/utils/userRoles";
import { Order } from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";
import { Redirect } from "react-router-dom";

export const mapUserRow = (edge: UserEdge) => {
    const user = edge.node;
    return {
        id: user.id,
        givenName: user.givenName ?? ``,
        familyName: user.familyName ?? ``,
        avatar: user.avatar ?? ``,
        contactInfo: user.contactInfo.email ?? user.contactInfo.phone ?? ``,
        roleNames: user.roles.filter((role) => role.status === Status.ACTIVE).map((role) => role.name).sort(sortRoleNames),
        schoolNames: user.schools.filter((school) => school.status === Status.ACTIVE).map((school) => school.name).sort(sortSchoolNames),
        status: user.organizations?.[0].userStatus,
        joinDate: new Date(user.organizations?.[0].joinDate),
    };
};

export default function UsersPage () {
    const [ rows, setRows ] = useState<UserItem[]>([]);
    const canView = usePermission(`view_users_40110`, true);
    const canViewSchoolUsers = usePermission(`view_my_school_users_40111`, true);
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;
    const [ tableState, setTableState ] = useState<TableState>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `givenName`,
    });

    const {
        data: usersData,
        refetch: refetchUsers,
        fetchMore: fetchMoreUsers,
        loading: loadingOrganizationMemberships,
    } = useGetPaginatedOrganizationMemberships({
        variables: {
            direction: `FORWARD`,
            count: tableState.rowsPerPage,
            search: tableState.search,
            organizationId,
            order: tableState.order,
            orderBy: tableState.orderBy,
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

    const handleTableChange = async (tableData: CursorTableData<UserItem>) => {
        setTableState({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            rowsPerPage: tableData.rowsPerPage,
            search: tableData.search,
        });
    };

    useEffect(() => {
        refetchUsers({
            count: tableState.rowsPerPage,
            order: tableState.order,
            orderBy: tableState.orderBy,
            search: tableState.search,
        });
    }, [
        tableState.search,
        tableState.order,
        tableState.orderBy,
        tableState.rowsPerPage,
    ]);

    useEffect(() => {
        const rows = usersData?.usersConnection.edges?.map(mapUserRow);
        setRows(rows ?? []);
    }, [ usersData ]);

    if (!(canView || canViewSchoolUsers) && !loadingOrganizationMemberships) {
        return <Redirect to="/" />;
    }

    return (
        <UserTable
            items={rows}
            loading={loadingOrganizationMemberships}
            refetch={refetchUsers}
            order={serverToTableOrder(tableState.order)}
            orderBy={tableState.orderBy}
            rowsPerPage={tableState.rowsPerPage}
            search={tableState.search}
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
