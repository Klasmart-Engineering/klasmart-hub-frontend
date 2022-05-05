import { AcademicTermEdge } from "./academicTerms";
import { ClassEdge } from "./classes";
import { ProgramEdge } from "./programs";
import { DELETE_SCHOOL } from "@/operations/mutations/deleteSchool";
import { EDIT_SCHOOL } from "@/operations/mutations/editSchool";
import { EDIT_SCHOOL_PROGRAMS } from "@/operations/mutations/editSchoolPrograms";
import { CREATE_SCHOOL } from "@/operations/mutations/newSchool";
import { UPLOAD_SCHOOLS_CSV } from "@/operations/mutations/uploadSchoolsCsv";
import { GET_PAGINATED_ORGANIZATION_SCHOOLS } from "@/operations/queries/getPaginatedOrganizationSchools";
import {
    GET_SCHOOL_NODE,
    GET_SCHOOL_NODE_WITH_CLASS_RELATIONS,
} from "@/operations/queries/getSchoolNode";
import { GET_SCHOOLS_FROM_ORGANIZATION } from "@/operations/queries/getSchoolsFromOrganization";
import {
    BaseEntity,
    Direction,
    Organization,
    PageInfo,
    Program,
    SchoolDeprecated,
    SortOrder,
    Status,
    StringFilter,
    UuidFilter,
} from "@/types/graphQL";
import { PaginationFilter } from "@/utils/pagination";
import {
    MutationHookOptions,
    QueryHookOptions,
    useLazyQuery,
    useMutation,
    useQuery,
} from "@apollo/client";

export interface SchoolFilter extends PaginationFilter<SchoolFilter> {
    name?: StringFilter;
    shortCode?: StringFilter;
    organizationId?: UuidFilter;
    schoolId?: UuidFilter;
    status?: StringFilter;
}

interface CreateSchoolRequest {
    organization_id: string;
    school_name: string;
    shortcode?: string;
}

interface CreateSchoolResponse {
    organization: {
        createSchool: SchoolDeprecated;
    };
}

export interface SchoolSummaryNode extends BaseEntity {
    name: string;
    status: Status;
    organizationId?: string;
}

export const useCreateSchool = (options?: MutationHookOptions<CreateSchoolResponse, CreateSchoolRequest>) => {
    return useMutation<CreateSchoolResponse, CreateSchoolRequest>(CREATE_SCHOOL, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_SCHOOLS ],
    });
};

interface UpdateSchoolRequest {
    school_id: string;
    school_name: string;
    shortcode?: string;
}

interface UpdateSchoolResponse {
    school: {
        school_id: string;
        set: SchoolDeprecated[];
    };
}

export const useUpdateSchool = (options?: MutationHookOptions<UpdateSchoolResponse, UpdateSchoolRequest>) => {
    return useMutation<UpdateSchoolResponse, UpdateSchoolRequest>(EDIT_SCHOOL, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_SCHOOLS ],
    });
};

interface EditSchoolProgramsRequest {
    school_id: string;
    program_ids: string[];
}

interface EditSchoolProgramsResponse {
    editPrograms: Program[];
}

export const useEditSchoolPrograms = (options?: MutationHookOptions<EditSchoolProgramsResponse, EditSchoolProgramsRequest>) => {
    return useMutation<EditSchoolProgramsResponse, EditSchoolProgramsRequest>(EDIT_SCHOOL_PROGRAMS, options);
};

interface DeleteSchoolRequest {
    school_id: string;
}

interface DeleteSchoolResponse {
    organization: Organization;
}

export const useDeleteSchool = (options?: MutationHookOptions<DeleteSchoolResponse, DeleteSchoolRequest>) => {
    return useMutation<DeleteSchoolResponse, DeleteSchoolRequest>(DELETE_SCHOOL, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_SCHOOLS ],
    });
};

export interface GetSchoolsRequest {
    organization_id: string;
}

export interface GetSchoolsResponse {
    organization: Pick<Organization, "schools">;
}

export const useGetSchools = (options?: QueryHookOptions<GetSchoolsResponse, GetSchoolsRequest>) => {
    return useQuery<GetSchoolsResponse, GetSchoolsRequest>(GET_SCHOOLS_FROM_ORGANIZATION, options);
};

interface GetSchoolNodeRequest {
    id: string;
    programCount?: number;
    programCursor?: string;
}

interface GetSchoolNodeResponse {
    schoolNode: SchoolNode;
}

interface GetSchoolNodeWithClassRelationsRequest {
    id: string;
    count?: number;
    cursor?: string;
    direction?: Direction;
    order: SortOrder;
    orderBy: string;
}

export const useGetSchoolNode = (options?: QueryHookOptions<GetSchoolNodeResponse, GetSchoolNodeRequest>) => {
    return useQuery<GetSchoolNodeResponse, GetSchoolNodeRequest>(GET_SCHOOL_NODE, options);
};

export const useGetSchoolNodeWithClassRelations = (options?: QueryHookOptions<GetSchoolNodeResponse, GetSchoolNodeWithClassRelationsRequest>) => {
    return useQuery<GetSchoolNodeResponse, GetSchoolNodeWithClassRelationsRequest>(GET_SCHOOL_NODE_WITH_CLASS_RELATIONS, options);
};

interface UploadSchoolsCsvResponse {
    filename?: string;
    minetype?: string;
    encoding?: string;
}

interface UploadSchoolsCsvRequest {
    file: File;
}

export const useUploadSchoolsCsv = () => {
    return useMutation<UploadSchoolsCsvResponse, UploadSchoolsCsvRequest>(UPLOAD_SCHOOLS_CSV, {
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_SCHOOLS ],
    });
};

export interface GetPaginatedSchoolsRequest {
    direction: `FORWARD` | `BACKWARD`;
    cursor?: string;
    count?: number;
    orderBy?: string;
    order?: string;
    filter?: SchoolFilter;
}

export interface SchoolNode {
    id: string;
    name: string;
    status: Status;
    shortCode: string;
    programsConnection?: {
        edges: ProgramEdge[];
        pageInfo: PageInfo;
        total?: number;
    };
    classesConnection?: {
        pageInfo: PageInfo;
        totalCount?: number;
        edges: ClassEdge[];
    };
    academicTermsConnection?: {
        edges: AcademicTermEdge[];
    };
}

export interface SchoolEdge {
    node: SchoolNode;
}

export interface GetPaginatedSchoolsRequestResponse {
    schoolsConnection: {
        totalCount: number;
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
        edges: SchoolEdge[];
    };
}

export const useGetPaginatedSchools = (options?: QueryHookOptions<GetPaginatedSchoolsRequestResponse, GetPaginatedSchoolsRequest>) => {
    return useQuery<GetPaginatedSchoolsRequestResponse, GetPaginatedSchoolsRequest>(GET_PAGINATED_ORGANIZATION_SCHOOLS, options);
};

export const useGetPaginatedSchoolsLazy = (options?: QueryHookOptions<GetPaginatedSchoolsRequestResponse, GetPaginatedSchoolsRequest>) => {
    return useLazyQuery<GetPaginatedSchoolsRequestResponse, GetPaginatedSchoolsRequest>(GET_PAGINATED_ORGANIZATION_SCHOOLS, options);
};
