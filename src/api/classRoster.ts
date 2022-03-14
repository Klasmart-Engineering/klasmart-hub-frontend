import {
    GetClassNodeRequest,
    GetClassNodeResponse,
} from "./classes";
import { ADD_STUDENTS_TO_CLASS } from "@/operations/mutations/addStudentsToClass";
import { ADD_TEACHERS_TO_CLASS } from "@/operations/mutations/addTeachersToClass";
import { ADD_USERS_TO_CLASS } from "@/operations/mutations/addUsersToClass";
import { REMOVE_CLASS_STUDENT } from "@/operations/mutations/deleteClassStudent";
import { REMOVE_CLASS_TEACHER } from "@/operations/mutations/deleteClassTeacher";
import { GET_CLASS_NODE_ROSTER } from "@/operations/queries/getClassNodeRoster";
import {
    OrganizationMembership,
    SchoolMembership,
} from "@/types/graphQL";
import {
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

export interface ClassUser {
    avatar: string | null;
    date_of_birth: string | null;
    email: string;
    family_name: string;
    given_name: string;
    phone: string | null;
    user_id: string;
    role?: string;
    school_memberships?: SchoolMembership[];
    membership: OrganizationMembership;
    organizationRoles: string[];
    contactInfo: string;
}

export interface ClassUserRow {
    dateOfBirth: string | null;
    familyName: string;
    givenName: string;
    id: string;
    role?: string;
    organizationRoles: string[];
    contactInfo: string;
}

interface AddUsersToClassRequest {
    classId: string;
    studentIds: string[];
    teacherIds: string[];
}

interface RemoveClassUserRequest {
    class_id: string;
    user_id: string;
}

interface EmptyResponse {}

interface AddStudentsToClassRequest {
    classId: string;
    studentIds: string[];
}

interface AddTeachersToClassRequest {
    classId: string;
    teacherIds: string[];
}

export const useGetClassNodeRoster = (options?: QueryHookOptions<GetClassNodeResponse, GetClassNodeRequest>) => {
    return useQuery<GetClassNodeResponse, GetClassNodeRequest>(GET_CLASS_NODE_ROSTER, options);
};

export const useRemoveClassStudent = () => {
    return useMutation<EmptyResponse, RemoveClassUserRequest>(REMOVE_CLASS_STUDENT);
};

export const useRemoveClassTeacher = () => {
    return useMutation<EmptyResponse, RemoveClassUserRequest>(REMOVE_CLASS_TEACHER);
};

export const useAddUsersToClass = () => {
    return useMutation<EmptyResponse, AddUsersToClassRequest>(ADD_USERS_TO_CLASS);
};

export const useAddStudentsToClass = () => {
    return useMutation<EmptyResponse, AddStudentsToClassRequest>(ADD_STUDENTS_TO_CLASS);
};

export const useAddTeachersToClass = () => {
    return useMutation<EmptyResponse, AddTeachersToClassRequest>(ADD_TEACHERS_TO_CLASS);
};
