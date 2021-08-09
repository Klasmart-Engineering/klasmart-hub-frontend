import { gql } from "@apollo/client";

export const ROLE_SUMMARY_NODE_FIELDS = gql`
    fragment RoleSummaryNodeFields on RoleSummaryNode {
        id
        organizationId
        schoolId
        name
        status
    }
`;
