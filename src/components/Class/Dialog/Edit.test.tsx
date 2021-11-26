import EditClassDialog from "@/components/Class/Dialog/Edit";
import { GET_CLASS } from "@/operations/queries/getClass";
import { GET_SCHOOLS_FROM_ORGANIZATION } from "@/operations/queries/getSchoolsFromOrganization";
import { GET_USER_NODE_SCHOOL_MEMBERSHIPS } from "@/operations/queries/getUserNodeSchoolMemberships";
import { MockedResponse } from "@apollo/client/testing";
import {
    screen,
    waitFor,
} from "@testing-library/react";
import {
    mockClass,
    mockClassId,
    mockOrgId,
    mockSchoolsData,
    mockUserId,
} from "@tests/mockDataClasses";
import { mockUserNode } from "@tests/mockUsers";
import { render } from "@tests/utils/render";
import React from 'react';

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            organization_id: mockOrgId,
        }),
        useCurrentOrganizationMembership: () => ({
            organization_id: mockOrgId,
        }),
    };
});

jest.mock(`@apollo/client`, () => {
    return {
        ...jest.requireActual(`@apollo/client`),
        useReactiveVar: () => mockUserId,
    };
});

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_CLASS,
            variables: {
                id: mockClassId,
                organizationId: mockOrgId,
            },
        },
        result: {
            data: mockClass,
        },
    },
    {
        request: {
            query: GET_SCHOOLS_FROM_ORGANIZATION,
            variables: {
                organization_id: mockOrgId,
            },
        },
        result: {
            data: mockSchoolsData,
        },
    },
    {
        request: {
            query: GET_USER_NODE_SCHOOL_MEMBERSHIPS,
            variables: {
                id: mockUserId,
            },
        },
        result: {
            data: {
                userNode: mockUserNode,
            },
        },
    },
];

test(`Class edit component renders with correct information`, async () => {
    render(<EditClassDialog
        open={true}
        classId={mockClassId}
        onClose={(() => jest.fn())}
    />, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryByText(`Edit class`)).toBeInTheDocument();
        expect(screen.queryAllByText(`Class name`).length).toBeTruthy();
        expect(screen.getByDisplayValue(`Demo Class`)).toBeInTheDocument();
        expect(screen.queryByText(`Clapham School1`)).toBeInTheDocument();
        expect(screen.queryByText(`ESL`)).toBeInTheDocument();
        expect(screen.queryByText(`3 - 4 Year(s)`)).toBeInTheDocument();
        expect(screen.queryByText(`PreK-1`)).toBeInTheDocument();
        expect(screen.queryByText(`Language/Literacy`)).toBeInTheDocument();
    });
});
