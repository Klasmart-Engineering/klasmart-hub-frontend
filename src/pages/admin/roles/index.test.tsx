import RolesPage from './index';
import {
    buildOrganizationRoleFilter,
    GET_PAGINATED_ORGANIZATION_ROLES,
} from '@/operations/queries/getPaginatedOrganizationRoles';
import { MockedResponse } from '@apollo/client/testing';
import {
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react";
import {
    mockOrgId,
    mockRolesConnection,
    mockSearchRolesConnection,
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

const mockSearchQueryVariables = {
    direction: `FORWARD`,
    count: 10,
    orderBy: `name`,
    order: `ASC`,
    filter: buildOrganizationRoleFilter({
        organizationId: mockOrgId,
        search: `Organization Admin`,
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
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_ROLES,
            variables: mockSearchQueryVariables,
        },
        result: {
            data: {
                rolesConnection: mockSearchRolesConnection,
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

            await waitFor(() => {
                expect(screen.queryByText(`Roles`)).toBeInTheDocument();
                expect(screen.queryByText(`Organization Admin`)).toBeInTheDocument();
                expect(screen.queryByText(`School Admin`)).toBeInTheDocument();
            });
        });

        test(`No mocked response data`, () => {
            render(<RolesPage />);

            expect(screen.queryByText(`Roles`)).toBeInTheDocument();
            expect(screen.queryByText(`No records to display`)).toBeInTheDocument();
        });
    });

    describe(`Interact`, () => {
        test(`onClick edit role should open edit role dialog`, async () => {
            render(<RolesPage />, {
                mockedResponses: mocks,
            });

            await waitFor(() => {
                expect(screen.queryByText(`Roles`)).toBeInTheDocument();
                expect(screen.queryByText(`Organization Admin`)).toBeInTheDocument();
                expect(screen.queryByText(`School Admin`)).toBeInTheDocument();
            });

            fireEvent.click(screen.queryAllByTestId(`MoreVertIcon`)[0]);
            fireEvent.click(await screen.findByText(`Edit`));

            await waitFor(() => {
                expect(screen.queryByText(`Edit Role`)).toBeInTheDocument();
            });
        });
    });
});
