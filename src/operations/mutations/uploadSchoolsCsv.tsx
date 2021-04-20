import { gql } from "@apollo/client";

export const UPLOAD_SCHOOLS_CSV = gql`
    mutation uploadSchoolsFromCSV($file: Upload!) {
        uploadSchoolsFromCSV(file: $file) {
            filename
            mimetype
            encoding
        }
    }
`;
