
import ClassDetailsDrawer from "./DetailsDrawer";
import { GET_CLASS_NODE_SUMMARY } from "@/operations/queries/getClassNodeSummary";
import { MockedResponse } from "@apollo/client/testing";
import {
    screen,
    waitFor,
} from "@testing-library/react";
import {
    mockClassId,
    mockClassSummary,
    mockOrgId,
    mockUserId,
} from "@tests/mockDataClasses";
import { inputSearch } from "@tests/mockDataPrograms";
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
            query: GET_CLASS_NODE_SUMMARY,
            variables: {
                id: mockClassId,
                rosterCount: 10,
                programsCount: 50,
                subjectsCount: 50,
            },
        },
        result: {
            data: mockClassSummary,
        },
    },
];

test(`Class details drawer renders with correct information`, async () => {
    render(<ClassDetailsDrawer
        open={true}
        classId={mockClassId}
        onClose={(() => jest.fn())}
    />, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryByText(`Demo Class`)).toBeInTheDocument();
        expect(screen.queryByText(`Programs`)).toBeInTheDocument();
        expect(screen.queryByText(`Teachers (2)`)).toBeInTheDocument();
        expect(screen.queryByText(`Students (2)`)).toBeInTheDocument();
    });

    screen.queryByText(inputSearch)?.click();

    await waitFor(() => {
        expect(screen.queryByText(`Subjects`)).toBeInTheDocument();
        expect(screen.queryByText(`- Language/Literacy`)).toBeInTheDocument();
    });

    screen.queryByText(`Teachers`)?.click();
    screen.queryByText(`Students`)?.click();

    await waitFor(() => {
        expect(screen.queryByText(`Louis Merkel`)).toBeInTheDocument();
        expect(screen.queryByText(`George Merkel`)).toBeInTheDocument();
        expect(screen.queryByText(`Juan Obrador`)).toBeInTheDocument();
    });
});
