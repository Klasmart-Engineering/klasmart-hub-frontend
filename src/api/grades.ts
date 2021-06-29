import { CREATE_UPDATE_GRADES } from "@/operations/mutations/createUpdateGrades";
import { DELETE_GRADE } from "@/operations/mutations/deleteGrade";
import { GET_GRADES } from "@/operations/queries/getGrades";
import { GET_PAGINATED_ORGANIZATION_GRADES } from "@/operations/queries/getOrganizationGrades";
import {
    Grade,
    Status,
} from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface CreateUpdateGradeRequest {
    organization_id: string;
    grades: ({
        id?: string;
        name: string;
        progress_from_grade_id: string;
        progress_to_grade_id: string;
    })[];
}

interface CreateUpdateGradeResponse {
    grades: Grade[];
}

interface CursorFilter<T> {
    AND?: T[];
    OR?: T[];
}

interface ValueFilter {
    operator: 'contains' | 'eq';
    value: string;
    caseInsensitive?: boolean;
}

export interface GradeFilter extends CursorFilter<GradeFilter[]> {
    id?: ValueFilter;
    name?: ValueFilter;
}

export interface GradeEdge {
    node: {
        id: string;
        name: string;
        fromGrade?: {
            id: string;
            name: string;
            system: boolean;
            status?: Status;
        };
        toGrade?: {
            id: string;
            name: string;
            system: boolean;
            status?: Status;
        };
        system: boolean;
        status?: Status;
    };
}

export interface GetOrganizationGradesResponsePaginated {
    gradesConnection: {
        totalCount: number;
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
        edges: GradeEdge[];
    };
}

export interface GetOrganizationGradesRequestPaginated {
    organizationId: string;
    direction?: `FORWARD` | `BACKWARD`;
    cursor?: string;
    count?: number;
    filter?: GradeFilter;
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

export const useGetPaginatedOrganizationGrades = (options?: QueryHookOptions<GetOrganizationGradesResponsePaginated, GetOrganizationGradesRequestPaginated>) => {
    return useQuery<GetOrganizationGradesResponsePaginated, GetOrganizationGradesRequestPaginated>(GET_PAGINATED_ORGANIZATION_GRADES, options);
};
