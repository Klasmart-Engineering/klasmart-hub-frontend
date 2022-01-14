import { CREATE_OR_UPDATE_CATEGORIES } from "@/operations/mutations/createOrUpdateCategories";
import { DELETE_CATEGORY } from "@/operations/mutations/deleteCategory";
import { GET_ALL_CATEGORIES } from "@/operations/queries/getAllCategories";
import {
    Category,
    Organization,
} from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface CreateOrUpdateCategoriesRequest {
    organization_id: string;
    categories: ({
        id?: string | null;
        name: string;
        subcategories: string[];
    })[];
}

interface CreateOrUpdateCategoriesResponse {
    organization: {
        createOrUpdateCategories: Category[];
    };
}

export const useCreateOrUpdateCategories = (options?: MutationHookOptions<CreateOrUpdateCategoriesResponse, CreateOrUpdateCategoriesRequest>) => {
    return useMutation<CreateOrUpdateCategoriesResponse, CreateOrUpdateCategoriesRequest>(CREATE_OR_UPDATE_CATEGORIES, {
        ...options,
        refetchQueries: [ GET_ALL_CATEGORIES ],
    });
};

interface DeleteCategoryRequest {
    id: string;
}

interface DeleteCategoryResponse {
}

export const useDeleteCategory = (options?: MutationHookOptions<DeleteCategoryResponse, DeleteCategoryRequest>) => {
    return useMutation<DeleteCategoryResponse, DeleteCategoryRequest>(DELETE_CATEGORY, {
        ...options,
        refetchQueries: [ GET_ALL_CATEGORIES ],
    });
};

interface GetAllCategoriesRequest {
    organization_id: string;
}

interface GetAllCategoriesResponse {
    organization: {
        categories: Category[];
    };
}

export const useGetAllCategories = (options?: QueryHookOptions<GetAllCategoriesResponse, GetAllCategoriesRequest>) => {
    return useQuery<GetAllCategoriesResponse, GetAllCategoriesRequest>(GET_ALL_CATEGORIES, options);
};
