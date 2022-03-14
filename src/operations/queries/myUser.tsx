import { gql } from "@apollo/client";

export const MY_USER_QUERY = gql`
{
  myUser {
    profiles {
      id
      givenName
      familyName
      avatar
      contactInfo {
        email
        phone
        username
      }
    }
    node {
      id
      givenName
      familyName
      avatar
      contactInfo {
        email
        phone
        username
      }
      username
      organizationMembershipsConnection(direction: FORWARD) {
        edges {
          node {
            organization {
              id
              name
              branding {
                primaryColor
                iconImageURL
              }
              owners {
                email
              }
              contactInfo {
                phone
              }
            }
            rolesConnection(direction:FORWARD) {
              edges {
                node {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
