import { SchoolFilter } from "./schools";
import { AcademicTermRow } from "@/components/School/AcademicTerm/Table";
import { CREATE_ACADEMIC_TERM } from "@/operations/mutations/createAcademicTerm";
import { DELETE_ACADEMIC_TERM } from "@/operations/mutations/deleteAcademicTerm";
import { GET_ALL_ACADEMIC_TERMS } from "@/operations/queries/getAllAcademicTerms";
import {
    Direction,
    Status,
} from "@/types/graphQL";
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
        refetchQueries: [ GET_ALL_ACADEMIC_TERMS ],
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
        refetchQueries: [ GET_ALL_ACADEMIC_TERMS ],
    });
};

interface GetAllAcademicTermsRequest {
    direction?: Direction;
    cursor?: string;
    count?: number;
    orderBy?: string;
    order?: string;
    filter?: SchoolFilter;
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
    edges: AcademicTermEdge[];
}

export interface SchoolsConnectionEdge {
    node: {
        academicTermsConnection: AcademicTermsConnection;
        id: string;
        name: string;
    };
}

interface GetAllAcademicTermsResponse {
    schoolsConnection: {
        totalCount: number;
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
        edges: SchoolsConnectionEdge[];
    };
}

export const useGetAllAcademicTerms = (options?: QueryHookOptions<GetAllAcademicTermsResponse, GetAllAcademicTermsRequest>) => {
    return useQuery<GetAllAcademicTermsResponse, GetAllAcademicTermsRequest>(GET_ALL_ACADEMIC_TERMS, options);
};

export const mapAcademicTermNodeToAcademicTermRow = (node: AcademicTermNode): AcademicTermRow => ({
    id: node.id,
    termName: node.name,
    startDate: node.startDate,
    endDate: node.endDate,
    status: node.status,
});
