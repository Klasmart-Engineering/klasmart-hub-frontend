import DetailsDrawer from './DetailsDrawer';
import { GET_SUBJECT } from '@/operations/queries/getSubject';
import { MockedResponse } from '@apollo/client/testing';
import {
    screen,
    waitFor,
} from '@testing-library/react';
import {
    mathId1,
    mockOrgId,
    mockSubjectDetail,
} from '@tests/mockDataSubjects';
import { render } from "@tests/utils/render";
import React from 'react';

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_SUBJECT,
            variables: {
                subject_id: mathId1,
            },
        },
        result: {
            data: mockSubjectDetail,
        },
    },
];

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            id: mockOrgId,
        }),
    };
});

test(`Details drawer component renders and displays correct information`, async () => {
    render(<DetailsDrawer
        subjectId={mathId1}
        open={true}
        onClose={jest.fn()}/>, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryByText(`Math Grade 5`)).toBeInTheDocument();
        expect(screen.queryByText(`Algebra`)).toBeInTheDocument();
    });
});
