import { CREATE_AGE_RANGE } from "@/operations/mutations/createAgeRange";
import { DELETE_AGE_RANGE } from "@/operations/mutations/deleteAgeRange";
import { EDIT_AGE_RANGE } from "@/operations/mutations/editAgeRange";
import { GET_AGE_RANGES } from "@/operations/queries/getAgeRange";
import { AgeRange } from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface GetAgeRangeRequest {
    organization_id: string;
}

interface GetAgeRangeResponse {
    organization: {
        ageRanges: AgeRange[];
    };
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

export const useGetAllAgeRanges = (options?: QueryHookOptions<GetAgeRangeResponse, GetAgeRangeRequest>) => {
    return useQuery<GetAgeRangeResponse, GetAgeRangeRequest>(GET_AGE_RANGES, options);
};

export const useCreateAgeRange = (options?: MutationHookOptions<EmptyAgeRangeResponse, CreateAgeRangeRequest>) => {
    return useMutation<EmptyAgeRangeResponse, CreateAgeRangeRequest>(CREATE_AGE_RANGE, options);
};

export const useEditAgeRange = (options?: MutationHookOptions<EmptyAgeRangeResponse, EditAgeRangeRequest>) => {
    return useMutation<EmptyAgeRangeResponse, EditAgeRangeRequest>(EDIT_AGE_RANGE, options);
};

export const useDeleteAgeRange = (options?: MutationHookOptions<EmptyAgeRangeResponse, DeleteAgeRangeRequest>) => {
    return useMutation<EmptyAgeRangeResponse, DeleteAgeRangeRequest>(DELETE_AGE_RANGE, options);
};
