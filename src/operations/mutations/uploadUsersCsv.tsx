import { gql } from "@apollo/client";

export const UPLOAD_USERS_CSV = gql`
    mutation UploadUsersFromCSV($file: Upload!) {
        uploadUsersFromCSV(file: $file) {
            filename
            mimetype
            encoding
        }
    }
`;
