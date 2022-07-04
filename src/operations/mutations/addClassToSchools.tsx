import { gql } from "@apollo/client";

export const ADD_CLASS_TO_SCHOOLS = gql`
    mutation addClassToSchools($input: [AddClassesToSchoolInput!]!) {
        addClassesToSchools(input: $input) {
            schools {
                id
            }
        }
    }  
`;
