import DetailsDrawer from './DetailsDrawer';
import { GET_PROGRAM } from '@/operations/queries/getProgram';
import { MockedResponse } from '@apollo/client/testing';
import {
    screen,
    waitFor,
} from '@testing-library/react';
import {
    mockOrganizationId,
    mockProgramDetailsDrawer,
    programIdA,
    programNameA,
} from '@tests/mockDataPrograms';
import { render } from "@tests/utils/render";
import React from 'react';

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_PROGRAM,
            variables: {
                id: programIdA,
            },
        },
        result: {
            data: mockProgramDetailsDrawer,
        },
    },
];

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            organization_id: mockOrganizationId,
        }),
        useCurrentOrganizationMembership: () => ({
            organization_id: mockOrganizationId,
        }),
    };
});

test(`Details drawer component for Programs renders and displays correct information`, async () => {
    render(<DetailsDrawer
        programId={programIdA}
        open={true}
        onClose={jest.fn()}/>, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryByText(`Age Ranges`)).toBeInTheDocument();
        expect(screen.queryByText(`Grades`)).toBeInTheDocument();
        expect(screen.queryByText(`Subjects`)).toBeInTheDocument();
        expect(screen.queryByText(programNameA)).toBeInTheDocument();
        expect(screen.queryByText(`5 - 6 Year(s)`)).toBeInTheDocument();
        expect(screen.queryByText(`6 - 7 Year(s)`)).toBeInTheDocument();
        expect(screen.queryByText(`7 - 8 Year(s)`)).toBeInTheDocument();
    });
});
