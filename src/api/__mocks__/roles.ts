import {
    GetAllRolesRequest,
    GetAllRolesResponse,
} from "@/api/roles";
import { QueryResult } from "@apollo/client";
import {
    mockRoles,
    mockSystemRoles,
} from "@tests/mockRoles";

export const mockGetOrganizationRoles = {
    data: {
        organization: {
            roles: [ ...mockSystemRoles, mockRoles.customRole ],
        },
    },
    loading: false,
} as QueryResult<GetAllRolesResponse, GetAllRolesRequest>;
