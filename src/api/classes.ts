import { FetchResult, MutationResult, useMutation, useQuery } from "@apollo/client";
import { Class, School, User } from "@/types/graphQL";
import { UPDATE_CLASS } from "@/operations/mutations/updateClass";
import { DELETE_CLASS } from "@/operations/mutations/deleteClass";
import { CREATE_CLASS } from "@/operations/mutations/createClass";
import { GET_ALL_CLASSES } from "@/operations/queries/getAllClasses";

const handleSchoolIds = (ids: Array<string>, allSchools: School[]) => {
    if (ids.length && ids[0] === "Open/All") {
        return allSchools.map((s) => s.school_id);
    }
    return ids ?? [];
};

interface UpdateClassRequest {
    class_id: string
    class_name: string
    school_ids: string[]
}

interface UpdateClassResponse {
}

export const useUpdateClass = (): [ (classItem: Class, allSchools: School[]) => Promise<FetchResult<UpdateClassResponse, Record<string, any>, Record<string, any>>>, MutationResult<UpdateClassResponse> ] => {
    const [ promise, mutationResult ] = useMutation<UpdateClassResponse, UpdateClassRequest>(UPDATE_CLASS);
    return [
        async (classItem: Class, allSchools: School[]) => {
            const {
                class_id,
                class_name,
                schools,
            } = classItem;
            const schoolIds = schools?.map((s) => s.school_id) ?? [];
            return promise({
                variables: {
                    class_id,
                    class_name: class_name ?? "",
                    school_ids: handleSchoolIds(schoolIds, allSchools),
                }
            });
        },
        mutationResult,
    ];
};

interface DeleteClassRequest {
    class_id: string
}

interface DeleteClassResponse {
}

export const useDeleteClass = (): [ (classId: string) => Promise<FetchResult<DeleteClassResponse, Record<string, any>, Record<string, any>>>, MutationResult<DeleteClassResponse> ] => {
    const [ promise, mutationResult ] = useMutation<DeleteClassResponse, DeleteClassRequest>(DELETE_CLASS);
    return [
        (classId: string) => promise({
            variables: {
                class_id: classId,
            }
        }),
        mutationResult,
    ];
};

interface CreateClassRequest {
    organization_id: string
    class_name: string
    school_ids: string[]
}

interface CreateClassResponse {
}

export const useCreateClass = (): [ (classItem: Class, organizationId: string, allSchools: School[]) => Promise<FetchResult<DeleteClassResponse, Record<string, any>, Record<string, any>>>, MutationResult<DeleteClassResponse> ] => {
    const [ promise, mutationResult ] = useMutation<CreateClassResponse, CreateClassRequest>(CREATE_CLASS);
    return [
        (classItem: Class, organizationId: string, allSchools: School[]) => {
            const {
                class_name,
                schools
            } = classItem;
            const schoolIds = schools?.map((s) => s.school_id) ?? [];
            return promise({
                variables: {
                    organization_id: organizationId,
                    class_name: class_name ?? "",
                    school_ids: handleSchoolIds(schoolIds, allSchools),
                },
            });
        },
        mutationResult,
    ];
};

interface GetAllClassesRequest {
    organization_id: string
}

interface GetAllClassesResponse {
    me: User
}

export const useGetAllClasses = (organizationId: string) => {
    return useQuery<GetAllClassesResponse, GetAllClassesRequest>(GET_ALL_CLASSES, {
        fetchPolicy: "network-only",
        variables: {
            organization_id: organizationId,
        },
    });
};