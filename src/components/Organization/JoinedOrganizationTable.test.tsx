import 'regenerator-runtime/runtime';
import JoinedOrganizationTable from './JoinedOrganizationTable';
import { LEAVE_MEMBERSHIP } from '@/operations/mutations/leaveMembership';
import { GET_ORGANIZATION_MEMBERSHIPS } from "@/operations/queries/getOrganizations";
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

let deleteCalled = false;
const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_ORGANIZATION_MEMBERSHIPS,
        },
        result: {
            data: () => {
                return {
                    me: {
                        memberships: mockOrgStack,
                        email: `test@test.com`,
                    },
                };
            },
        },
        newData: () => {
            if (!deleteCalled) {
                return {
                    data: {
                        me: {
                            memberships: mockOrgStack,
                            email: `test@test.com`,
                        },
                    },
                };
            } else  {
                return {
                    data: {
                        me: {
                            memberships: [],
                            email: `test@test.com`,
                        },
                    },
                };
            }
        },
    },
    {
        request: {
            query: LEAVE_MEMBERSHIP,
            variables: {
                organization_id: mockOrgId,
                user_id: mockUserId,
            },
        },
        result: () => {
            deleteCalled = true;
            return {};
        },
    },
];

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            organization_id: mockOrgId,
        }),
        useCurrentOrganizationMembership: () => ({
            organization_id: mockOrgId,
        }),
        useOrganizationStack: () => ([ mockOrgStack, jest.fn() ]),
    };
});

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

jest.mock(`@apollo/client/react`, () => {
    return {
        ...jest.requireActual(`@apollo/client/react`),
        useReactiveVar: () => mockUserId,
    };
});

test(`JoinedOrganizationTable renders correctly`, async () => {
    render(<JoinedOrganizationTable />, {
        mockedResponses: mocks,
    });

    expect(screen.queryByText(`Joined Organizations`)).toBeTruthy();
    expect(screen.queryAllByText(`Organization Name`).length).toBeTruthy();
    expect(screen.queryAllByText(`Phone Number`).length).toBeTruthy();
    expect(screen.queryAllByText(`Organization Owner's Email`).length).toBeTruthy();
    expect(screen.queryAllByText(`Your Role`).length).toBeTruthy();

    await waitFor(() => {
        expect(screen.queryAllByTestId(`MoreVertIcon`)).toHaveLength(1);
    });
});

test(`JoinedOrganizationTable renders correct data`, async () => {
    render(<JoinedOrganizationTable />, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryByText(`KidsLoop Miracle Squad`)).toBeTruthy();
        expect(screen.queryByText(`1112223344`)).toBeTruthy();
        expect(screen.queryByText(`owneremail@testing.com`)).toBeTruthy();
        expect(screen.queryByText(`Organization Admin`)).toBeTruthy();
        expect(screen.queryByText(`School Admin`)).toBeTruthy();
    });
});

test(`JoinedOrganizationTable updates table correctly after leaving organization.`, async () => {
    render(<JoinedOrganizationTable />, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryByText(`KidsLoop Miracle Squad`)).toBeTruthy();
    });

    fireEvent.click(await screen.findByTestId(`MoreVertIcon`));
    fireEvent.click(await screen.findByText(`Leave Organization`));

    await waitForElementToBeRemoved(() => screen.queryByText(`KidsLoop Miracle Squad`));

    await waitFor(() => {
        expect(screen.queryAllByTestId(`MoreVertIcon`)).toHaveLength(0);
    });
});
