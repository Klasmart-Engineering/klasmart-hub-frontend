
import { CREATE_ACADEMIC_TERM } from "@/operations/mutations/createAcademicTerm";
import { DELETE_ACADEMIC_TERM } from "@/operations/mutations/deleteAcademicTerm";
import { GET_PAGINATED_ACADEMIC_TERMS } from "@/operations/queries/getPaginatedAcademicTerms";
import {
    Direction,
    PageInfo,
    SortOrder,
    Status,
    StringFilter,
    UuidFilter,
} from "@/types/graphQL";
import {
    isUuid,
    PaginationFilter,
} from "@/utils/pagination";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface CreateAcademicTermRequest {
    schoolId: string;
    name: string;
    startDate: string;
    endDate: string;
}

interface CreateAcademicResponse {
    id: string;
}

export const useCreateAcademicTerm = (options?: MutationHookOptions<CreateAcademicResponse, CreateAcademicTermRequest>) => {
    return useMutation<CreateAcademicResponse, CreateAcademicTermRequest>(CREATE_ACADEMIC_TERM, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ACADEMIC_TERMS ],
    });
};

interface DeleteAcademicTermRequest {
    id: string;
}

interface DeleteAcademicTermResponse {
    id: string;
}

export const useDeleteAcademicTerm = (options?: MutationHookOptions<DeleteAcademicTermResponse, DeleteAcademicTermRequest>) => {
    return useMutation<DeleteAcademicTermResponse, DeleteAcademicTermRequest>(DELETE_ACADEMIC_TERM, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ACADEMIC_TERMS ],
    });
};

interface GetPaginatedcademicTermsRequest {
    id?: string;
    filter?: AcademicTermFilter;
    direction?: Direction;
    cursor?: string;
    count?: number;
    order: SortOrder;
    orderBy: string;
    search?: string;
}
interface GetPaginatedAcademicTermsResponse {
    schoolNode: {
        id: string;
        name: string;
        academicTermsConnection: AcademicTermsConnection;
    };
}
export interface AcademicTermEdge {
    node: AcademicTermNode;
}
export interface AcademicTermNode {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: Status;
}

export interface AcademicTermsConnection {
    totalCount: number;
    pageInfo: PageInfo;
    edges: AcademicTermEdge[];
}

export interface AcademicTermFilter extends PaginationFilter<AcademicTermFilter> {
    id?: UuidFilter;
    name?: StringFilter;
    status?: StringFilter;
}

export interface AcademicTermPaginationFilter {
    search: string;
}

const buildAcademicTermSearchFilter = (search: string): AcademicTermFilter => ({
    ...(isUuid(search) ? {
        id: {
            operator: `eq`,
            value: search,
        },
    } : {
        OR: [
            {
                name: {
                    operator: `contains`,
                    value: search,
                    caseInsensitive: true,
                },
            },
        ],
    }),
});

export const builAcademicTermFilter = (filter: AcademicTermPaginationFilter): AcademicTermFilter => ({
    status: {
        operator: `eq`,
        value: Status.ACTIVE,
    },
    AND: [ buildAcademicTermSearchFilter(filter.search) ],
});

export const useGetPaginatedAcademicTerms = (options?: QueryHookOptions<GetPaginatedAcademicTermsResponse, GetPaginatedcademicTermsRequest>) => {
    return useQuery<GetPaginatedAcademicTermsResponse, GetPaginatedcademicTermsRequest>(GET_PAGINATED_ACADEMIC_TERMS, options);
};
