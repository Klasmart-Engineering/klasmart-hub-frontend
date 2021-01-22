import { CREATE_CLASS } from "@/operations/mutations/createClass";
import { DELETE_CLASS } from "@/operations/mutations/deleteClass";
import { EDIT_CLASS_SCHOOLS } from "@/operations/mutations/editSchools";
import { UPDATE_CLASS } from "@/operations/mutations/updateClass";
import { GET_ALL_CLASSES } from "@/operations/queries/getAllClasses";
import { User } from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface UpdateClassRequest {
    class_id: string;
    class_name: string;
}

interface UpdateClassResponse {}

export const useUpdateClass = (options?: MutationHookOptions<UpdateClassResponse, UpdateClassRequest>) => {
    return useMutation<UpdateClassResponse, UpdateClassRequest>(UPDATE_CLASS, options);
};

interface UpdateClassSchoolsRequest {
    class_id: string;
    school_ids: string[];
}

interface UpdateClassSchoolsResponse {}

export const useEditClassSchools = (options?: MutationHookOptions<UpdateClassSchoolsResponse, UpdateClassSchoolsRequest>) => {
    return useMutation<UpdateClassSchoolsResponse, UpdateClassSchoolsRequest>(EDIT_CLASS_SCHOOLS, options);
};

interface DeleteClassRequest {
    class_id: string;
}

interface DeleteClassResponse {}

export const useDeleteClass = (options?: MutationHookOptions<DeleteClassResponse, DeleteClassRequest>) => {
    return useMutation<DeleteClassResponse, DeleteClassRequest>(DELETE_CLASS, options);
};

interface CreateClassRequest {
    organization_id: string;
    class_name: string;
    school_ids: string[];
}

interface CreateClassResponse {}

export const useCreateClass = (options?: MutationHookOptions<CreateClassResponse, CreateClassRequest>) => {
    return useMutation<CreateClassResponse, CreateClassRequest>(CREATE_CLASS, options);
};

interface GetAllClassesRequest {
    organization_id: string;
}

interface GetAllClassesResponse {
    me: User;
}

export const useGetAllClasses = (options?: QueryHookOptions<GetAllClassesResponse, GetAllClassesRequest>) => {
    return useQuery<GetAllClassesResponse, GetAllClassesRequest>(GET_ALL_CLASSES, options);
};
