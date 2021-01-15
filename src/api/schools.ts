import { GET_SCHOOLS_FROM_ORGANIZATION } from "@/operations/queries/getSchoolsFromOrganization";
import { DELETE_SCHOOL } from "@/operations/mutations/deleteSchool";
import { EDIT_SCHOOL } from "@/operations/mutations/editSchool";
import { CREATE_SCHOOL } from "@/operations/mutations/newSchool";
import { Organization } from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface CreateSchoolRequest {
    organization_id: string;
    school_name: string;
}

interface CreateSchoolResponse {
    organization: Organization;
}

export const useCreateSchool = (options?: MutationHookOptions<CreateSchoolResponse, CreateSchoolRequest>) => {
    return useMutation<CreateSchoolResponse, CreateSchoolRequest>(CREATE_SCHOOL, options);
};

interface UpdateSchoolRequest {
    school_id: string;
    school_name: string;
}

interface UpdateSchoolResponse {
    organization: Organization;
}

export const useUpdateSchool = (options?: MutationHookOptions<UpdateSchoolResponse, UpdateSchoolRequest>) => {
    return useMutation<UpdateSchoolResponse, UpdateSchoolRequest>(EDIT_SCHOOL, options);
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
