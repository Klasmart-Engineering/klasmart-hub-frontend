import { UserNode } from "@/api/organizationMemberships";
import { Status } from "@/types/graphQL";

export const mockOrgId = `b19de3cc-aa01-47f5-9f87-850eb70ae073`;
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
                id: `11111111`,
                name: `Organization Admin`,
                status: Status.ACTIVE,
            },
        ],
        schools: [
            {
                id: `22222222`,
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
                id: `11111111`,
                name: `Organization Admin`,
                status: Status.ACTIVE,
            },
        ],
        schools: [
            {
                id: `22222222`,
                name: `Mock Data School`,
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
