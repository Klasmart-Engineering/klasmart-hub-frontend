import { UserFilter } from "@/api/organizationMemberships";
import { UserRow } from "@/components/User/Table";
import { ROLE_SUMMARY_NODE_FIELDS } from "@/operations/fragments";
import {
    Status,
    UuidExclusiveOperator,
    UuidOperator,
} from "@/types/graphQL";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";
import { BaseTableData } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/BaseTable";

export interface ProgramQueryFilter {
    organizationId: string;
    search: string;
    filters: UserFilter[];
}

export const buildOrganizationUserSearchFilter = (search: string): UserFilter => ({
    ...(isUuid(search) ? {
        userId: {
            operator: `eq`,
            value: search,
        },
    } : {
        OR: [
            {
                givenName: {
                    operator: `contains`,
                    value: search,
                    caseInsensitive: true,
                },
            },
            {
                familyName: {
                    operator: `contains`,
                    value: search,
                    caseInsensitive: true,
                },
            },
            {
                email: {
                    operator: `contains`,
                    caseInsensitive: true,
                    value: search,
                },
            },
            {
                phone: {
                    operator: `contains`,
                    caseInsensitive: true,
                    value: search,
                },
            },
        ],
    }),
});

export const buildOrganizationUserFilter = (filter: ProgramQueryFilter): UserFilter => ({
    organizationId: {
        operator: `eq`,
        value: filter.organizationId,
    },
    AND: [
        buildOrganizationUserSearchFilter(filter.search),
        ...filter.filters,
        {
            OR: [
                {
                    organizationUserStatus: {
                        operator: `eq`,
                        value: Status.ACTIVE,
                    },
                },
                {
                    organizationUserStatus: {
                        operator: `eq`,
                        value: Status.INACTIVE,
                    },
                },
            ],
        },
    ],
});

export const buildOrganizationUserFilters = (filters: BaseTableData<UserRow>['filters'] = []): UserFilter[] => {
    return filters.map((filter) => {
        switch (filter.columnId) {
        case `roleNames`: {
            const values = filter.values.map((value) => {
                const organizationRolesFilter: UserFilter = {
                    roleId: {
                        operator: filter.operatorValue as UuidOperator,
                        value,
                    },
                };
                return organizationRolesFilter;
            });

            return {
                OR: values,
            };
        }
        case `status`: {
            const values = filter.values.map((value) => {
                const organizationStatusFilter: UserFilter = {
                    organizationUserStatus: {
                        operator: filter.operatorValue as UuidOperator,
                        value,
                    },
                };
                return organizationStatusFilter;
            });

            return {
                OR: values,
            };
        }
        case `schoolNames`: {
            const values = filter.values.map((value) => {
                const organizationSchoolsFilter: UserFilter = {
                    schoolId: {
                        operator: filter.operatorValue as UuidExclusiveOperator,
                        value,
                    },
                };
                return organizationSchoolsFilter;
            });

            return {
                OR: values,
            };
        }
        case `email`: {
            const values = filter.values.map((value) => {
                const userEmailFilter: UserFilter = {
                    email: {
                        operator: filter.operatorValue as UuidOperator,
                        value,
                    },
                };
                return userEmailFilter;
            });

            return {
                OR: values,
            };
        }
        case `phone`: {
            const values = filter.values.map((value) => {
                const userPhoneFilter: UserFilter = {
                    phone: {
                        operator: filter.operatorValue as UuidOperator,
                        value,
                    },
                };
                return userPhoneFilter;
            });

            return {
                OR: values,
            };
        }
        case `classNames`: {
            const values = filter.values.map((value) => {
                const classFilter: UserFilter = {
                    classId: {
                        operator: filter.operatorValue as UuidOperator,
                        value,
                    },
                };
                return classFilter;
            });

            return {
                OR: values,
            };
        }
        case `gradeNames`: {
            const values = filter.values.map((value) => {
                const gradeFilter: UserFilter = {
                    gradeId: {
                        operator: filter.operatorValue as UuidOperator,
                        value,
                    },
                };
                return gradeFilter;
            });

            return {
                OR: values,
            };
        }
        default: return {};
        }
    });
};

export const GET_PAGINATED_ORGANIZATION_USERS = gql`
    query getOrganizationUsers(
            $direction: ConnectionDirection!
                $count: PageSize
                $cursor: String
                $order: SortOrder!
                $orderBy: UserSortBy!
                $filter: UserFilter,
                $organizationMembershipFilter: OrganizationMembershipFilter,
                $classFilter: ClassFilter,
            ) {
                usersConnection(
                    direction: $direction
                    directionArgs: { count: $count, cursor: $cursor }
                    sort: { field: [$orderBy], order: $order }
                    filter: $filter
                ) {
                    totalCount
                    pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                }
                edges {
                    node {
                        id
                        givenName
                        familyName
                        avatar
                        status
                        contactInfo {
                            email
                            phone
                            username
                        }
                        dateOfBirth
                        gender
                        organizationMembershipsConnection(count: 50, direction: FORWARD, filter:$organizationMembershipFilter) {
                            edges {
                                node {
                                    joinTimestamp
                                    status
                                    shortCode
                                    organization {
                                        id
                                        name
                                    }
                                    rolesConnection(count: 50, direction: FORWARD) {
                                        edges {
                                            node {
                                                id
                                                name
                                                status
                                            }
                                        }
                                    }
                                
                                }
                            }
                        }
                        schoolMembershipsConnection(count: 50, direction: FORWARD) {
                            edges {
                                node {
                                    school {
                                        id
                                        organizationId
                                        name
                                        status
                                    }
                                }
                            
                            }
                        }
                        classesStudyingConnection (count: 50, direction: FORWARD, filter: $classFilter) {
                            edges {
                                node {
                                    id
                                    name
                                    gradesConnection {
                                        edges {
                                            node {
                                                id
                                                name
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        classesTeachingConnection (count: 50, direction: FORWARD, filter: $classFilter) {
                            edges {
                                node {
                                    id
                                    name
                                    gradesConnection {
                                        edges {
                                            node {
                                                id
                                                name
                                            }
                                        }
                                    }
                                }
                            }
                        }
        	        }
      	        }
            }
        }
`;
