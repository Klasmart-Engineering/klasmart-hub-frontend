import JoinedOrganizationTable from '@/components/Organization/JoinedOrganizationTable';
import { DELETE_USER_IN_ORGANIZATION } from '@/operations/mutations/deleteUser';
import { MY_USER_QUERY } from '@/operations/queries/myUser';
import { MockedResponse } from '@apollo/client/testing';
import {
    fireEvent,
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from '@testing-library/react';
import {
    mockOrgId,
    mockOrgStack,
    mockUserId,
} from '@tests/mockOrganizationData';
import { render } from "@tests/utils/render";
import React from 'react';

const mockOrgNode = {
    organization: {
        id: mockOrgId,
        name: `KidsLoop Miracle Squad`,
        owners: [
            {
                email: `owneremail@testing.com`,
            },
        ],
        contactInfo: {
            phone: `1112223344`,
        },
    },
    rolesConnection: {
        edges: [
            {
                node: {
                    id: `23d899cd-862e-4bb6-8e57-761d701bc9fb`,
                    name: `Organization Admin`,
                },
            },
            {
                node: {
                    id: `23d899cd-862e-4bb6-8e57-761d701bc9fc`,
                    name: `School Admin`,
                },
            },
        ],
    },
};

let deleteCalled = false;
const mocks: MockedResponse[] = [
    {
        request: {
            query: MY_USER_QUERY,
        },
        result: {
            data: {
                myUser: {
                    profiles: [],
                    node: {
                        id: mockUserId,
                        givenName: `givenName`,
                        familyName: `familyName`,
                        avatar: `https://via.placeholder.com/150`,
                        username: `username`,
                        contactInfo: {
                            email: `test@test.com`,
                            phone: `0123456789`,
                            username: `username`,
                        },
                        organizationMembershipsConnection: {
                            edges: [
                                {
                                    node: mockOrgNode,
                                },
                            ],
                        },
                    },
                },
            },
        },
        newData: () => {
            if (!deleteCalled) {
                return {
                    data: {
                        myUser: {
                            profiles: [],
                            node: {
                                id: mockUserId,
                                givenName: `givenName`,
                                familyName: `familyName`,
                                avatar: `https://via.placeholder.com/150`,
                                username: `username`,
                                contactInfo: {
                                    email: `test@test.com`,
                                    phone: `0123456789`,
                                    username: `username`,
                                },
                                organizationMembershipsConnection: {
                                    edges: [
                                        {
                                            node: mockOrgNode,
                                        },
                                    ],
                                },
                            },
                        },
                    },
                };
            } else {
                return {
                    data: {
                        myUser: {
                            profiles: [],
                            node: {
                                id: mockUserId,
                                givenName: `givenName`,
                                familyName: `familyName`,
                                avatar: `https://via.placeholder.com/150`,
                                username: `username`,
                                contactInfo: {
                                    email: `test@test.com`,
                                    phone: `0123456789`,
                                    username: `username`,
                                },
                                organizationMembershipsConnection: {
                                    edges: [],
                                },
                            },
                        },
                    },
                };
            }
        },
    },
    {
        request: {
            query: DELETE_USER_IN_ORGANIZATION,
            variables: {
                organizationId: mockOrgId,
                userIds: [ mockUserId ],
            },
        },
        result: () => {
            deleteCalled = true;
            return {
                data: {
                    user: {
                        membership: {
                            leave: true,
                        },
                    },
                },
            };
        },
    },
];

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useOrganizationStack: () => ([ mockOrgStack, jest.fn() ]),
    };
});

test(`JoinedOrganizationTable renders correctly`, async () => {
    render(<JoinedOrganizationTable />, {
        mockedResponses: mocks,
    });

    expect(screen.getByText(`Joined Organizations`)).toBeInTheDocument();
    expect(screen.getAllByText(`Organization Name`)).toHaveLength(2);
    expect(screen.getAllByText(`Phone Number`)).toHaveLength(2);
    expect(screen.getAllByText(`Organization Owner's Email`)).toHaveLength(2);
    expect(screen.getAllByText(`Your Role`)).toHaveLength(2);

    await waitFor(() => {
        expect(screen.getByText(`KidsLoop Miracle Squad`)).toBeInTheDocument();
        expect(screen.getByText(`1112223344`)).toBeInTheDocument();
        expect(screen.getByText(`owneremail@testing.com`)).toBeInTheDocument();
        expect(screen.getByText(`Organization Admin`)).toBeInTheDocument();
        expect(screen.getByText(`School Admin`)).toBeInTheDocument();
        expect(screen.getAllByRole(`button`, {
            name: `More actions`,
        })).toHaveLength(1);
    });
});

test(`JoinedOrganizationTable updates table correctly after leaving organization.`, async () => {
    render(<JoinedOrganizationTable />, {
        mockedResponses: mocks,
    });

    await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

    fireEvent.click(screen.getByRole(`button`, {
        name: `More actions`,
    }));

    fireEvent.click(screen.getByRole(`menuitem`, {
        name: `Leave Organization`,
        hidden: true,
    }));

    await waitForElementToBeRemoved(() => screen.queryByText(`KidsLoop Miracle Squad`));

    expect(screen.queryAllByRole(`button`, {
        name: `More actions`,
    })).toHaveLength(0);
});
