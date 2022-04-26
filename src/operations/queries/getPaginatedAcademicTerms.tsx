import { gql } from "@apollo/client";

export const GET_PAGINATED_ACADEMIC_TERMS = gql`
        query getSchoolNode( $id: ID!, 
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
