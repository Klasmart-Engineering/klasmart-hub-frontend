import { UserNode } from "@/api/organizationMemberships";
import { Status } from "@/types/graphQL";

export const mockOrgId = `c19de3cc-aa01-47f5-9f87-850eb70ae073`;
export const user1Id = `p19de3cc-aa01-47f5-9f87-850eb70ae071`;
export const user2Id = `p19de3cc-aa01-47f5-9f87-850eb70ae072`;
export const user3Id = `p19de3cc-aa01-47f5-9f87-850eb70ae073`;

export const users: UserNode[] = [
    {
        id: user1Id,
        avatar: null,
        contactInfo: {
            email: `johnsmith@calmid.com`,
            phone: `01012345678`,
        },
        givenName: `John`,
        familyName: `Smith`,
        organizations: [
            {
                userStatus: Status.ACTIVE,
                joinDate: `2021-06-15T09:46:54.573Z`,
                userShortCode: `FEBJFBSJFBJE`,
            },
        ],
        roles: [
            {
                id: `87aca549-fdb6-4a63-97d4-d563d4a4690a`,
                organizationId: mockOrgId,
                schoolId: `87aca549-fdb6-4a63-97d4-d563d4a4665f`,
                name: `Organization Admin`,
                status: Status.ACTIVE,
            },
        ],
        schools: [
            {
                id: `87aca549-fdb6-4a63-97d4-d563d4a4665f`,
                name: `Mock Data School`,
                status: Status.ACTIVE,
            },
        ],
        dateOfBirth: `210910`,
        gender: `male`,
    },
    {
        id: user2Id,
        avatar: null,
        contactInfo: {
            email: `andrewheath@calmid.com`,
            phone: `01087654321`,
        },
        givenName: `Andrew`,
        familyName: `Heath`,
        organizations: [
            {
                userStatus: Status.INACTIVE,
                joinDate: `2021-06-15T09:46:54.573Z`,
                userShortCode: `BFJEABFNEA`,
            },
        ],
        roles: [
            {
                id: `87aca549-fdb6-4a63-97d4-d563d4a4690b`,
                organizationId: mockOrgId,
                schoolId: `87aca549-fdb6-4a63-97d4-d563d4a4687g`,
                name: `School Admin`,
                status: Status.ACTIVE,
            },
        ],
        schools: [
            {
                id: `87aca549-fdb6-4a63-97d4-d563d4a4687g`,
                name: `Mock Data Academy`,
                status: Status.ACTIVE,
            },
        ],
        dateOfBirth: `210910`,
        gender: `male`,
    },
];

export const mockPaginatedUsers = {
    usersConnection: {
        edges: [
            {
                node: {
                    ...users[0],
                },
            },
            {
                node: {
                    ...users[1],
                },
            },
        ],
        pageInfo: {
            endCursor: user3Id,
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: ``,
        },
        totalCount: 1,
    },
};

export const mockOrganizationMemberships = {
    organization: {
        organization_name: `Mock Data Org`,
        schools: [
            {
                school_id: `b24efb81-6ed8-42a3-9713-d252457177b6`,
                school_name: `test`,
                status: `active`,
                memberships: [
                    {
                        school_id: `b24efb81-6ed8-42a3-9713-d252457177b6`,
                        join_timestamp: `2021-08-19T02:39:26.551Z`,
                        status: `active`,
                        user: {
                            user_id: `5c147f45-efe4-4298-b115-e83da3113bd2`,
                            user_name: `School Filter Test`,
                            email: `mock.data@calmid.com`,
                            phone: null,
                            avatar: null,
                        },
                        roles: [],
                    },
                ],
            },
            {
                school_id: `4f0e5217-e0e7-4cf9-9d23-7c919f11cbe5`,
                school_name: `test 2`,
                status: `active`,
                memberships: [],
            },
        ],
        memberships: [
            {
                organization_id: `47473264-0bf9-4c8b-b984-cbc2656d0064`,
                user_id: `b69af9a8-b832-4bf8-8a29-e67f0de05a18`,
                join_timestamp: `2021-06-15T09:46:54.573Z`,
                status: `active`,
                shortcode: `16WDHS2ZCJTRUVJ0`,
                schoolMemberships: [
                    {
                        school: {
                            school_id: `1112fc54-af22-4928-9e94-7dd2324b82f8`,
                            school_name: `alpha`,
                            status: `active`,
                        },
                        roles: [],
                        school_id: `1112fc54-af22-4928-9e94-7dd2324b82f8`,
                    },
                ],
                user: {
                    user_id: `b69af9a8-b832-4bf8-8a29-e67f0de05a18`,
                    given_name: `Mock`,
                    family_name: `Data`,
                    email: `mock.data@calmid.com`,
                    phone: null,
                    avatar: null,
                    full_name: `Mock Data`,
                    gender: `male`,
                    alternate_email: null,
                    date_of_birth: `04-1995`,
                    alternate_phone: null,
                },
                roles: [
                    {
                        role_id: `87aca549-fdb6-4a63-97d4-d563d4a4690a`,
                        role_name: `Organization Admin`,
                        status: `active`,
                    },
                ],
            },
        ],
        roles: [
            {
                role_id: `87aca549-fdb6-4a63-97d4-d563d4a4690a`,
                role_name: `Organization Admin`,
                status: `active`,
            },
            {
                role_id: `7e958466-08ba-46a9-8370-d824897e690e`,
                role_name: `School Admin`,
                status: `active`,
            },
            {
                role_id: `a3d09e3b-ef49-46e4-a19a-02a3480f5f8b`,
                role_name: `Parent`,
                status: `active`,
            },
            {
                role_id: `913995b6-d4a9-4797-a1f0-1b4035da2a4b`,
                role_name: `Student`,
                status: `active`,
            },
            {
                role_id: `2fb3a0bc-8761-4e86-b9d8-954f06314851`,
                role_name: `Teacher`,
                status: `active`,
            },
            {
                role_id: `b85e94f0-8b93-42cf-a89e-b1e78b120c3e`,
                role_name: `Reassigned Role`,
                status: `active`,
            },
            {
                role_id: `ca74e7e8-99db-41b3-ae60-a5b3f932827b`,
                role_name: `Delete Role`,
                status: `inactive`,
            },
        ],
    },
};

export const mockRolesFilterList = {
    organization: {
        roles: [
            {
                role_description: `System Default Role`,
                role_id: `87aca549-fdb6-4a63-97d4-d563d4a4690a`,
                role_name: `Test Organization Admin`,
                status: `active`,
                system_role: true,
            },
            {
                role_description: `System Default Role`,
                role_id: `87aca549-fdb6-4a63-97d4-d563d4a4690b`,
                role_name: `Test School Admin`,
                status: `active`,
                system_role: true,
            },
            {
                role_description: `System Default Role`,
                role_id: `87aca549-fdb6-4a63-97d4-d563d4a4690c`,
                role_name: `Test Parent`,
                status: `active`,
                system_role: true,
            },
            {
                role_description: `System Default Role`,
                role_id: `87aca549-fdb6-4a63-97d4-d563d4a4690d`,
                role_name: `Test Student`,
                status: `active`,
                system_role: true,
            },
            {
                role_description: `System Default Role`,
                role_id: `87aca549-fdb6-4a63-97d4-d563d4a4690d`,
                role_name: `Test Teacher`,
                status: `active`,
                system_role: true,
            },
        ],
        pageInfo: {
            endCursor: `eyJpZCI6ImZiZTc1OGY2LWI3ODUtNDlkZS1iNTVlLWI5ZDQxNzM0ZTIyYyIsIm5hbWUiOiJUZXN0IFByb2dyYW0ifQ==`,
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: `eyJpZCI6ImZiZTc1OGY2LWI3ODUtNDlkZS1iNTVlLWI5ZDQxNzM0ZTIyYyIsIm5hbWUiOiJUZXN0IFByb2dyYW0ifQ==`,
        },
        totalCount: 4,
    },
};
