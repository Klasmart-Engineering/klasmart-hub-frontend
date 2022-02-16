import { RoleFilter } from "@/api/roles";
import { gql } from "@apollo/client";

export const teacherStudentRoleFilter: RoleFilter = {
    AND: [
        {
            system: {
                value: true,
                operator: `eq`,
            },
        },
        {
            OR: [
                {
                    name: {
                        value: `Student`,
                        operator: `contains`,
                    },
                },
                {
                    name: {
                        value: `Teacher`,
                        operator: `contains`,
                    },
                },
            ],
        },
    ],
};

export const GET_PAGINATED_ORGANIZATION_ROLES = gql`
    query getRoles(
        $direction: ConnectionDirection!
        $count: PageSize
        $filter: RoleFilter
    ) {
        rolesConnection(
            direction: $direction
            directionArgs: { 
                count: $count
            }
            filter: $filter
            ) {
                edges {
                    node {
                    name
                    id
                    system
                }
            }
        }
    }
`;
