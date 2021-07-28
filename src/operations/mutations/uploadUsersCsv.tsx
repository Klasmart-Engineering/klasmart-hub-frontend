import { gql } from "@apollo/client";

export const UPLOAD_USERS_CSV = gql`
    mutation UploadUsersFromCSV($file: Upload!, $isDryRun: Boolean) {
        uploadUsersFromCSV(file: $file, isDryRun: $isDryRun) {
            filename
            mimetype
            encoding
        }
    }
`;
