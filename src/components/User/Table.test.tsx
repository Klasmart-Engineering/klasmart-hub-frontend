import UsersTable from './Table';
import { GET_ORGANIZATION_ROLES } from '@/operations/queries/getOrganizationRoles';
import { Status } from "@/types/graphQL";
import { useGetTableFilters } from '@/utils/filters';
import { sortSchoolNames } from '@/utils/schools';
import { sortRoleNames } from '@/utils/userRoles';
import { MockedProvider } from '@apollo/client/testing';
import {
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import {
    mockOrgId,
    mockPaginatedUsers,
    mockRolesFilterList,
} from '@tests/mockDataUsers';
import { render } from "@tests/utils/render";
import React from 'react';

const rows = mockPaginatedUsers?.usersConnection?.edges?.map((edge) => ({
    id: edge.node.id,
    givenName: edge.node.givenName ?? ``,
    familyName: edge.node.familyName ?? ``,
    avatar: edge.node.avatar ?? ``,
    email: edge.node.contactInfo.email ?? ``,
    phone: edge.node.contactInfo.phone ?? ``,
    roleNames: edge.node.roles.filter((role) => role.status === Status.ACTIVE).map((role) => role.name).sort(sortRoleNames),
    schoolNames: edge.node.schools.filter((school) => school.status === Status.ACTIVE).map((school) => school.name).sort(sortSchoolNames),
    status: edge.node.organizations?.[0].userStatus,
    joinDate: new Date(edge.node.organizations?.[0].joinDate),
})) ?? [];

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

test(`Users table page renders correctly`, async () => {
    const component = <UsersTable
        order="asc"
        orderBy="name"
        rows={rows}
    />;
    render(component);

    await waitFor(() => {
        expect(screen.queryByText(`Users`)).toBeInTheDocument();
        expect(screen.queryByText(`John`)).toBeInTheDocument();
    });
});

const mocks = [
    {
        request: {
            query: GET_ORGANIZATION_ROLES,
            variables: {
                organization_id: mockOrgId,
            },
        },
        result: {
            data: mockRolesFilterList,
        },
    },
];

test(`useGetTableFilters hook should return mapped user roles data for filter drop down in users`, async () => {
    const wrapper = ({ children }: { children: [] }) => (
        <MockedProvider
            mocks={mocks}
            addTypename={false}>
            {children}
        </MockedProvider>
    );

    const { result } = renderHook(() => useGetTableFilters(mockOrgId, {
        queryUserRoles: true,
    }), {
        wrapper,
    });

    await waitFor(() => {
        expect(result.current.userRolesFilterValueOptions).toHaveLength(5);
        expect(result.current.userRolesFilterValueOptions[0].label).toBe(`Test Organization Admin`);
        expect(result.current.userRolesFilterValueOptions[1].label).toBe(`Test School Admin`);
        expect(result.current.userRolesFilterValueOptions[0].value).toBe(`87aca549-fdb6-4a63-97d4-d563d4a4690a`);
        expect(result.current.userRolesFilterValueOptions[1].value).toBe(`87aca549-fdb6-4a63-97d4-d563d4a4690b`);
    });
});

test(`User page filter dropdown opens`, async () => {
    const component = <UsersTable
        order="asc"
        orderBy="name"
        rows={[]}
    />;

    render(component, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryAllByText(`Organization Roles`)).toHaveLength(2);
        expect(screen.queryByText(`Column`)).toBeFalsy();
    });

    fireEvent.click(screen.getByText(`Add Filter`));

    await waitFor(() => {
        expect(screen.queryAllByText(`Organization Roles`)).toHaveLength(3);
        expect(screen.queryAllByText(`Organization Roles`, {
            selector: `span`,
        })).toHaveLength(1);
        expect(screen.queryAllByText(`Column`)).toHaveLength(2);
    });

    const rolesOption = await screen.findByText(`Organization Roles`, {
        selector: `span `,
    });

    const mockDropdownClick = jest.fn();
    rolesOption.addEventListener(`click`, mockDropdownClick);

    fireEvent.click(rolesOption, {
        bubbles: true,
    });

    await waitFor(() => {
        expect(mockDropdownClick).toHaveBeenCalledTimes(1);
    });
});
