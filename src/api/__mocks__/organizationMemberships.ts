import {
    GetOrganizationUserNodeRequest,
    GetOrganizationUserNodeResponse,
} from "../organizationMemberships";
import { QueryResult } from "@apollo/client";
import { mockUserNode } from "@tests/mockUsers";

export const mockGetOrganizationMembership = {
    data: {
        userNode: mockUserNode,
    },
    loading: false,

} as QueryResult<GetOrganizationUserNodeResponse, GetOrganizationUserNodeRequest>;
