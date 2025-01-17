import MyOrganizationTable from './MyOrganizationTable';
import { GET_ORGANIZATION_OWNERSHIPS } from "@/operations/queries/getMyOrganization";
import { Status } from '@/types/graphQL';
import { MockedResponse } from '@apollo/client/testing';
import {
    screen,
    waitFor,
} from '@testing-library/react';
import {
    mockOrgId,
    mockOrgStack,
    mockUserId,
} from '@tests/mockOrganizationData';
import { render } from "@tests/utils/render";
import React from 'react';

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_ORGANIZATION_OWNERSHIPS,
        },
        result: {
            data: {
                me: {
                    organization_ownerships: [
                        {
                            organization: {
                                organization_id: mockOrgId,
                                organization_name: `KidsLoop Miracle Squad`,
                                phone: `1112223344`,
                                status: Status.ACTIVE,
                                roles: [
                                    {
                                        role_id: `23d899cd-862e-4bb6-8e57-761d701bc9fb`,
                                        role_name: `Organization Admin`,
                                        status: Status.ACTIVE,
                                    },
                                    {
                                        role_id: `23d899cd-862e-4bb6-8e57-761d701bc9fc`,
                                        role_name: `School Admin`,
                                        status: Status.ACTIVE,
                                    },
                                ],
                                owner: {
                                    email: `owneremail@testing.com`,
                                },
                            },
                            organization_id: mockOrgId,
                            status: Status.ACTIVE,
                            user_id: mockUserId,
                            user: {
                                email: `test@testing.com`,
                            },
                            roles: [
                                {
                                    role_id: `23d899cd-862e-4bb6-8e57-761d701bc9fb`,
                                    role_name: `Organization Admin`,
                                    status: Status.ACTIVE,
                                },
                                {
                                    role_id: `23d899cd-862e-4bb6-8e57-761d701bc9fc`,
                                    role_name: `School Admin`,
                                    status: Status.ACTIVE,
                                },
                            ],
                        },
                    ],
                },
            },
        },
    },
];

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useOrganizationStack: () => ([ mockOrgStack[0] ]),
    };
});

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

test(`MyOrganizationTable renders correctly`, async () => {
    render(<MyOrganizationTable />, {
        mockedResponses: mocks,
    });

    expect(screen.getByText(`My Organizations`)).toBeInTheDocument();
    expect(screen.getAllByText(`Organization Name`)).toHaveLength(2);
    expect(screen.getAllByText(`Phone Number`)).toHaveLength(2);
    expect(screen.getAllByText(`Email`)).toHaveLength(2);
    expect(screen.getAllByText(`Role(s)`)).toHaveLength(2);
    expect(screen.getAllByText(`Status`)).toHaveLength(2);

    await waitFor(() => {
        expect(screen.queryByText(`KidsLoop Miracle Squad`)).toBeInTheDocument();
        expect(screen.queryByText(`1112223344`)).toBeInTheDocument();
        expect(screen.queryByText(`test@testing.com`)).toBeInTheDocument();
        expect(screen.queryByText(`Organization Admin`)).toBeInTheDocument();
        expect(screen.queryByText(`School Admin`)).toBeInTheDocument();
        expect(screen.queryByText(`Active`)).toBeInTheDocument();
    });
});
