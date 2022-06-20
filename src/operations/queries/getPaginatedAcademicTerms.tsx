import { AcademicTermFilter } from "@/api/academicTerms";
import { Status } from "@/types/graphQL";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";

export interface AcademicTermPaginationFilter {
    search: string;
}

const buildAcademicTermSearchFilter = (search: string): AcademicTermFilter => ({
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

export const buildAcademicTermFilter = (filter: AcademicTermPaginationFilter): AcademicTermFilter => ({
    status: {
        operator: `eq`,
        value: Status.ACTIVE,
    },
    AND: [ buildAcademicTermSearchFilter(filter.search) ],
});

export const GET_PAGINATED_ACADEMIC_TERMS = gql`
        query getSchoolNode( 
            $id: ID!, 
            $filter: AcademicTermFilter, 
            $direction: ConnectionDirection!,
            $count: PageSize, 
            $cursor: String,
            $order: SortOrder!
            $orderBy: [AcademicTermSortBy!]!
            ) 
            {
                schoolNode(id: $id) {
                    id
                    name
                    academicTermsConnection (
                        direction: $direction
                        count: $count
                        cursor: $cursor
                        filter: $filter,
                        sort: { field: $orderBy, order: $order }
                        )
                        {
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
                                    startDate
                                    endDate
                                    status
                                }
                            }
                        }
                }
            }
`;
