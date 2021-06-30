import { CREATE_OR_UPDATE_PROGRAMS } from "@/operations/mutations/createOrUpdatePrograms";
import { DELETE_PROGRAM } from "@/operations/mutations/deleteProgram";
import { EDIT_PROGRAM_AGE_RANGES } from "@/operations/mutations/editProgramAgeRanges";
import { EDIT_PROGRAM_GRADES } from "@/operations/mutations/editProgramGrades";
import { EDIT_PROGRAM_SUBJECTS } from "@/operations/mutations/editProgramSubjects";
import { GET_ALL_PROGRAMS } from "@/operations/queries/getAllPrograms";
import { Program } from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface CreateOrUpdateProgramsRequest {
    organization_id: string;
    programs: ({
        id?: string;
        name: string;
        age_ranges: string[];
        grades: string[];
        subjects: string[];
    })[];
}

interface CreateOrUpdateProgramsResponse {
    organization: {
        createOrUpdatePrograms: Program[];
    };
}

export const useCreateOrUpdatePrograms = (options?: MutationHookOptions<CreateOrUpdateProgramsResponse, CreateOrUpdateProgramsRequest>) => {
    return useMutation<CreateOrUpdateProgramsResponse, CreateOrUpdateProgramsRequest>(CREATE_OR_UPDATE_PROGRAMS, options);
};

interface DeleteProgramRequest {
    id: string;
}

interface DeleteProgramResponse {
}

export const useDeleteProgram = (options?: MutationHookOptions<DeleteProgramResponse, DeleteProgramRequest>) => {
    return useMutation<DeleteProgramResponse, DeleteProgramRequest>(DELETE_PROGRAM, options);
};

interface EditProgramAgeRangesRequest {
    id: string;
    age_range_ids: string[];
}

interface EditProgramAgeRangesResponse {
    program: Program;
}

export const useEditProgramAgeRanges = (options?: MutationHookOptions<EditProgramAgeRangesResponse, EditProgramAgeRangesRequest>) => {
    return useMutation<EditProgramAgeRangesResponse, EditProgramAgeRangesRequest>(EDIT_PROGRAM_AGE_RANGES, options);
};

interface EditProgramGradesRequest {
    id: string;
    grade_ids: string[];
}

interface EditProgramGradesResponse {
    program: Program;
}

export const useEditProgramGrades = (options?: MutationHookOptions<EditProgramGradesResponse, EditProgramGradesRequest>) => {
    return useMutation<EditProgramGradesResponse, EditProgramGradesRequest>(EDIT_PROGRAM_GRADES, options);
};

interface EditProgramSubjectsRequest {
    id: string;
    subject_ids: string[];
}

interface EditProgramSubjectsResponse {
    program: Program;
}

export const useEditProgramSubjects = (options?: MutationHookOptions<EditProgramSubjectsResponse, EditProgramSubjectsRequest>) => {
    return useMutation<EditProgramSubjectsResponse, EditProgramSubjectsRequest>(EDIT_PROGRAM_SUBJECTS, options);
};

interface GetAllProgramsRequest {
    organization_id: string;
}

interface GetAllProgramsResponse {
    organization: { programs: Program[] };
}

export const useGetAllPrograms = (options?: QueryHookOptions<GetAllProgramsResponse, GetAllProgramsRequest>) => {
    return useQuery<GetAllProgramsResponse, GetAllProgramsRequest>(GET_ALL_PROGRAMS, options);
};
