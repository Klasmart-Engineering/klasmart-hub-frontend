import { gql } from "@apollo/client";

export const GET_ORGANIZATION_USER_NODE = gql`
    query getOrganizationUserNode($userId: ID!, $organizationId: UUID!) {
        userNode(id: $userId) {
            id
            givenName
            familyName
            gender
            dateOfBirth
            contactInfo {
              email
              phone
              username
            }
            alternateContactInfo {
              email
              phone
              username
            }
            schoolMembershipsConnection {
              edges {
                node {
                  school {
                    id
                    name
                    status
                    organizationId
                  }
                }
              }
            }
            organizationMembershipsConnection(
              count: 1
              filter: { organizationId: { value: $organizationId, operator: eq } }
            ) {
              edges {
                node {
                  userId
                  shortCode
                  rolesConnection {
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
          }
        }
`;
