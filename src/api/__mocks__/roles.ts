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
    refetch: jest.fn(),
    loading: false,
} as unknown as QueryResult<GetAllRolesResponse, GetAllRolesRequest>;
