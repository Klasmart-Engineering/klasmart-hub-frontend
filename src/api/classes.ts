import { AgeRangeNode } from "./programs";
import { CREATE_CLASS } from "@/operations/mutations/createClass";
import { DELETE_CLASS } from "@/operations/mutations/deleteClass";
import { EDIT_CLASS_AGE_RANGES } from "@/operations/mutations/editClassAgeRanges";
import { EDIT_CLASS_GRADES } from "@/operations/mutations/editClassGrades";
import { EDIT_CLASS_PROGRAMS } from "@/operations/mutations/editClassPrograms";
import { EDIT_CLASS_SUBJECTS } from "@/operations/mutations/editClassSubjects";
import { EDIT_CLASS_SCHOOLS } from "@/operations/mutations/editSchools";
import { UPDATE_CLASS } from "@/operations/mutations/updateClass";
import { UPLOAD_CLASSES_CSV } from "@/operations/mutations/uploadClassesCsv";
import { GET_ALL_CLASSES } from "@/operations/queries/getAllClasses";
import { GET_CLASS } from "@/operations/queries/getClass";
import { GET_MY_CLASSES } from "@/operations/queries/getMyClasses";
import { GET_PAGINATED_ORGANIZATION_CLASSES } from "@/operations/queries/getPaginatedOrganizationClasses";
import { GET_USER_SCHOOL_MEMBERSHIPS } from "@/operations/queries/getUserSchoolMemberships";
import {
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
    User,
    UuidExclusiveFilter,
    UuidFilter,
} from "@/types/graphQL";
import { PaginationFilter } from "@/utils/pagination";
import {
    MutationHookOptions,
    QueryHookOptions,
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
    return useMutation<DeleteClassResponse, DeleteClassRequest>(DELETE_CLASS, options);
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

interface GetAllClassesRequest {
    organization_id: string;
}

interface GetAllClassesResponse {
    organization: Organization;
}

export const useGetAllClasses = (options?: QueryHookOptions<GetAllClassesResponse, GetAllClassesRequest>) => {
    return useQuery<GetAllClassesResponse, GetAllClassesRequest>(GET_ALL_CLASSES, options);
};

interface GetMyClassesRequest { }

interface GetMyClassesResponse {
    me: {
        user_id: string;
        full_name: string;
        classesStudying: Class[];
        classesTeaching: Class[];
    };
}

export const useGetMyClasses = (options?: QueryHookOptions<GetMyClassesResponse, GetMyClassesRequest>) => {
    return useQuery<GetMyClassesResponse, GetMyClassesRequest>(GET_MY_CLASSES, options);
};

interface GetUserSchoolMembershipsRequest {
    user_id: string;
    organization_id: string;
}

interface GetUserSchoolMembershipsResponse {
    user: User;
}

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

export interface ClassNode {
    id: string;
    name: string;
    status: Status;
    ageRanges: AgeRangeNode[];
    subjects: Subject[];
    grades: Grade[];
    schools: ClassSchoolNode[];
    programs: ClassProgramNode[];
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

export const useGetUserSchoolMemberships = (options?: QueryHookOptions<GetUserSchoolMembershipsResponse, GetUserSchoolMembershipsRequest>) => {
    return useQuery<GetUserSchoolMembershipsResponse, GetUserSchoolMembershipsRequest>(GET_USER_SCHOOL_MEMBERSHIPS, options);
};

interface UploadClassesCsvResponse {
    filename?: string;
    minetype?: string;
    encoding?: string;
}

interface UploadClassesCsvRequest {
    file: File;
}

interface GetClassRequest {
    id: string;
    organizationId: string;
}

interface GetClassResponse {
    class: Class;
}

export const useGetClass = (options?: QueryHookOptions<GetClassResponse, GetClassRequest>) => {
    return useQuery<GetClassResponse, GetClassRequest>(GET_CLASS, options);
};

export const useUploadClassesCsv = () => {
    return useMutation<UploadClassesCsvResponse, UploadClassesCsvRequest>(UPLOAD_CLASSES_CSV);
};

export const useGetAllPaginatedClasses = (options?: QueryHookOptions<GetAllClassesPaginatedResponse, GetAllClassesPaginatedRequest>) => {
    return useQuery<GetAllClassesPaginatedResponse, GetAllClassesPaginatedRequest>(GET_PAGINATED_ORGANIZATION_CLASSES, options);
};
