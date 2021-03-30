import { CREATE_OR_UPDATE_SUBCATEGORIES } from "@/operations/mutations/createOrUpdateSubcategories";
import { DELETE_SUBCATEGORY } from "@/operations/mutations/deleteSubcategory";
import { GET_ALL_SUBCATEGORIES } from "@/operations/queries/getAllSubcategories";
import { Subcategory } from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface CreateOrUpdateSubcategoriesRequest {
    organization_id: string;
    subcategories: ({
        id?: string | null;
        name: string;
    })[];
}

interface CreateOrUpdateSubcategoriesResponse {
    organization: {
        createOrUpdateSubcategories: Subcategory[];
    };
}

export const useCreateOrUpdateSubcategories = (options?: MutationHookOptions<CreateOrUpdateSubcategoriesResponse, CreateOrUpdateSubcategoriesRequest>) => {
    return useMutation<CreateOrUpdateSubcategoriesResponse, CreateOrUpdateSubcategoriesRequest>(CREATE_OR_UPDATE_SUBCATEGORIES, options);
};

interface DeleteSubcategoryRequest {
    id: string;
}

interface DeleteSubcategoryResponse {
}

export const useDeleteSubcategory = (options?: MutationHookOptions<DeleteSubcategoryResponse, DeleteSubcategoryRequest>) => {
    return useMutation<DeleteSubcategoryResponse, DeleteSubcategoryRequest>(DELETE_SUBCATEGORY, options);
};

interface GetAllSubcategoriesRequest {
    organization_id: string;
}

interface GetAllSubcategoriesResponse {
    organization: {
        subcategories: Subcategory[];
    };
}

export const useGetAllSubcategories = (options?: QueryHookOptions<GetAllSubcategoriesResponse, GetAllSubcategoriesRequest>) => {
    return useQuery<GetAllSubcategoriesResponse, GetAllSubcategoriesRequest>(GET_ALL_SUBCATEGORIES, options);
};
