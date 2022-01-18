import { CREATE_UPDATE_GRADES } from "@/operations/mutations/createUpdateGrades";
import { DELETE_GRADE } from "@/operations/mutations/deleteGrade";
import { GET_GRADE } from "@/operations/queries/getGrade";
import { GET_GRADES } from "@/operations/queries/getGrades";
import {
    GET_PAGINATED_ORGANIZATION_GRADES,
    GET_PAGINATED_ORGANIZATION_GRADES_LIST,
} from "@/operations/queries/getOrganizationGrades";
import {
    BooleanFilter,
    Direction,
    Grade,
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

export interface GradeFilter extends PaginationFilter<GradeFilter> {
    id?: UuidFilter;
    name?: StringFilter;
    status?: StringFilter;
    system?: BooleanFilter;
    organizationId?: UuidFilter;
    fromGradeId?: UuidFilter;
    toGradeId?: UuidFilter;
}

export interface GradeNode {
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
}

export interface GradeEdge {
    node: GradeNode;
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
    organizationId?: string;
    direction?: Direction;
    cursor?: string;
    count?: number;
    order?: SortOrder;
    orderBy?: string;
    filter?: GradeFilter;
}

export const useCreateUpdateGrade = (options?: MutationHookOptions<CreateUpdateGradeResponse, CreateUpdateGradeRequest>) => {
    return useMutation<CreateUpdateGradeResponse, CreateUpdateGradeRequest>(CREATE_UPDATE_GRADES, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_GRADES ],
    });
};

interface DeleteGradeRequest {
    id: string;
}

interface DeleteGradeResponse {
    result: boolean;
}

export const useDeleteGrade = (options?: MutationHookOptions<DeleteGradeResponse, DeleteGradeRequest>) => {
    return useMutation<DeleteGradeResponse, DeleteGradeRequest>(DELETE_GRADE, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_GRADES ],
    });
};

interface GetAllGradesRequest {
    organization_id: string;
}

interface GetAllGradesResponse {
    organization: { grades: Grade[] };
}

interface GetGradeRequest {
    id: string;
}

interface GetGradeResponse {
    grade: Grade;
}

export const useGetAllGrades = (options?: QueryHookOptions<GetAllGradesResponse, GetAllGradesRequest>) => {
    return useQuery<GetAllGradesResponse, GetAllGradesRequest>(GET_GRADES, options);
};

export const useGetPaginatedOrganizationGrades = (options?: QueryHookOptions<GetOrganizationGradesResponsePaginated, GetOrganizationGradesRequestPaginated>) => {
    return useQuery<GetOrganizationGradesResponsePaginated, GetOrganizationGradesRequestPaginated>(GET_PAGINATED_ORGANIZATION_GRADES, options);
};

export const useGetPaginatedOrganizationGradesList = (options?: QueryHookOptions<GetOrganizationGradesResponsePaginated, GetOrganizationGradesRequestPaginated>) => {
    return useQuery<GetOrganizationGradesResponsePaginated, GetOrganizationGradesRequestPaginated>(GET_PAGINATED_ORGANIZATION_GRADES_LIST, options);
};

export const useGetGrade = (options?: QueryHookOptions<GetGradeResponse, GetGradeRequest>) => {
    return useQuery<GetGradeResponse, GetGradeRequest>(GET_GRADE, options);
};
