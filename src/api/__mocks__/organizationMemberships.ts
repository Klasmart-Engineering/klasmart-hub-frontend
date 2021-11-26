import {
    GetUserNodeRequest,
    GetUserNodeResponse,
} from "../users";
import { QueryResult } from "@apollo/client";
import { mockUserNode } from "@tests/mockUsers";

export const mockGetOrganizationMembership = {
    data: {
        userNode: mockUserNode,
    },
    loading: false,
} as unknown as QueryResult<GetUserNodeResponse, GetUserNodeRequest>;
