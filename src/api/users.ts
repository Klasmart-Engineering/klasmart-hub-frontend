import { OrganizationMembershipsConnection } from "./organizationMemberships";
import { RoleSummaryNode } from "./roles";
import { SchoolSummaryNode } from "./schools";
import { UPLOAD_USERS_CSV } from "@/operations/mutations/uploadUsersCsv";
import { useMutation } from "@apollo/client";

interface UploadCsvResponse {
    filename?: string;
    minetype?: string;
    encoding?: string;
}

interface UploadUserCsvRequest {
    file: File;
    isDryRun: boolean;
}

export const useUploadUserCsv = () => {
    return useMutation<UploadCsvResponse, UploadUserCsvRequest>(UPLOAD_USERS_CSV);
};

export interface UserNode {
    id: string;
    givenName: string | null;
    familyName: string | null;
    contactInfo?: {
        email: string | null;
        phone: string | null;
        username: string | null;
    };
    alternateContactInfo?: {
        email: string | null;
        phone: string | null;
    };
    organizations?: {
        userStatus: string;
        userShortCode: string;
        joinDate: string;
    }[];
    roles?: RoleSummaryNode[];
    schools?: SchoolSummaryNode[];
    dateOfBirth?: string;
    gender?: string;
    avatar?: string | null;
    organizationMembershipsConnection?: OrganizationMembershipsConnection;
}
