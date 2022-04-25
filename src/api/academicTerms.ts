import {
    ClassEdge,
    ClassesFilter,
} from "./classes";
import { GET_CLASS_ACADEMIC_TERMS } from "@/operations/queries/getClassAcademicTerms";
import {
    PageInfo,
    PaginationDirection,
} from "@/types/graphQL";
import {
    QueryHookOptions,
    useQuery,
} from "@apollo/client";

export interface GetClassAcademicTermsResponse {
    classesConnection: {
        totalCount: number;
        pageInfo: PageInfo;
        edges: ClassEdge[];
    };
}

export interface GetClassAcademicTermsRequest {
    direction: PaginationDirection;
    cursor?: string | null;
    count?: number;
    search?: string;
    orderBy?: string;
    order?: string;
    filter?: ClassesFilter;
}

export const useGetClassAcademicTerms = (options?: QueryHookOptions<GetClassAcademicTermsResponse, GetClassAcademicTermsRequest>) => {
    return useQuery<GetClassAcademicTermsResponse, GetClassAcademicTermsRequest>(GET_CLASS_ACADEMIC_TERMS, options);
};
