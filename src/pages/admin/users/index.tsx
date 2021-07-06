import {
    useGetPaginatedOrganizationMemberships,
    UserEdge,
} from "@/api/organizationMemberships";
import UserTable,
{ UserItem } from "@/components/User/Table";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    Direction,
    SortOrder,
    Status,
} from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { sortSchoolNames } from "@/utils/schools";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    serverToTableOrder,
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
    const [ rowsPerPage, setRowsPerPage ] = useState(DEFAULT_ROWS_PER_PAGE);
    const [ direction, setDirection ] = useState<Direction>(`FORWARD`);
    const [ search, setSearch ] = useState(``);
    const [ order, setOrder ] = useState<SortOrder>(`ASC`);
    const [ orderBy, setOrderBy ] = useState(`givenName`);
    const [ cursor, setCursor ] = useState<string>();
    const canView = usePermission(`view_users_40110`, true);
    const canViewSchoolUsers = usePermission(`view_my_school_users_40111`, true);
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;

    const {
        data: usersData,
        refetch: refetchUsers,
        fetchMore: fetchMoreUsers,
        loading: loadingOrganizationMemberships,
    } = useGetPaginatedOrganizationMemberships({
        variables: {
            direction: direction,
            count: rowsPerPage,
            search: ``,
            organizationId,
            order: order,
            orderBy,
        },
        notifyOnNetworkStatusChange: true,
    });

    const pageInfo = usersData?.usersConnection.pageInfo;

    const handlePageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, rowsPerPage: number) => {
        const direction = pageChangeToDirection(pageChange);
        setDirection(direction);
        setCursor(cursor);
    };

    const handleTableChange = async (tableData: CursorTableData<UserItem>) => {
        const serverOrder = tableToServerOrder(tableData.order);
        const orderChanged = serverOrder !== order;
        setDirection((direction) => orderChanged ? `FORWARD` : direction);
        setOrder(tableToServerOrder(tableData.order));
        setOrderBy(tableData.orderBy);
        setRowsPerPage(tableData.rowsPerPage);
        setSearch(tableData.search);
        setCursor(tableData.cursor);
    };

    useEffect(() => {
        fetchMoreUsers({
            variables: {
                count: rowsPerPage,
                direction,
                cursor,
                search,
                order,
                orderBy,
            },
        });
    }, [
        direction,
        rowsPerPage,
        search,
        order,
        orderBy,
        cursor,
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
            order={serverToTableOrder(order)}
            orderBy={orderBy}
            cursor={cursor}
            rowsPerPage={rowsPerPage}
            search={search}
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
