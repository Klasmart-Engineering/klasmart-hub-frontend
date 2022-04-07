import RolesPage from './index';
import {
    buildOrganizationRoleFilter,
    GET_PAGINATED_ORGANIZATION_ROLES,
} from '@/operations/queries/getPaginatedOrganizationRoles';
import { MockedResponse } from '@apollo/client/testing';
import {
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import {
    mockOrgId,
    mockRolesConnection,
} from '@tests/mockRoles';
import { render } from "@tests/utils/render";
import React from "react";

const mockQueryVariables = {
    direction: `FORWARD`,
    count: 10,
    orderBy: `name`,
    order: `ASC`,
    filter: buildOrganizationRoleFilter({
        organizationId: mockOrgId,
        search: ``,
        filters:  [],
    }),
};

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_ROLES,
            variables: mockQueryVariables,
        },
        result: {
            data: {
                rolesConnection: mockRolesConnection,
            },
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

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

describe(`RolesPage`, () => {
    describe(`Render`, () => {
        test(`Default props`, async () => {
            render(<RolesPage />, {
                mockedResponses: mocks,
            });

            await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

            expect(screen.getByText(`Roles`)).toBeInTheDocument();
            expect(screen.getByText(`Test Organization Admin`)).toBeInTheDocument();
            expect(screen.getByText(`Test School Admin`)).toBeInTheDocument();
        });

        test(`No mocked response data`, async () => {
            render(<RolesPage />);

            await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

            expect(screen.getByText(`Roles`)).toBeInTheDocument();
            expect(screen.getByText(`No records to display`)).toBeInTheDocument();
        });
    });

    describe(`Interact`, () => {
        test(`onClick edit role should open edit role dialog`, async () => {
            render(<RolesPage />, {
                mockedResponses: mocks,
            });

            await waitForElementToBeRemoved(() => screen.queryByRole(`progressbar`));

            userEvent.click(screen.getAllByLabelText(`More actions`)[2]);
            userEvent.click(screen.getByRole(`menuitem`, {
                name: `Edit`,
                hidden: true,
            }));

            expect(screen.getByText(`Edit Role`)).toBeInTheDocument();
        });
    });
});
