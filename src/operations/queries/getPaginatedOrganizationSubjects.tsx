import { SubjectFilter } from "@/api/subjects";
import { SubjectRow } from "@/components/Subject/Table";
import {
    BooleanOperator,
    Status,
    UuidOperator,
} from "@/types/graphQL";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";
import { BaseTableData } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/BaseTable";

export interface SubjectPaginationFilter {
    organizationId: string;
    search: string;
    filters: SubjectFilter[];
}

export const buildOrganizationSubjectSearchFilter = (search: string): SubjectFilter => ({
    ...(isUuid(search) ? {
        id: {
            operator: `eq`,
            value: search,
        },
    } : {
        OR: [
            {
                name: {
                    operator: `contains`,
                    value: search,
                    caseInsensitive: true,
                },
            },
        ],
    }),
});

export const buildOrganizationSubjectFilter = (filter: SubjectPaginationFilter): SubjectFilter => ({
    status: {
        operator: `eq`,
        value: Status.ACTIVE,
    },
    AND: [
        {
            OR: [
                {
                    organizationId: {
                        operator: `eq`,
                        value: filter.organizationId,
                    },
                },
                {
                    system: {
                        operator: `eq`,
                        value: true,
                    },
                },
            ],
        },
        {
            AND: [ buildOrganizationSubjectSearchFilter(filter.search), ...filter.filters ],
        },
    ],
});

export const buildSubjectIdsFilter = (ids: string[]): SubjectFilter => ({
    OR: ids.map((id) => ({
        id: {
            operator: `eq`,
            value: id,
        },
    })),
});
export const buildSubjectsFilters = (filters: BaseTableData<SubjectRow>['filters'] = []): SubjectFilter[] => {
    return filters.map((filter) => {
        switch (filter.columnId) {
        case `system`: {
            const values = filter.values.map((value) => {
                const systemFilter: SubjectFilter = {
                    system: {
                        operator: filter.operatorValue as BooleanOperator,
                        value: value === `true` ? true : false,
                    },
                };
                return systemFilter;
            });

            return {
                OR: values,
            };
        }
        case `categories`: {
            const values = filter.values.map((value) => {
                const categoryFilter: SubjectFilter = {
                    categoryId: {
                        operator: filter.operatorValue as UuidOperator,
                        value: value,
                    },
                };
                return categoryFilter;
            });

            return {
                OR: values,
            };
        }
        default: return {};
        }
    });
};

export const GET_PAGINATED_ORGANIZATION_SUBJECTS = gql`
    query getOrganizationSubjects(
        $direction: ConnectionDirection!
        $count: PageSize
        $cursor: String
        $orderBy: SubjectSortBy!
        $order: SortOrder!
        $filter: SubjectFilter
    ) {
        subjectsConnection(
            direction: $direction
            directionArgs: { count: $count, cursor: $cursor }
            sort: { field: $orderBy, order: $order }
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
                    name
                    status
                    system
                    categories {
                        id
                        name
                        status
                        system
                    }
                }
            }
        }
    }
`;
