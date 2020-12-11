import { gql } from "@apollo/client";

export const GET_SCHOOLS = gql`
    query me($organizationId: ID!) {
        me {
            membership(organization_id: $organizationId) {
                organization {
                    schools {
                        school_id
                        school_name
                        status
                    }
                }
            }
        }
    }
`;
