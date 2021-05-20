import { gql } from "@apollo/client";

export const GET_ALL_CLASSES = gql`
    query getOrganizationClasses($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            classes {
                class_id
                class_name
                status
                schools {
                    school_id
                    school_name
                }
                age_ranges {
                    id
                    name
                    high_value
                    high_value_unit
                    low_value
                    low_value_unit
                    status
                    system
                }
                programs {
                    id
                    name
                    status
                    subjects {
                        id
                        name
                        status
                    }
                }
                subjects {
                    id
                    name
                    status
                }
                grades {
                    id
                    name
                    status
                }
                students {
                    user_id
                    given_name
                    membership(organization_id: $organization_id) {
                        status
                    }
                }
                teachers {
                    user_id
                    given_name
                    membership(organization_id: $organization_id) {
                        status
                    }
                }
            }
        }
    }
`;
