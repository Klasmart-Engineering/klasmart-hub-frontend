import { gql } from "@apollo/client";

export const GET_ELIGIBLE_USERS = gql`
    query class($class_id: ID!, $organization_id: ID!) {
        class(class_id: $class_id) {
            eligibleTeachers {
                user_id
                full_name
                given_name
                family_name
                email
                phone
                school_memberships {
                    school_id
                    user {
                        membership(organization_id: $organization_id) {
                            status
                        }
                    }
                }
            }
            eligibleStudents {
                user_id
                full_name
                given_name
                family_name
                email
                phone
                school_memberships {
                    school_id
                    user {
                        membership(organization_id: $organization_id) {
                            status
                        }
                    }
                }
            }
        }
    }
`;
