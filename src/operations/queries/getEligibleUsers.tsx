import { gql } from "@apollo/client";

export const GET_ELIGIBLE_USERS = gql`
    query class($class_id: ID!) {
        class(class_id: $class_id) {
            eligibleTeachers {
                school_memberships {
                    school_id
                    user {
                        user_id
                        user_name
                        given_name
                        family_name
                    }
                }
            }
            eligibleStudents {
                school_memberships {
                    school_id
                    user {
                        user_id
                        user_name
                        given_name
                        family_name
                    }
                }
            }
        }
    }
`;

export interface EligibleUser {
    user_id: string;
    given_name: string;
    family_name: string;
    school_memberships: [];
}

export interface EligibleUsers {
    class: {
        eligibleTeachers: EligibleUser[];
        eligibleStudents: EligibleUser[];
    };
}
