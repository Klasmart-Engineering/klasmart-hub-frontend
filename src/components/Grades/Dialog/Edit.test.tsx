import EditGrade from './Edit';
import { GET_GRADE } from '@/operations/queries/getGrade';
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
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
    const { getByLabelText, getByText } = render(<EditGrade
        gradeId={grade2Id}
        open={true}
        onClose={jest.fn()}/>, {
        mockedResponses: mocks,
    });

    await act(async () => {
        const title = await getByText(`Edit Grade`);
        const name = await getByLabelText(`Grade Name`);
        const pFrom = await getByLabelText(`Progress From`);
        const pTo = await getByLabelText(`Progress To`);

        await waitFor(() => {
            expect(title).toBeTruthy();
            expect(name).toBeTruthy();
            expect(pFrom).toBeTruthy();
            expect(pTo).toBeTruthy();
        });

    });
});

test(`Edit grade dialog renders correctly with correct data`, async () => {
    await act(async () => {
        const { queryByLabelText } = render(<EditGrade
            gradeId={grade2Id}
            open={true}
            onClose={jest.fn()}/>, {
            mockedResponses: mocks,
        });

        await waitFor(() => {
            expect(queryByLabelText(`Grade Name`, {
                selector: `input`,
            })?.value).toBe(`Grade 2`);
        });

    });
});
