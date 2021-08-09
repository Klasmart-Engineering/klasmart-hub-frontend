import { cacheConfig } from "./cache";
import { RoleSummaryNode } from "@/api/roles";
import { ROLE_SUMMARY_NODE_FIELDS } from "@/operations/fragments";
import {
    gql,
    InMemoryCache,
} from "@apollo/client";

test(`RoleSummaryNodes on an Organization and School level are cached separately`, () => {
    const roles: RoleSummaryNode[] = [
        {
            id:`87aca549-fdb6-4a63-97d4-d563d4a4690a`,
            schoolId:`9e21a42b-f7de-4f5a-81f3-714ba8bf0e6a`,
            organizationId:null,
            name:`Organization Admin`,
            status:`active`,
        },
        {
            id:`87aca549-fdb6-4a63-97d4-d563d4a4690a`,
            schoolId: null,
            organizationId: `bfd07a18-eb6b-4879-ab61-db7a551b2513`,
            name:`Organization Admin`,
            status:`active`,
        },
    ];

    const nodes = roles.map(role => {
        return {
            ...role,
            __typename:`RoleSummaryNode`,
        };
    });

    const cache = new InMemoryCache(cacheConfig);

    cache.writeQuery({
        query: gql`
            query {
                nodes {
                    ...RoleSummaryNodeFields
                }
            }
            ${ROLE_SUMMARY_NODE_FIELDS}
        `,
        data: {
            nodes,
        },
    });

    expect(Object.keys(cache.extract()).filter(k => k.startsWith(`RoleSummaryNode`))).toHaveLength(2);
});
