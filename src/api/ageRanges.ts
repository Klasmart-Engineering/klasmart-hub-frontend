import { CREATE_AGE_RANGE } from "@/operations/mutations/createAgeRange";
import { DELETE_AGE_RANGE } from "@/operations/mutations/deleteAgeRange";
import { EDIT_AGE_RANGE } from "@/operations/mutations/editAgeRange";
import { GET_AGE_RANGE } from "@/operations/queries/getAgeRange";
import { GET_AGE_RANGES } from "@/operations/queries/getAgeRanges";
import { GET_PAGINATED_AGE_RANGES } from "@/operations/queries/getPaginatedAgeRanges";
import {
    AgeRange,
    AgeRangeFilter,
    AgeRangesMutationResult,
    BooleanFilter,
    Direction,
    SortOrder,
    Status,
    StatusFilter,
    StringFilter,
    UuidFilter,
} from "@/types/graphQL";
import { PaginationFilter } from "@/utils/pagination";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface GetAgeRangesRequest {
    organization_id: string;
}

interface GetAgeRangesResponse {
    organization: {
        ageRanges: AgeRange[];
    };
}

interface GetAgeRangeRequest {
    id: string;
}

interface GetAgeRangeResponse {
    age_range: AgeRange;
}

interface CreateAgeRangeRequest {
    organization_id: string;
    name?: string;
    low_value?: number | null;
    low_value_unit?: string | null;
    high_value?: number | null;
    high_value_unit?: string | null;
}

interface EditAgeRangeRequest extends CreateAgeRangeRequest {
    id: string;
}

interface DeleteAgeRangeRequest {
    id: string;
}

interface EmptyAgeRangeResponse { }

interface DeleteAgeRangeResponse {
    deleteAgeRanges: AgeRangesMutationResult;
}

export const useGetAllAgeRanges = (options?: QueryHookOptions<GetAgeRangesResponse, GetAgeRangesRequest>) => {
    return useQuery<GetAgeRangesResponse, GetAgeRangesRequest>(GET_AGE_RANGES, options);
};

export const useCreateAgeRange = (options?: MutationHookOptions<EmptyAgeRangeResponse, CreateAgeRangeRequest>) => {
    return useMutation<EmptyAgeRangeResponse, CreateAgeRangeRequest>(CREATE_AGE_RANGE, {
        ...options,
        refetchQueries: [ GET_PAGINATED_AGE_RANGES ],
    });
};

export const useEditAgeRange = (options?: MutationHookOptions<EmptyAgeRangeResponse, EditAgeRangeRequest>) => {
    return useMutation<EmptyAgeRangeResponse, EditAgeRangeRequest>(EDIT_AGE_RANGE, {
        ...options,
        refetchQueries: [ GET_PAGINATED_AGE_RANGES ],
    });
};

export const useDeleteAgeRange = (options?: MutationHookOptions<DeleteAgeRangeResponse, DeleteAgeRangeRequest>) => {
    return useMutation<DeleteAgeRangeResponse, DeleteAgeRangeRequest>(DELETE_AGE_RANGE, {
        ...options,
        refetchQueries: [ GET_PAGINATED_AGE_RANGES ],
    });
};

export interface GetPaginatedOrganizationAgeRangesResponse {
    ageRangesConnection: {
        totalCount: number;
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
        edges: AgeRangeEdge[];
    };
}

export interface AgeRangeQueryFilter extends PaginationFilter<AgeRangeQueryFilter> {
    id?: UuidFilter;
    name?: StringFilter;
    status?: StatusFilter;
    organizationId?: UuidFilter;
    system?: BooleanFilter;
    ageRangeUnitFrom?: AgeRangeFilter;
    ageRangeValueFrom?: AgeRangeFilter;
    ageRangeUnitTo?: AgeRangeFilter;
    ageRangeValueTo?: AgeRangeFilter;
}

export interface GetPaginatedOrganizationAgeRangesRequest {
    direction?: Direction;
    cursor?: string;
    count?: number;
    order?: SortOrder;
    orderBy?: string | string[];
    filter?: AgeRangeQueryFilter;
}

export interface AgeRangeEdge {
    cursor?: string;
    node?: {
        id?: string;
        name?: string;
        status?: Status;
        system?: boolean;
        lowValue?: number;
        lowValueUnit?: string;
        highValue?: number;
        highValueUnit?: string;
    };
}

export const useGetPaginatedAgeRangesList = (options?: QueryHookOptions<GetPaginatedOrganizationAgeRangesResponse, GetPaginatedOrganizationAgeRangesRequest>) => {
    return useQuery<GetPaginatedOrganizationAgeRangesResponse, GetPaginatedOrganizationAgeRangesRequest>(GET_PAGINATED_AGE_RANGES, options);
};

export const useGetAgeRange = (options?: QueryHookOptions<GetAgeRangeResponse, GetAgeRangeRequest>) => {
    return useQuery<GetAgeRangeResponse, GetAgeRangeRequest>(GET_AGE_RANGE, options);
};

export interface AgeRangesFilter extends PaginationFilter<AgeRangesFilter> {
    name?: StringFilter;
    id?: UuidFilter;
    status?: StatusFilter;
    organizationId?: UuidFilter;
    system?: BooleanFilter;
    from?: AgeRangeFilter;
    to?: AgeRangeFilter;
}
