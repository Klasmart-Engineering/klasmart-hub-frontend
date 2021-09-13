import {
    GetOrganizationMembershipRequest,
    GetOrganizationMembershipResponse,
} from "@/api/organizationMemberships";
import { QueryResult } from "@apollo/client";
import { mockOrganizationMemberships } from "@tests/mockUsers";

export const mockGetOrganizationMembership = {
    data: {
        user: {
            membership: mockOrganizationMemberships[0],
        },
    },
    loading: false,
} as unknown as QueryResult<GetOrganizationMembershipResponse, GetOrganizationMembershipRequest>;
