import { CREATE_UPDATE_GRADES } from "@/operations/mutations/createUpdateGrades";
import { DELETE_GRADE } from "@/operations/mutations/deleteGrade";
import { GET_GRADES } from "@/operations/queries/getGrades";
import { Grade } from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface CreateUpdateGradeRequest {
    organization_id: string;
    grades: Grade[];
}

interface CreateUpdateGradeResponse {
    grades: Grade[];
}

export const useCreateUpdateGrade = (options?: MutationHookOptions<CreateUpdateGradeResponse, CreateUpdateGradeRequest>) => {
    return useMutation<CreateUpdateGradeResponse, CreateUpdateGradeRequest>(CREATE_UPDATE_GRADES, options);
};

interface DeleteGradeRequest {
    id: string;
}

interface DeleteGradeResponse {
    result: boolean;
}

export const useDeleteGrade = (options?: MutationHookOptions<DeleteGradeResponse, DeleteGradeRequest>) => {
    return useMutation<DeleteGradeResponse, DeleteGradeRequest>(DELETE_GRADE, options);
};

interface GetAllGradesRequest {
    organization_id: string;
}

interface GetAllGradesResponse {
    organization: { grades: Grade[] };
}

export const useGetAllGrades = (options?: QueryHookOptions<GetAllGradesResponse, GetAllGradesRequest>) => {
    return useQuery<GetAllGradesResponse, GetAllGradesRequest>(GET_GRADES, options);
};
