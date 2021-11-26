import gql from "graphql-tag";

export const GET_USER_NODE = gql`
    query getUserNode($id: ID!, $organizationId: UUID!) {
        userNode(id: $id) {
            id
            givenName
            familyName
            gender
            dateOfBirth
            roles {
                id
                name
                organizationId
                schoolId
                status
            }
            contactInfo {
                email
                phone
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
