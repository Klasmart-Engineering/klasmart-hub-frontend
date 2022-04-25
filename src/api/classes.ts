import { GetPaginatedOrganizationAgeRangesResponse } from "./ageRanges";
import { GetOrganizationGradesResponsePaginated } from "./grades";
import {
    GetOrganizationMembershipsResponse2,
    UserEdge,
    UserFilter,
} from "./organizationMemberships";
import {
    AgeRangeNode,
    GetAllProgramsPaginatedResponse,
} from "./programs";
import { GetPaginatedSchoolsRequestResponse } from "./schools";
import { GetAllSubjectsPaginatedResponse } from "./subjects";
import { CREATE_CLASS } from "@/operations/mutations/createClass";
import { DELETE_CLASS } from "@/operations/mutations/deleteClass";
import { EDIT_CLASS_AGE_RANGES } from "@/operations/mutations/editClassAgeRanges";
import { EDIT_CLASS_GRADES } from "@/operations/mutations/editClassGrades";
import { EDIT_CLASS_PROGRAMS } from "@/operations/mutations/editClassPrograms";
import { EDIT_CLASS_SUBJECTS } from "@/operations/mutations/editClassSubjects";
import { EDIT_CLASS_SCHOOLS } from "@/operations/mutations/editSchools";
import { UPDATE_CLASS } from "@/operations/mutations/updateClass";
import { UPLOAD_CLASSES_CSV } from "@/operations/mutations/uploadClassesCsv";
import {
    GET_CLASS_NODE,
    GET_CLASS_NODE_AGE_RANGES_CONNECTION,
    GET_CLASS_NODE_CONNECTIONS,
    GET_CLASS_NODE_GRADES_CONNECTION,
    GET_CLASS_NODE_PROGRAMS_CONNECTION,
    GET_CLASS_NODE_SCHOOLS_CONNECTION,
    GET_CLASS_NODE_SUBJECTS_CONNECTION,
} from "@/operations/queries/getClassNode";
import { GET_CLASS_NODE_SUMMARY } from "@/operations/queries/getClassNodeSummary";
import {
    GET_PAGINATED_ELIGIBLE_STUDENTS,
    GET_PAGINATED_ELIGIBLE_TEACHERS,
} from "@/operations/queries/getEligibleUsers";
import { GET_PAGINATED_ORGANIZATION_CLASSES } from "@/operations/queries/getPaginatedOrganizationClasses";
import {
    BaseEntity,
    BooleanFilter,
    Class,
    Grade,
    NumberFilter,
    Organization,
    PageInfo,
    PaginationDirection,
    Status,
    StatusFilter,
    StringFilter,
    Subject,
    UuidExclusiveFilter,
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

interface UpdateClassRequest {
    class_id: string;
    class_name: string;
}

interface UpdateClassResponse {
    class: Class;
}
export interface ClassSummaryNode extends BaseEntity {
    name: string;
    status: Status;
}

export const useUpdateClass = (options?: MutationHookOptions<UpdateClassResponse, UpdateClassRequest>) => {
    return useMutation<UpdateClassResponse, UpdateClassRequest>(UPDATE_CLASS, options);
};

interface UpdateClassSchoolsRequest {
    class_id: string;
    school_ids: string[];
}

interface UpdateClassSchoolsResponse { }

export const useEditClassSchools = (options?: MutationHookOptions<
    UpdateClassSchoolsResponse,
    UpdateClassSchoolsRequest
>) => {
    return useMutation<UpdateClassSchoolsResponse, UpdateClassSchoolsRequest>(EDIT_CLASS_SCHOOLS, options);
};

interface DeleteClassRequest {
    class_id: string;
}

interface DeleteClassResponse { }

export const useDeleteClass = (options?: MutationHookOptions<DeleteClassResponse, DeleteClassRequest>) => {
    return useMutation<DeleteClassResponse, DeleteClassRequest>(DELETE_CLASS, {
        ...options,
        refetchQueries: [ GET_PAGINATED_ORGANIZATION_CLASSES ],
    });
};

interface CreateClassRequest {
    organization_id: string;
    class_name: string;
    school_ids: string[];
}

interface CreateClassResponse {
    organization: Organization;
}

export const useCreateClass = (options?: MutationHookOptions<CreateClassResponse, CreateClassRequest>) => {
    return useMutation<CreateClassResponse, CreateClassRequest>(CREATE_CLASS, options);
};

interface EditClassProgramsRequest {
    class_id: string;
    program_ids: string[];
}

interface EditClassProgramsResponse {
    class: Class;
}

export const useEditClassPrograms = (options?: MutationHookOptions<
    EditClassProgramsResponse,
    EditClassProgramsRequest
>) => {
    return useMutation<EditClassProgramsResponse, EditClassProgramsRequest>(EDIT_CLASS_PROGRAMS, options);
};

interface EditClassSubjectsRequest {
    class_id: string;
    subject_ids: string[];
}

interface EditClassSubjectsResponse {
    class: Class;
}

export const useEditClassSubjects = (options?: MutationHookOptions<
    EditClassSubjectsResponse,
    EditClassSubjectsRequest
>) => {
    return useMutation<EditClassSubjectsResponse, EditClassSubjectsRequest>(EDIT_CLASS_SUBJECTS, options);
};

interface EditClassGradesRequest {
    class_id: string;
    grade_ids: string[];
}

interface EditClassGradesResponse {
    class: Class;
}

export const useEditClassGrades = (options?: MutationHookOptions<EditClassGradesResponse, EditClassGradesRequest>) => {
    return useMutation<EditClassGradesResponse, EditClassGradesRequest>(EDIT_CLASS_GRADES, options);
};

interface EditClassAgeRangesRequest {
    class_id: string;
    age_range_ids: string[];
}

interface EditClassAgeRangesResponse {
    class: Class;
}

export const useEditClassAgeRanges = (options?: MutationHookOptions<
    EditClassAgeRangesResponse,
    EditClassAgeRangesRequest
>) => {
    return useMutation<EditClassAgeRangesResponse, EditClassAgeRangesRequest>(EDIT_CLASS_AGE_RANGES, options);
};

interface ClassSchoolNode {
    id: string;
    name: string;
}

interface ClassProgramNode {
    id: string;
    name: string;
    status?: Status;
    system?: boolean;
    ageRanges?: AgeRangeNode[];
    subjects?: Subject[];
    grades?: Grade[];
}

export interface AcademicTermNode {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    school: { id: string };
}

interface SummaryNode {
    totalCount: number;
    pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
    };
    edges: {
        node: {
            id: string;
        };
    }[];
}

export interface ClassNode {
    id: string;
    name: string;
    status: Status;
    ageRanges?: AgeRangeNode[];
    subjects?: Subject[];
    grades?: Grade[];
    schools?: ClassSchoolNode[];
    programs?: ClassProgramNode[];
    academicTerm?: AcademicTermNode;
    schoolsConnection?: GetPaginatedSchoolsRequestResponse[`schoolsConnection`];
    studentsConnection?: GetOrganizationMembershipsResponse2[`usersConnection`];
    teachersConnection?: GetOrganizationMembershipsResponse2[`usersConnection`];
    subjectsConnection?: GetAllSubjectsPaginatedResponse[`subjectsConnection`];
    programsConnection?: GetAllProgramsPaginatedResponse[`programsConnection`];
    gradesConnection?: GetOrganizationGradesResponsePaginated[`gradesConnection`];
    ageRangesConnection?: GetPaginatedOrganizationAgeRangesResponse[`ageRangesConnection`];
}

export interface ClassNodeConnections {
    id: string;
    name: string;
    status: Status;
    ageRanges?: AgeRangeNode[];
    subjects?: Subject[];
    grades?: Grade[];
    schools?: ClassSchoolNode[];
    programs?: ClassProgramNode[];
    academicTerm?: AcademicTermNode[];
    schoolsConnection?: SummaryNode;
    studentsConnection?: SummaryNode;
    teachersConnection?: SummaryNode;
    subjectsConnection?: SummaryNode;
    programsConnection?: SummaryNode;
    gradesConnection?: SummaryNode;
    ageRangesConnection?: SummaryNode;
}

export interface ClassEdge {
    node: ClassNode;
}

export interface ClassesFilter extends PaginationFilter<ClassesFilter> {
    name?: StringFilter;
    id?: UuidFilter;
    status?: StatusFilter;
    organizationId?: UuidFilter;
    system?: BooleanFilter;
    schoolId?: UuidExclusiveFilter;
    ageRangeUnitFrom?: UuidFilter;
    ageRangeValueFrom?: NumberFilter;
    ageRangeUnitTo?: UuidFilter;
    ageRangeValueTo?: NumberFilter;
    programId?: UuidFilter;
    subjectId?: UuidFilter;
    gradeId?: UuidFilter;
    academicTermId?: UuidFilter;
}

interface GetAllClassesPaginatedRequest {
    direction: PaginationDirection;
    cursor?: string | null;
    count?: number;
    search?: string;
    orderBy?: string;
    order?: string;
    filter?: ClassesFilter;
}

export interface GetAllClassesPaginatedResponse {
    classesConnection: {
        totalCount: number;
        pageInfo: PageInfo;
        edges: ClassEdge[];
    };
}

interface UploadClassesCsvResponse {
    filename?: string;
    minetype?: string;
    encoding?: string;
}

interface UploadClassesCsvRequest {
    file: File;
}

export interface GetClassNodeRequest {
    id: string;
    count?: number;
    rosterCount?: number;
    programsCount?: number;
    subjectsCount?: number;
    orderBy?: string;
    order?: string;
    direction?: string;
    showStudents?: boolean;
    showTeachers?: boolean;
    cursor?: string;
    filter?: UserFilter;
}

export interface GetEligibleClassUsersRequest {
    classId: string;
    direction?: string;
    count?: number;
    cursor?: string;
    order?: string;
    orderBy?: string;
    filter?: UserFilter;
}

export interface GetEligibleClassStudentsResponse {
    eligibleStudentsConnection: {
        totalCount: number;
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
        edges: UserEdge[];
    };
}

export interface GetEligibleClassTeachersResponse {
    eligibleTeachersConnection: {
        totalCount: number;
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
        edges: UserEdge[];
    };
}

export interface GetClassNodeResponse {
    classNode: ClassNode;
}

export interface GetClassNodeConnectionsResponse {
    classNode: ClassNodeConnections;
}

export const useGetClassNode = (options?: QueryHookOptions<GetClassNodeResponse, GetClassNodeRequest>) => {
    return useQuery<GetClassNodeResponse, GetClassNodeRequest>(GET_CLASS_NODE, options);
};

export const useGetClassNodeConnections = (options?: QueryHookOptions<GetClassNodeConnectionsResponse, GetClassNodeRequest>) => {
    return useQuery<GetClassNodeConnectionsResponse, GetClassNodeRequest>(GET_CLASS_NODE_CONNECTIONS, options);
};

export const useGetClassNodeSummary = (options?: QueryHookOptions<GetClassNodeResponse, GetClassNodeRequest>) => {
    return useQuery<GetClassNodeResponse, GetClassNodeRequest>(GET_CLASS_NODE_SUMMARY, options);
};

export const useUploadClassesCsv = () => {
    return useMutation<UploadClassesCsvResponse, UploadClassesCsvRequest>(UPLOAD_CLASSES_CSV);
};

export const useGetAllPaginatedClasses = (options?: QueryHookOptions<GetAllClassesPaginatedResponse, GetAllClassesPaginatedRequest>) => {
    return useQuery<GetAllClassesPaginatedResponse, GetAllClassesPaginatedRequest>(GET_PAGINATED_ORGANIZATION_CLASSES, options);
};

export const useGetClassNodeSchoolsLazy = (options?: QueryHookOptions<GetClassNodeResponse, GetClassNodeRequest>) => {
    return useLazyQuery<GetClassNodeResponse, GetClassNodeRequest>(GET_CLASS_NODE_SCHOOLS_CONNECTION, options);
};

export const useGetClassNodeProgramsLazy = (options?: QueryHookOptions<GetClassNodeResponse, GetClassNodeRequest>) => {
    return useLazyQuery<GetClassNodeResponse, GetClassNodeRequest>(GET_CLASS_NODE_PROGRAMS_CONNECTION, options);
};

export const useGetClassNodeGradesLazy = (options?: QueryHookOptions<GetClassNodeResponse, GetClassNodeRequest>) => {
    return useLazyQuery<GetClassNodeResponse, GetClassNodeRequest>(GET_CLASS_NODE_GRADES_CONNECTION, options);
};

export const useGetClassNodeAgeRangesLazy = (options?: QueryHookOptions<GetClassNodeResponse, GetClassNodeRequest>) => {
    return useLazyQuery<GetClassNodeResponse, GetClassNodeRequest>(GET_CLASS_NODE_AGE_RANGES_CONNECTION, options);
};

export const useGetClassNodeSubjectsLazy = (options?: QueryHookOptions<GetClassNodeResponse, GetClassNodeRequest>) => {
    return useLazyQuery<GetClassNodeResponse, GetClassNodeRequest>(GET_CLASS_NODE_SUBJECTS_CONNECTION, options);
};

export const useGetPaginatedElgibleStudents = (options?: QueryHookOptions<GetEligibleClassStudentsResponse, GetEligibleClassUsersRequest>) => {
    return useQuery<GetEligibleClassStudentsResponse, GetEligibleClassUsersRequest>(GET_PAGINATED_ELIGIBLE_STUDENTS, options);
};

export const useGetPaginatedElgibleTeachers = (options?: QueryHookOptions<GetEligibleClassTeachersResponse, GetEligibleClassUsersRequest>) => {
    return useQuery<GetEligibleClassTeachersResponse, GetEligibleClassUsersRequest>(GET_PAGINATED_ELIGIBLE_TEACHERS, options);
};
