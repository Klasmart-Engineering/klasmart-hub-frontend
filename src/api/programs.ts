import { CREATE_OR_UPDATE_PROGRAMS } from "@/operations/mutations/createOrUpdatePrograms";
import { DELETE_PROGRAM } from "@/operations/mutations/deleteProgram";
import { EDIT_PROGRAM_AGE_RANGES } from "@/operations/mutations/editProgramAgeRanges";
import { EDIT_PROGRAM_GRADES } from "@/operations/mutations/editProgramGrades";
import { EDIT_PROGRAM_SUBJECTS } from "@/operations/mutations/editProgramSubjects";
import { GET_PAGINATED_ORGANIZATION_PROGRAMS } from "@/operations/queries/getPaginatedOrganizationPrograms";
import {
    Grade,
    PaginationDirection,
    Program,
    Status,
    Subject,
} from "@/types/graphQL";
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

export interface BaseEntity {
    id: string;
    name: string;
    status: Status;
    system: boolean;
}

export interface ProgramEdgeAgeRange extends BaseEntity {
    highValue?: number | null;
    highValueUnit?: string | null;
    lowValue?: number | null;
    lowValueUnit?: string | null;
}

export interface ProgramEdge {
    node: {
        id?: string;
        name?: string | null;
        status?: string;
        system?: boolean;
        ageRanges?: ProgramEdgeAgeRange[];
        subjects?: Subject[];
        grades?: Grade[];
    };
}

export interface ProgramFilter {
    name?: {
        operator: string;
        value: string;
        caseInsensitive: boolean;
    };
    id?: {
        operator: string;
        value: string;
    };
}

interface GetAllProgramsRequest {
    organizationId: string;
    direction: PaginationDirection;
    cursor?: string | null;
    count?: number;
    search?: string;
    orderBy?: string;
    order?: string;
    filter?: ProgramFilter;
}

interface GetAllProgramsResponse {
    programsConnection: {
        totalCount: number;
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
        edges: ProgramEdge[];
    };
}

export const useGetAllPrograms = (options?: QueryHookOptions<GetAllProgramsResponse, GetAllProgramsRequest>) => {
    return useQuery<GetAllProgramsResponse, GetAllProgramsRequest>(GET_PAGINATED_ORGANIZATION_PROGRAMS, options);
};
