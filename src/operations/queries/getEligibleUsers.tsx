import { ROLE_SUMMARY_NODE_FIELDS } from "../fragments";
import { gql } from "@apollo/client";

export const GET_PAGINATED_ELIGIBLE_STUDENTS = gql`
    ${ROLE_SUMMARY_NODE_FIELDS}
    
    query getEligibleStudents(
        $classId: ID!
        $direction: ConnectionDirection!
        $count: PageSize
        $cursor: String
        $order: SortOrder!
        $orderBy: UserSortBy!
        $filter: EligibleMembersFilter
    ) {
        eligibleStudentsConnection(
            classId: $classId
            direction: $direction
            directionArgs: { count: $count, cursor: $cursor }
            filter: $filter
            sort: { field: [$orderBy], order: $order }
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
                    roles {
                        ...RoleSummaryNodeFields
                    }
                    contactInfo {
                        email
                        phone
                        username
                    }
                }
            }
        }
    }    
`;

export const GET_PAGINATED_ELIGIBLE_TEACHERS = gql`
    ${ROLE_SUMMARY_NODE_FIELDS}
    
    query getEligibleTeachers(
        $classId: ID!
        $direction: ConnectionDirection!
        $count: PageSize
        $cursor: String
        $order: SortOrder!
        $orderBy: UserSortBy!
        $filter: EligibleMembersFilter
    ) {
        eligibleTeachersConnection(
            classId: $classId
            direction: $direction
            directionArgs: { count: $count, cursor: $cursor }
            filter: $filter
            sort: { field: [$orderBy], order: $order }
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
                    roles {
                        ...RoleSummaryNodeFields
                    }
                    contactInfo {
                        email
                        phone
                        username
                    }
                }
            }
        }
    }    
`;
