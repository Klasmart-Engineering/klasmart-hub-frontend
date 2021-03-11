import { CREATE_CLASS } from "@/operations/mutations/createClass";
import { DELETE_CLASS } from "@/operations/mutations/deleteClass";
import { EDIT_CLASS_AGE_RANGES } from "@/operations/mutations/editClassAgeRanges";
import { EDIT_CLASS_GRADES } from "@/operations/mutations/editClassGrades";
import { EDIT_CLASS_PROGRAMS } from "@/operations/mutations/editClassPrograms";
import { EDIT_CLASS_SUBJECTS } from "@/operations/mutations/editClassSubjects";
import { EDIT_CLASS_SCHOOLS } from "@/operations/mutations/editSchools";
import { UPDATE_CLASS } from "@/operations/mutations/updateClass";
import { GET_ALL_CLASSES } from "@/operations/queries/getAllClasses";
import {
    Class,
    Organization,
} from "@/types/graphQL";
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

interface UpdateClassSchoolsResponse {}

export const useEditClassSchools = (options?: MutationHookOptions<UpdateClassSchoolsResponse, UpdateClassSchoolsRequest>) => {
    return useMutation<UpdateClassSchoolsResponse, UpdateClassSchoolsRequest>(EDIT_CLASS_SCHOOLS, options);
};

interface DeleteClassRequest {
    class_id: string;
}

interface DeleteClassResponse {}

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

export const useEditClassPrograms = (options?: MutationHookOptions<EditClassProgramsResponse, EditClassProgramsRequest>) => {
    return useMutation<EditClassProgramsResponse, EditClassProgramsRequest>(EDIT_CLASS_PROGRAMS, options);
};

interface EditClassSubjectsRequest {
    class_id: string;
    subject_ids: string[];
}

interface EditClassSubjectsResponse {
    class: Class;
}

export const useEditClassSubjects = (options?: MutationHookOptions<EditClassSubjectsResponse, EditClassSubjectsRequest>) => {
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

export const useEditClassAgeRanges = (options?: MutationHookOptions<EditClassAgeRangesResponse, EditClassAgeRangesRequest>) => {
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
