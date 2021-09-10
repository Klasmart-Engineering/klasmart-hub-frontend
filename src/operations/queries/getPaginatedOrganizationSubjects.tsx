import { SubjectFilter } from "@/api/subjects";
import { Status } from "@/types/graphQL";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";

export interface SubjectPaginationFilter {
    organizationId: string;
    search: string;
}

export const buildOrganizationSubjectSearchFilter = (search: string): SubjectFilter => ({
    ...isUuid(search)
        ? {
            id: {
                operator: `eq`,
                value: search,
            },
        }
        : {
            OR: [
                {
                    name: {
                        operator: `contains`,
                        value: search,
                        caseInsensitive: true,
                    },
                },
            ],
        },
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
            AND: [ buildOrganizationSubjectSearchFilter(filter.search) ],
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
