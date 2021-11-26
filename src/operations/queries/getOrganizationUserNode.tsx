import { gql } from "@apollo/client";

export const GET_ORGANIZATION_USER_NODE = gql`
    query getOrganizationUserNode($id: ID!, $organizationId: UUID!) {
        userNode(id: $id) {
            id
            givenName
            familyName
            gender
            dateOfBirth
            contactInfo {
                email
                phone
            }
            alternateContactInfo {
                email
                phone
            }
            roles {
                id
                name
                status
                organizationId
            }
            schools {
                id
                name
                status
                organizationId
            }
            organizationMembershipsConnection(
                count: 1
                filter: { organizationId: { value: $organizationId, operator: eq } }
            ) {
                edges {
                    node {
                        userId
                        shortCode
                    }
                }
            }
        }
    }
`;
