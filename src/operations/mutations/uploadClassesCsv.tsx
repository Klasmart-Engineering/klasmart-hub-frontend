import { gql } from "@apollo/client";

export const UPLOAD_CLASSES_CSV = gql`
    mutation uploadClassesFromCSV($file: Upload!) {
        uploadClassesFromCSV(file: $file) {
            filename
            mimetype
            encoding
        }
    }
`;
