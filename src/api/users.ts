import { GET_ORGANIZATION_USERS } from "@/operations/queries/getOrganizationUsers";
import { FetchResult, MutationResult, useMutation, useQuery } from "@apollo/client";
import { EDIT_MEMBERSHIP_OF_ORGANIZATION } from "../operations/mutations/editMembershipOfOrganization";
import { Organization, User } from "../types/graphQL";

// interface UpdateUserRequest {
//     organization_id: string
//     email: string
//     phone: string
//     given_name: string
//     family_name: string
//     organization_role_ids: string[]
//     school_ids: string[]
// }

// interface UpdateUserResponse {
// }

// export const useEditMembership = (): [ (user: User, allSchools: School[]) => Promise<FetchResult<UpdateUserResponse, Record<string, any>, Record<string, any>>>, MutationResult<UpdateUserResponse> ] => {
//     const [ promise, mutationResult ] = useMutation<UpdateUserResponse, UpdateUserRequest>(EDIT_MEMBERSHIP_OF_ORGANIZATION);
//     return [
//         async (user: User, allSchools: School[]) => {
//             const {
//                 organization_id,
//                 email,
//                 phone,
//                 given_name,
//                 family_name,
//                 organization_role_ids,
//                 school_ids: schoolsSelectedHandler(school_ids),
//             } = userItem;
//             const schoolIds = schools?.map((s) => s.school_id) ?? [];
//             return promise({
//                 variables: {
//                     user_id,
//                     user_name: user_name ?? "",
//                     school_ids: handleSchoolIds(schoolIds, allSchools),
//                 }
//             });
//         },
//         mutationResult,
//     ];
// };

// interface DeleteUserRequest {
//     user_id: string
// }

// interface DeleteUserResponse {
// }

// export const useDeleteUser = (): [ (userId: string) => Promise<FetchResult<DeleteUserResponse, Record<string, any>, Record<string, any>>>, MutationResult<DeleteUserResponse> ] => {
//     const [ promise, mutationResult ] = useMutation<DeleteUserResponse, DeleteUserRequest>(DELETE_USER);
//     return [
//         (userId: string) => promise({
//             variables: {
//                 user_id: userId,
//             }
//         }),
//         mutationResult,
//     ];
// };

// interface CreateUserRequest {
//     organization_id: string
//     user_name: string
//     school_ids: string[]
// }

// interface CreateUserResponse {
// }

// export const useCreateUser = (): [ (userItem: User, organizationId: string, allSchools: School[]) => Promise<FetchResult<DeleteUserResponse, Record<string, any>, Record<string, any>>>, MutationResult<DeleteUserResponse> ] => {
//     const [ promise, mutationResult ] = useMutation<CreateUserResponse, CreateUserRequest>(CREATE_USER);
//     return [
//         (userItem: User, organizationId: string, allSchools: School[]) => {
//             const {
//                 user_name,
//                 schools
//             } = userItem;
//             const schoolIds = schools?.map((s) => s.school_id) ?? [];
//             return promise({
//                 variables: {
//                     organization_id: organizationId,
//                     user_name: user_name ?? "",
//                     school_ids: handleSchoolIds(schoolIds, allSchools),
//                 },
//             });
//         },
//         mutationResult,
//     ];
// };

interface GetAllUseresRequest {
    organization_id: string
}

interface GetAllUseresResponse {
    organization: Organization
}

export const useGetOrganizationUsers = (organizationId: string) => {
    return useQuery<GetAllUseresResponse, GetAllUseresRequest>(GET_ORGANIZATION_USERS, {
        fetchPolicy: "network-only",
        variables: {
            organization_id: organizationId
        },
    });
};