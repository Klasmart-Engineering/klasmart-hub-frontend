import EditClassDialog from "@/components/Class/Dialog/Edit";
import { GET_CLASS } from "@/operations/queries/getClass";
import { GET_SCHOOLS_FROM_ORGANIZATION } from "@/operations/queries/getSchoolsFromOrganization";
import { GET_USER_SCHOOL_MEMBERSHIPS } from "@/operations/queries/getUserSchoolMemberships";
import { MockedResponse } from "@apollo/client/testing";
import {
    act,
    waitFor,
} from "@testing-library/react";
import {
    mockClass,
    mockClassId,
    mockOrgId,
    mockSchoolsData,
    mockUserId,
    mockUserSchoolMemberships,
} from "@tests/mockDataClasses";
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
            query: GET_USER_SCHOOL_MEMBERSHIPS,
            variables: {
                organization_id: mockOrgId,
                user_id: mockUserId,
            },
        },
        result: {
            data: mockUserSchoolMemberships,
        },
    },
];

test(`Class edit component renders with correct information`, async () => {
    const {
        queryByText,
        queryAllByText,
        getByDisplayValue,
    } = render(<EditClassDialog
        open={true}
        classId={mockClassId}
        onClose={(() => jest.fn())}
    />, {
        mockedResponses: mocks,
    });

    await act(async () => {
        expect(queryByText(`Edit class`)).toBeTruthy();
        expect(queryAllByText(`Class name`).length).toBeTruthy();
        await waitFor(() => {
            expect(getByDisplayValue(`Demo Class`)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(queryByText(`Clapham School1`)).toBeTruthy();
        });

        await waitFor(() => {
            expect(queryByText(`ESL`)).toBeTruthy();
            expect(queryByText(`3 - 4 Year(s)`)).toBeTruthy();
            expect(queryByText(`PreK-1`)).toBeTruthy();
            expect(queryByText(`Language/Literacy`)).toBeTruthy();
        });
    });
});
