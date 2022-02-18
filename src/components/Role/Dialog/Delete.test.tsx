import DeleteRoleDialog from './Delete';
import { GET_ORGANIZATION_USERS } from '@/operations/queries/getOrganizationUsers';
import {
    buildOrganizationUserFilter,
    GET_PAGINATED_ORGANIZATION_USERS,
} from '@/operations/queries/getPaginatedOrganizationUsers';
import {
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react";
import {
    mockOrganizationMemberships,
    mockOrgId,
    mockPaginatedUsers,
} from '@tests/mockDataUsers';
import { render } from "@tests/utils/render";
import React from 'react';

const initialRow = {
    id: `1ancb-hdjjdw-167e21k`,
    name: `Test`,
    description: `Test`,
    type: ``,
    system: false,
};

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

const mocks = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_USERS,
            variables: {
                direction: `FORWARD`,
                count: 50,
                orderBy: [ `givenName` ],
                order: `ASC`,
                filter: buildOrganizationUserFilter({
                    organizationId: mockOrgId,
                    search: ``,
                    filters: [],
                }),
            },
        },
        result: {
            data: mockPaginatedUsers,
            loading: false,
        },
    },
    {
        request: {
            query: GET_ORGANIZATION_USERS,
            variables: {
                organization_id: mockOrgId,
            },
        },
        result: {
            data: mockOrganizationMemberships,
        },
    },
];

test(`Delete role user table renders correctly`, async () => {
    const component = <DeleteRoleDialog
        open={true}
        handleClose={() => {return;}}
        row={initialRow}
        roles={[]}
        getAllRolesLoading={false}
        refetch={() => {return;}}
    />;
    render(component, {
        mockedResponses: mocks,
    });

    expect(await screen.findByText(`Users with Test`)).toBeInTheDocument();
    // assert users in the table once the mocks are working
});

test(`Delete role user table filter dropdown opens`, async () => {
    const component = <DeleteRoleDialog
        open={true}
        handleClose={() => {return;}}
        row={initialRow}
        roles={[]}
        getAllRolesLoading={false}
        refetch={() => {return;}}
    />;
    render(component);

    await waitFor(() => {
        expect(screen.queryAllByText(`Email`)).toHaveLength(0);
        expect(screen.queryByText(`Column`)).toBeFalsy();
    });

    fireEvent.click(screen.getByText(`Add Filter`));

    await waitFor(() => {
        expect(screen.queryAllByText(`Email`, {
            selector: `span`,
        })).toHaveLength(1);
        expect(screen.queryAllByText(`Column`)).toHaveLength(2);
    });
});

test.todo(`Delete role reassign all users to new role`);
test.todo(`Delete role successful`);
test.todo(`Delete role unsuccessful`);
