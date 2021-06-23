import { gql } from "@apollo/client";

export const GET_ORGANIZATION_MEMBERSHIPS = gql`
    query {
        me {
            email
            memberships {
                organization_id
                user_id
                status
                organization {
                    organization_id
                    organization_name
                    phone
                    owner {
                        email
                    }
                    status
                    branding {
                        iconImageURL
                        primaryColor
                    }
                }
                roles {
                    role_id
                    role_name
                }
            }
        }
    }
`;
