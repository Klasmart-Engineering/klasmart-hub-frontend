import 'regenerator-runtime/runtime';
import MyOrganizationTable from './MyOrganizationTable';
import { GET_ORGANIZATION_OWNERSHIPS } from "@/operations/queries/getMyOrganization";
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    screen,
    waitFor,
} from '@testing-library/react';
import {
    mockOrgId,
    mockOrgStack,
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
                    organization_ownerships: [ mockOrgStack[0] ],
                    user_id: `f6d5a6e2-ebb2-5b0b-836d-2731b2594500`,
                    user_name: `Joe Schmoe`,
                },
            },
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
        useOrganizationStack: () => ([ mockOrgStack[0] ]),
    };
});

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

test(`MyOrganizationTable renders correctly`, () => {
    render(<MyOrganizationTable />, {
        mockedResponses: mocks,
    });

    expect(screen.queryByText(`My Organizations`)).toBeInTheDocument();
    expect(screen.queryAllByText(`Organization Name`).length).toBeTruthy();
    expect(screen.queryAllByText(`Phone Number`).length).toBeTruthy();
    expect(screen.queryAllByText(`Email`).length).toBeTruthy();
    expect(screen.queryAllByText(`Role(s)`).length).toBeTruthy();
    expect(screen.queryAllByText(`Status`).length).toBeTruthy();
});

test(`MyOrganizationTable renders correct data`, async () => {
    render(<MyOrganizationTable />, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryByText(`KidsLoop Miracle Squad`)).toBeInTheDocument();
        expect(screen.queryByText(`1112223344`)).toBeInTheDocument();
        expect(screen.queryByText(`test@testing.com`)).toBeInTheDocument();
        expect(screen.queryByText(`Organization Admin`)).toBeInTheDocument();
        expect(screen.queryByText(`School Admin`)).toBeInTheDocument();
        expect(screen.queryByText(`Active`)).toBeInTheDocument();
    });
});
