import CreateGrade from './Create';
import { MockedResponse } from '@apollo/client/testing';
import {
    screen,
    waitFor,
} from '@testing-library/react';
import { mockOrgId } from '@tests/mockDataGrades';
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

const mocks: MockedResponse[] = [];

test(`Create grade dialog renders correctly and with empty fields.`, async () => {
    render(<CreateGrade
        open={true}
        onClose={jest.fn()}/>, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryByText(`Create Grade`)).toBeInTheDocument();
        expect(screen.queryByLabelText(`Grade Name`)).toBeInTheDocument();
        expect(screen.queryByLabelText(`Progress From`)).toBeInTheDocument();
        expect(screen.queryByLabelText(`Progress To`)).toBeInTheDocument();
    });
});
