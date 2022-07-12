import { CREATE_SUBCATEGORIES } from "@/operations/mutations/createOrUpdateSubcategories";
import { DELETE_SUBCATEGORY } from "@/operations/mutations/deleteSubcategory";
import { GET_ALL_SUBCATEGORIES } from "@/operations/queries/getAllSubcategories";
import { BaseEntity, Subcategory } from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface CreateSubcategoriesRequest {
    input: ({
        organizationId: string;
        name: string;
    })[];
}

interface SubcategoryConnectionNode extends BaseEntity {
}

interface SubcategoriesMutationResult {
    subcategories: [ SubcategoryConnectionNode ];
}

interface CreateSubcategoriesResponse {
    createSubcategories: SubcategoriesMutationResult;
}

export const useCreateSubcategories = (options?: MutationHookOptions<CreateSubcategoriesResponse, CreateSubcategoriesRequest>) => {
    return useMutation<CreateSubcategoriesResponse, CreateSubcategoriesRequest>(CREATE_SUBCATEGORIES, options);
};

interface DeleteSubcategoryRequest {
    id: string;
}

interface DeleteSubcategoryResponse {
}

export const useDeleteSubcategory = (options?: MutationHookOptions<DeleteSubcategoryResponse, DeleteSubcategoryRequest>) => {
    return useMutation<DeleteSubcategoryResponse, DeleteSubcategoryRequest>(DELETE_SUBCATEGORY, {
        ...options,
        refetchQueries: [ GET_ALL_SUBCATEGORIES ],
    });
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
