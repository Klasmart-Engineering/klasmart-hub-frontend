import {
    GetPaginatedSchoolsRequest,
    GetPaginatedSchoolsRequestResponse,
    GetSchoolsRequest,
    GetSchoolsResponse,
} from "@/api/schools";
import { QueryResult } from "@apollo/client";
import { mockSchoolsData } from "@tests/mockDataSchools";
import {
    schoolA,
    schoolB,
    schoolC,
} from "@tests/mocks/mockSchools";

export const mockUseGetSchools = {
    data: {
        organization: {
            schools: [
                schoolA,
                schoolB,
                schoolC,
            ],
        },
    },
    loading: false,
} as QueryResult<GetSchoolsResponse, GetSchoolsRequest>;

export const mockUseGetPaginatedSchools = {
    data: mockSchoolsData,
    refetch: jest.fn(),
    loading: false,
} as unknown as QueryResult<GetPaginatedSchoolsRequestResponse, GetPaginatedSchoolsRequest>;
