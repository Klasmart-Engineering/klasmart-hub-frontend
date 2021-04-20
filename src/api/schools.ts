import { DELETE_SCHOOL } from "@/operations/mutations/deleteSchool";
import { EDIT_SCHOOL } from "@/operations/mutations/editSchool";
import { EDIT_SCHOOL_PROGRAMS } from "@/operations/mutations/editSchoolPrograms";
import { CREATE_SCHOOL } from "@/operations/mutations/newSchool";
import { UPLOAD_SCHOOLS_CSV } from "@/operations/mutations/uploadSchoolsCsv";
import { GET_SCHOOLS_FROM_ORGANIZATION } from "@/operations/queries/getSchoolsFromOrganization";
import {
    Organization,
    Program,
    School,
} from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface CreateSchoolRequest {
    organization_id: string;
    school_name: string;
    shortcode?: string;
}

interface CreateSchoolResponse {
    organization: {
        createSchool: School;
    };
}

export const useCreateSchool = (options?: MutationHookOptions<CreateSchoolResponse, CreateSchoolRequest>) => {
    return useMutation<CreateSchoolResponse, CreateSchoolRequest>(CREATE_SCHOOL, options);
};

interface UpdateSchoolRequest {
    school_id: string;
    school_name: string;
    shortcode?: string;
}

interface UpdateSchoolResponse {
    school: {
        school_id: string;
        set: School[];
    };
}

export const useUpdateSchool = (options?: MutationHookOptions<UpdateSchoolResponse, UpdateSchoolRequest>) => {
    return useMutation<UpdateSchoolResponse, UpdateSchoolRequest>(EDIT_SCHOOL, options);
};

interface EditSchoolProgramsRequest {
    school_id: string;
    program_ids: string[];
}

interface EditSchoolProgramsResponse {
    editPrograms: Program[];
}

export const useEditSchoolPrograms = (options?: MutationHookOptions<EditSchoolProgramsResponse, EditSchoolProgramsRequest>) => {
    return useMutation<EditSchoolProgramsResponse, EditSchoolProgramsRequest>(EDIT_SCHOOL_PROGRAMS, options);
};

interface DeleteSchoolRequest {
    school_id: string;
}

interface DeleteSchoolResponse {
    organization: Organization;
}

export const useDeleteSchool = (options?: MutationHookOptions<DeleteSchoolResponse, DeleteSchoolRequest>) => {
    return useMutation<DeleteSchoolResponse, DeleteSchoolRequest>(DELETE_SCHOOL, options);
};

interface GetSchoolsRequest {
    organization_id: string;
}

interface GetSchoolsResponse {
    organization: Organization;
}

export const useGetSchools = (options?: QueryHookOptions<GetSchoolsResponse, GetSchoolsRequest>) => {
    return useQuery<GetSchoolsResponse, GetSchoolsRequest>(GET_SCHOOLS_FROM_ORGANIZATION, options);
};

interface UploadSchoolsCsvResponse {
    filename?: string;
    minetype?: string;
    encoding?: string;
}

interface UploadSchoolsCsvRequest {
    file: File;
}

export const useUploadSchoolsCsv = () => {
    return useMutation<UploadSchoolsCsvResponse, UploadSchoolsCsvRequest>(UPLOAD_SCHOOLS_CSV);
};
