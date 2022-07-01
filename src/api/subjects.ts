import { ProgramFilter } from "./programs";
import { CREATE_OR_UPDATE_SUBJECTS } from "@/operations/mutations/createOrUpdateSubjects";
import { DELETE_SUBJECT } from "@/operations/mutations/deleteSubject";
import {
    GET_ALL_SUBJECTS,
    GET_ALL_SUBJECTS_LIST,
} from "@/operations/queries/getAllSubjects";
import { GET_PAGINATED_ORGANIZATION_SUBJECTS } from "@/operations/queries/getPaginatedOrganizationSubjects";
import { GET_SUBJECT } from "@/operations/queries/getSubject";
import {
    BooleanFilter,
    Category,
    PageInfo,
    PaginationDirection,
    Program,
    Status,
    StatusFilter,
    StringFilter,
    Subject,
    SubjectsMutationResult,
    UuidFilter,
} from "@/types/graphQL";
import { PaginationFilter } from "@/utils/pagination";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface CreateOrUpdateSubjectsRequest {
    organization_id: string;
    subjects: ({
        id?: string | null;
        name: string;
        categories: string[];
    })[];
}

interface CreateOrUpdateSubjectsResponse {
    organization: {
        createOrUpdateSubjects: Subject[];
    };
}

export const useCreateOrUpdateSubjects = (options?: MutationHookOptions<CreateOrUpdateSubjectsResponse, CreateOrUpdateSubjectsRequest>) => {
    return useMutation<CreateOrUpdateSubjectsResponse, CreateOrUpdateSubjectsRequest>(CREATE_OR_UPDATE_SUBJECTS, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_SUBJECTS ],
    });
};

interface DeleteSubjectRequest {
    id: string;
}

interface DeleteSubjectResponse {
    deleteSubjects: SubjectsMutationResult;
}

export const useDeleteSubject = (options?: MutationHookOptions<DeleteSubjectResponse, DeleteSubjectRequest>) => {
    return useMutation<DeleteSubjectResponse, DeleteSubjectRequest>(DELETE_SUBJECT, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_SUBJECTS ],
    });
};

interface GetSubjectRequest {
    subject_id: string;
}

interface GetSubjectResponse {
    subject: Subject;
}

export const useGetSubject = (options?: QueryHookOptions<GetSubjectResponse, GetSubjectRequest>) => {
    return useQuery<GetSubjectResponse, GetSubjectRequest>(GET_SUBJECT, options);
};

interface GetAllSubjectsRequest {
    organization_id: string;
}

interface GetAllSubjectsResponse {
    organization: {
        subjects: Subject[];
        programs: Program[];
    };
}

export const useGetAllSubjects = (options?: QueryHookOptions<GetAllSubjectsResponse, GetAllSubjectsRequest>) => {
    return useQuery<GetAllSubjectsResponse, GetAllSubjectsRequest>(GET_ALL_SUBJECTS, options);
};

export const useGetAllSubjectsList = (options?: QueryHookOptions<GetAllSubjectsResponse, GetAllSubjectsRequest>) => {
    return useQuery<GetAllSubjectsResponse, GetAllSubjectsRequest>(GET_ALL_SUBJECTS_LIST, options);
};

export interface SubjectNode {
    id: string;
    name: string;
    status: Status;
    system: boolean;
    categories: Category[];
}

export interface SubjectEdge {
    node: SubjectNode;
}

export interface SubjectFilter extends PaginationFilter<SubjectFilter> {
    id?: UuidFilter;
    name?: StringFilter;
    status?: StatusFilter;
    system?: BooleanFilter;
    organizationId?: UuidFilter;
    categoryId?: UuidFilter;
    programId?: UuidFilter;
}

interface GetAllSubjectsPaginatedRequest {
    direction: PaginationDirection;
    cursor?: string | null;
    count?: number;
    search?: string;
    orderBy?: string;
    order?: string;
    filter?: SubjectFilter;
}

export interface GetAllSubjectsPaginatedResponse {
    subjectsConnection: {
        totalCount: number;
        pageInfo: PageInfo;
        edges: SubjectEdge[];
    };
}

export const useGetAllPaginatedSubjects = (options?: QueryHookOptions<GetAllSubjectsPaginatedResponse, GetAllSubjectsPaginatedRequest>) => {
    return useQuery<GetAllSubjectsPaginatedResponse, GetAllSubjectsPaginatedRequest>(GET_PAGINATED_ORGANIZATION_SUBJECTS, options);
};
