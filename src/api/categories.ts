import {
    CREATE_CATEGORIES,
    UPDATE_CATEGORIES,
} from "@/operations/mutations/createAndUpdateCategories";
import { DELETE_CATEGORY } from "@/operations/mutations/deleteCategory";
import { GET_ALL_CATEGORIES } from "@/operations/queries/getAllCategories";
import {
    CategoriesMutationResult,
    Category,
} from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface CreateCategoriesRequest {
    input: ({
        organizationId: string;
        name: string;
        subcategoryIds?: [string];
    })[];
}

interface CreateCategoriesResponse {
    createCategories: CategoriesMutationResult;
}

export const useCreateCategories = (options?: MutationHookOptions<CreateCategoriesResponse, CreateCategoriesRequest>) => {
    return useMutation<CreateCategoriesResponse, CreateCategoriesRequest>(CREATE_CATEGORIES, {
        ...options,
        refetchQueries: [ GET_ALL_CATEGORIES ],
    });
};

interface UpdateCategoriesResponse {
    updateCategories: CategoriesMutationResult;
}

interface UpdateCategoriesRequest {
    input: ({
        id: string;
        name?: string;
        subcategoryIds: string[];
    })[];
}

export const useUpdateCategories = (options?: MutationHookOptions<UpdateCategoriesResponse, UpdateCategoriesRequest>) => {
    return useMutation<UpdateCategoriesResponse, UpdateCategoriesRequest>(UPDATE_CATEGORIES, {
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
