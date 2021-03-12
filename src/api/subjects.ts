import { CREATE_OR_UPDATE_SUBJECTS } from "@/operations/mutations/createOrUpdateSubjects";
import { DELETE_SUBJECT } from "@/operations/mutations/deleteSubject";
import { GET_ALL_SUBJECTS } from "@/operations/queries/getAllSubjects";
import { GET_SUBJECT } from "@/operations/queries/getSubject";
import {
    Organization,
    Subject,
} from "@/types/graphQL";
import {
    MutationHookOptions,
    QueryHookOptions,
    useMutation,
    useQuery,
} from "@apollo/client";

interface CreateOrUpdateSubjectsRequest {
    organization_id: string;
    subjects: ({
        id?: string | null;
        name: string;
        categories: string[];
    })[];
}

interface CreateOrUpdateSubjectsResponse {
    organization: {
        createOrUpdateSubjects: Subject[];
    };
}

export const useCreateOrUpdateSubjects = (options?: MutationHookOptions<CreateOrUpdateSubjectsResponse, CreateOrUpdateSubjectsRequest>) => {
    return useMutation<CreateOrUpdateSubjectsResponse, CreateOrUpdateSubjectsRequest>(CREATE_OR_UPDATE_SUBJECTS, options);
};

interface DeleteSubjectRequest {
    id: string;
}

interface DeleteSubjectResponse {
}

export const useDeleteSubject = (options?: MutationHookOptions<DeleteSubjectResponse, DeleteSubjectRequest>) => {
    return useMutation<DeleteSubjectResponse, DeleteSubjectRequest>(DELETE_SUBJECT, options);
};

interface GetSubjectRequest {
    id: string;
}

interface GetSubjectResponse {
    organization: Organization;
}

export const useGetSubject = (options?: QueryHookOptions<GetSubjectResponse, GetSubjectRequest>) => {
    return useQuery<GetSubjectResponse, GetSubjectRequest>(GET_SUBJECT, options);
};

interface GetAllSubjectsRequest {
    organization_id: string;
}

interface GetAllSubjectsResponse {
    organization: Organization;
}

export const useGetAllSubjects = (options?: QueryHookOptions<GetAllSubjectsResponse, GetAllSubjectsRequest>) => {
    return useQuery<GetAllSubjectsResponse, GetAllSubjectsRequest>(GET_ALL_SUBJECTS, options);
};
