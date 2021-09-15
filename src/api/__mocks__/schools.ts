import {
    GetSchoolsRequest,
    GetSchoolsResponse,
} from "@/api/schools";
import { QueryResult } from "@apollo/client";
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
