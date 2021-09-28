import EditGrade from './Edit';
import { GET_GRADE } from '@/operations/queries/getGrade';
import { MockedResponse } from '@apollo/client/testing';
import {
    screen,
    waitFor,
} from '@testing-library/react';
import {
    grade2Id,
    mockGrade,
    mockOrgId,
} from '@tests/mockDataGrades';
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

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_GRADE,
            variables: {
                id: grade2Id,
            },
        },
        result: {
            data: {
                grade: mockGrade,
            },
        },
    },
];

test(`Edit grade dialog renders correctly`, async () => {
    render(<EditGrade
        gradeId={grade2Id}
        open={true}
        onClose={jest.fn()}/>, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.getByText(`Edit Grade`)).toBeInTheDocument();
        expect(screen.getByLabelText(`Grade Name`)).toBeInTheDocument();
        expect(screen.getByLabelText(`Progress From`)).toBeInTheDocument();
        expect(screen.getByLabelText(`Progress To`)).toBeInTheDocument();
    });
});

test(`Edit grade dialog renders correctly with correct data`, async () => {
    render(<EditGrade
        gradeId={grade2Id}
        open={true}
        onClose={jest.fn()}/>, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryByLabelText(`Grade Name`, {
            selector: `input`,
        })?.value).toBe(`Grade 2`);
    });
});
