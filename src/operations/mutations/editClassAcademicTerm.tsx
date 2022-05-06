import { gql } from "@apollo/client";

export const EDIT_CLASS_ACADEMIC_TERMS = gql`
      mutation class($input: [SetAcademicTermOfClassInput!]!) {
        setAcademicTermsOfClasses(input: $input) {
            classes {
                id
            }
        }
    }
`;
