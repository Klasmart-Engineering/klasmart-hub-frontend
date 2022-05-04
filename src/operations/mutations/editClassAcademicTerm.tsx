import { gql } from "@apollo/client";

export const EDIT_CLASS_ACADEMIC_TERMS = gql`
      mutation setAcademicTermsOfClasses($input: [SetAcademicTermOfClassInput!]!) {
        setAcademicTermsOfClasses(input: $input) {
            classes {
                id
            }
        }
    }
`;
