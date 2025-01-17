import { GetAllSubjectsPaginatedResponse } from "./subjects";
import { CREATE_OR_UPDATE_PROGRAMS } from "@/operations/mutations/createOrUpdatePrograms";
import { DELETE_PROGRAM } from "@/operations/mutations/deleteProgram";
import { EDIT_PROGRAM_AGE_RANGES } from "@/operations/mutations/editProgramAgeRanges";
import { EDIT_PROGRAM_GRADES } from "@/operations/mutations/editProgramGrades";
import { EDIT_PROGRAM_SUBJECTS } from "@/operations/mutations/editProgramSubjects";
import { GET_ALL_PROGRAMS } from "@/operations/queries/getAllPrograms";
import {
    GET_PAGINATED_ORGANIZATION_PROGRAMS,
    GET_PAGINATED_ORGANIZATION_PROGRAMS_LIST,
} from "@/operations/queries/getPaginatedOrganizationPrograms";
import { GET_PROGRAM_NODE } from "@/operations/queries/getProgramNode";
import {
    AgeRangeFilter,
    BaseEntity,
    BooleanFilter,
    Grade,
    PageInfo,
    PaginationDirection,
    Program,
    ProgramsMutationResult,
    Status,
    StatusFilter,
    StringFilter,
    Subject,
    UuidFilter,
} from "@/types/graphQL";
import { PaginationFilter } from "@/utils/pagination";
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
    return useMutation<CreateOrUpdateProgramsResponse, CreateOrUpdateProgramsRequest>(CREATE_OR_UPDATE_PROGRAMS, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_PROGRAMS ],
    });
};

interface DeleteProgramRequest {
    id: string;
}

interface DeleteProgramResponse {
}

export const useDeleteProgram = (options?: MutationHookOptions<DeleteProgramResponse, DeleteProgramRequest>) => {
    return useMutation<DeleteProgramResponse, DeleteProgramRequest>(DELETE_PROGRAM, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_PROGRAMS ],
    });
};

interface EditProgramAgeRangesRequest {
    id: string;
    ageRangeIds: string[];
}

interface EditProgramAgeRangesResponse {
    updatePrograms: ProgramsMutationResult;
}

export const useEditProgramAgeRanges = (options?: MutationHookOptions<EditProgramAgeRangesResponse, EditProgramAgeRangesRequest>) => {
    return useMutation<EditProgramAgeRangesResponse, EditProgramAgeRangesRequest>(EDIT_PROGRAM_AGE_RANGES, options);
};

interface EditProgramGradesRequest {
    id: string;
    gradeIds: string[];
}

interface EditProgramGradesResponse {
    updatePrograms: ProgramsMutationResult;
}

export const useEditProgramGrades = (options?: MutationHookOptions<EditProgramGradesResponse, EditProgramGradesRequest>) => {
    return useMutation<EditProgramGradesResponse, EditProgramGradesRequest>(EDIT_PROGRAM_GRADES, options);
};

interface EditProgramSubjectsRequest {
    id: string;
    subjectIds: string[];
}

interface EditProgramSubjectsResponse {
    updatePrograms: ProgramsMutationResult;
}

export const useEditProgramSubjects = (options?: MutationHookOptions<EditProgramSubjectsResponse, EditProgramSubjectsRequest>) => {
    return useMutation<EditProgramSubjectsResponse, EditProgramSubjectsRequest>(EDIT_PROGRAM_SUBJECTS, options);
};

export interface AgeRangeNode extends BaseEntity {
    highValue?: number | null;
    highValueUnit?: string | null;
    lowValue?: number | null;
    lowValueUnit?: string | null;
}

export interface ProgramNode {
    id: string;
    name: string;
    status: Status;
    system: boolean;
    ageRanges?: AgeRangeNode[];
    subjects?: Subject[];
    grades?: Grade[];
    subjectsConnection?: GetAllSubjectsPaginatedResponse[`subjectsConnection`];
}

export interface ProgramForm {
    id: string;
    name: string;
    ageRanges: string[];
    grades: string[];
    subjects?: string[];
}

export interface ProgramEdge {
    node: ProgramNode;
}

export interface ProgramFilter extends PaginationFilter<ProgramFilter> {
    name?: StringFilter;
    id?: UuidFilter;
    status?: StatusFilter;
    organizationId?: UuidFilter;
    system?: BooleanFilter;
    gradeId?: UuidFilter;
    subjectId?: UuidFilter;
    schoolId?: UuidFilter;
    ageRangeFrom?: AgeRangeFilter;
    ageRangeTo?: AgeRangeFilter;
}

interface GetProgramNodeRequest {
    id: string;
}

interface GetProgramNodeResponse {
    programNode: ProgramNode;
}

export const useGetProgramNode = (options?: QueryHookOptions<GetProgramNodeResponse, GetProgramNodeRequest>) => {
    return useQuery<GetProgramNodeResponse, GetProgramNodeRequest>(GET_PROGRAM_NODE, options);
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

export interface GetAllProgramsPaginatedRequest {
    direction: PaginationDirection;
    cursor?: string | null;
    count?: number;
    search?: string;
    orderBy?: string;
    order?: string;
    filter?: ProgramFilter;
}

export interface GetAllProgramsPaginatedResponse {
    programsConnection: {
        totalCount: number;
        pageInfo: PageInfo;
        edges: ProgramEdge[];
    };
}

export const useGetAllPaginatedPrograms = (options?: QueryHookOptions<GetAllProgramsPaginatedResponse, GetAllProgramsPaginatedRequest>) => {
    return useQuery<GetAllProgramsPaginatedResponse, GetAllProgramsPaginatedRequest>(GET_PAGINATED_ORGANIZATION_PROGRAMS, options);
};

export const useGetAllPaginatedProgramsList = (options?: QueryHookOptions<GetAllProgramsPaginatedResponse, GetAllProgramsPaginatedRequest>) => {
    return useQuery<GetAllProgramsPaginatedResponse, GetAllProgramsPaginatedRequest>(GET_PAGINATED_ORGANIZATION_PROGRAMS_LIST, options);
};
