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
