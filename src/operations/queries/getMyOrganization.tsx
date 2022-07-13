import { gql } from "@apollo/client";

export const GET_ORGANIZATION_OWNERSHIPS = gql`
    query myUser {
      myUser {
      node {
        id
        organizationMembershipsConnection{
          edges {
            node {
              status
              organization {
                id
                name
                contactInfo {
                  phone
                }
              }
              rolesConnection{
                edges {
                  node {
                    id
                    name
                    status
                  }
                }
              }
              user {
                   contactInfo {
                        email
                        phone
                        username
                    }
              }
            }
          }
        }
      }
    }
  }
  `;
