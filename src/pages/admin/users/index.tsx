import {
    ClassConnection,
    ClassConnectionEdge,
    GradeConnectionEdge,
    OrganizationMembershipConnectionEdge,
    RolesConnectionEdge,
    SchoolsMembershipConnectionEdge,
    useGetPaginatedOrganizationMemberships,
    UserEdge,
} from "@/api/organizationMemberships";
import { UserNode } from "@/api/users";
import UserTable,
{ UserRow } from "@/components/User/Table";
import {
    buildOrganizationUserFilter,
    buildOrganizationUserFilters,
} from "@/operations/queries/getPaginatedOrganizationUsers";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Status, UuidOperator } from "@/types/graphQL";
import { mapOrganizationMembershipEdges } from "@/utils/organizationMemberships";
import { mapSchoolsMembershipEdges, sortSchoolNames } from "@/utils/schools";
import {
    DEFAULT_ROWS_PER_PAGE,
    pageChangeToDirection,
    ServerCursorPagination,
    serverToTableOrder,
    tableToServerOrder,
} from "@/utils/table";
import { tabTitle } from "@/utils/tabTitle";
import { sortRoleNames } from "@/utils/userRoles";
import { Filter } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Filter/Filters";
import { Order } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Head";
import { PageChange } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Pagination/shared";
import { CursorTableData } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Cursor/Table";
import React,
{
    useEffect,
    useState,
} from "react";


const mapClassEdges = (edge: ClassConnectionEdge) => {
    const classNode = edge.node;

    return {
        id: classNode.id,
        name: classNode.name,
        grades: classNode.gradesConnection?.edges.map(mapGradeEdges) ?? [],
    };
};

const mapGradeEdges = (edge: GradeConnectionEdge) => {
    const classNode = edge.node;

    return {
        id: classNode.id,
        name: classNode.name,
    };
};

const mapAndCombineClassConnections = (user: UserNode) => {
    const allClassEdges = user.classesStudyingConnection?.edges.concat(user.classesTeachingConnection?.edges ?? []);
    const classes = allClassEdges?.map(mapClassEdges) ?? [];

    return classes;
};

export const mapUserRow = (edge: UserEdge) => {
    const user = edge.node;

    const organizationMemberships = user.organizationMembershipsConnection?.edges.map(mapOrganizationMembershipEdges) ?? [];
    const schoolMemberships = user.schoolMembershipsConnection?.edges.map(mapSchoolsMembershipEdges) ?? [];
    const organizationUserIsActive = organizationMemberships?.find(organization => organization.status === Status.ACTIVE) ?? organizationMemberships?.[0];
    const schoolClasses = mapAndCombineClassConnections(user);

    return {
        id: user.id,
        givenName: user.givenName ?? ``,
        familyName: user.familyName ?? ``,
        avatar: user.avatar ?? ``,
        email: user.contactInfo?.email ?? ``,
        phone: user.contactInfo?.phone ?? ``,
        roleNames: organizationMemberships?.map(organization => organization?.roles?.filter((role) => role.status === Status.ACTIVE)).flat().map((role) => role?.name ?? ``).sort(sortRoleNames) ?? [],
        schoolNames: schoolMemberships?.filter((school) => organizationUserIsActive?.organization?.id === school.organizationId && school.status === Status.ACTIVE).map((school) => school.name ?? ``).sort(sortSchoolNames) ?? [],
        classNames: schoolClasses.map((schoolClass) => schoolClass.name),
        gradeNames: schoolClasses.map((schoolClass) => schoolClass.grades.map((grade) => grade.name ?? ``)).flat() ?? [],
        status: organizationUserIsActive?.status ?? Status.INACTIVE,
        joinDate: new Date(organizationUserIsActive?.joinTimestamp ?? ``),
    };
};

export default function UsersPage () {
    const [ rows, setRows ] = useState<UserRow[]>([]);
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;
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

    const organizationMembershipFilter = {
        organizationId: {
            operator: `eq` as UuidOperator,
            value: organizationId,
        },
    };

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
            organizationMembershipFilter: organizationMembershipFilter,
            classFilter: organizationMembershipFilter,
        },
        skip: !organizationId,
        notifyOnNetworkStatusChange: true,
    });

    const pageInfo = usersData?.usersConnection?.pageInfo;

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
            organizationMembershipFilter: organizationMembershipFilter,
        });
    }, [
        serverPagination.search,
        serverPagination.order,
        serverPagination.orderBy,
        serverPagination.rowsPerPage,
        tableFilters,
        currentOrganization?.id,
    ]);

    useEffect(() => {
        const rows = usersData?.usersConnection.edges?.map(mapUserRow) ?? [];
        setRows(rows);
    }, [ usersData ]);

    tabTitle(`User`);

    return (
        <UserTable
            rows={rows}
            loading={loadingOrganizationMemberships}
            refetch={refetchUsers}
            order={serverToTableOrder(serverPagination.order)}
            orderBy={serverPagination.orderBy}
            rowsPerPage={serverPagination.rowsPerPage}
            search={serverPagination.search}
            total={usersData?.usersConnection?.totalCount}
            hasNextPage={pageInfo?.hasNextPage}
            hasPreviousPage={pageInfo?.hasPreviousPage}
            startCursor={pageInfo?.startCursor}
            endCursor={pageInfo?.endCursor}
            onPageChange={handlePageChange}
            onTableChange={handleTableChange}
        />
    );
}
