import { gql } from "@apollo/client";

export const GET_ELIGIBLE_USERS = gql`
    query class($class_id: ID!) {
        class(class_id: $class_id) {
        eligibleTeachers {
            user_id
            given_name
            family_name
        }
        eligibleStudents {
            user_id
            given_name
            family_name
        }
        }
    }
`;

export interface EligibleUser {
    user_id: string;
    given_name: string;
    family_name: string;
}

export interface EligibleUsers {
    class: {
        eligibleTeachers: EligibleUser[];
        eligibleStudents: EligibleUser[];
    };
}
