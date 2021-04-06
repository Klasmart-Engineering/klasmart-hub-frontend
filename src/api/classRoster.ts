import { ADD_USERS_TO_CLASS } from "@/operations/mutations/addUsersToClass";
import { DELETE_CLASS_STUDENT } from "@/operations/mutations/deleteClassStudent";
import { DELETE_CLASS_TEACHER } from "@/operations/mutations/deleteClassTeacher";
import { GET_CLASS_ROSTER } from "@/operations/queries/getClassRoster";
import { GET_ELIGIBLE_USERS } from "@/operations/queries/getEligibleClassUsers";
import {
    OrganizationMembership,
    SchoolMembership,
    Subject,
} from "@/types/graphQL";
import {
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface GetClassRosterRequest {
    class_id: string;
    organization_id: string;
}

export interface ClassUser {
    avatar: string | null;
    date_of_birth: string | null;
    email: string;
    family_name: string;
    full_name: string;
    given_name: string;
    phone: string | null;
    user_id: string;
    name: string | null;
    role?: string;
    school_memberships?: SchoolMembership[];
    membership: OrganizationMembership;
    subjectsTeaching: Subject[];
    alternate_phone: string;
}

interface GetClassRosterRespone {
    class: {
        students: ClassUser[];
        teachers: ClassUser[];
    };
}

interface GetClassRosterEligibleUsersRespone {
    class: {
        eligibleStudents: ClassUser[];
        eligibleTeachers: ClassUser[];
    };
}

interface GetClassRosterEligibleUsersRequest {
    class_id: string;
    organization_id: string;
}

interface AddUsersToClassRequest {
    class_id: string;
    student_ids: string[];
    teacher_ids: string[];
}

interface DeleteClassUserRequest {
    class_id: string;
    user_id: string;
}

interface EmptyResponse {}

export const useGetClassRoster = (options?: QueryHookOptions<GetClassRosterRespone, GetClassRosterRequest>) => {
    return useQuery<GetClassRosterRespone, GetClassRosterRequest>(GET_CLASS_ROSTER, options);
};

export const useGetClassRosterEligibleUsers = (options?: QueryHookOptions<GetClassRosterEligibleUsersRespone, GetClassRosterEligibleUsersRequest>) => {
    return useQuery<GetClassRosterEligibleUsersRespone, GetClassRosterEligibleUsersRequest>(GET_ELIGIBLE_USERS, options);
};

export const useDeleteClassStudent = () => {
    return useMutation<EmptyResponse, DeleteClassUserRequest>(DELETE_CLASS_STUDENT);
};

export const useDeleteClassTeacher = () => {
    return useMutation<EmptyResponse, DeleteClassUserRequest>(DELETE_CLASS_TEACHER);
};

export const useAddUsersToClass = () => {
    return useMutation<EmptyResponse, AddUsersToClassRequest>(ADD_USERS_TO_CLASS);
};
