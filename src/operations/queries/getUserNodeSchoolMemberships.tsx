import gql from "graphql-tag";

export const GET_USER_NODE_SCHOOL_MEMBERSHIPS = gql`
    query getUserNode($id: ID!) {
        userNode(id: $id) {
            roles {
                id
                name
                schoolId
                status
            }
            schools {
                id
                name
                status
            }
        }
    }`
;
