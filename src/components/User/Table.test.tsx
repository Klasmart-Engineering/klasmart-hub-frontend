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
import { act } from 'react-dom/test-utils';
import TestRenderer from 'react-test-renderer';

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

    expect(await screen.findByText(`Users`)).toBeInTheDocument();
    expect(await screen.findByText(`John`)).toBeInTheDocument();
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
    const { act } = TestRenderer;
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

    await act(async () => {
        await waitFor(() => {
            expect(result.current.userRolesFilterValueOptions.length).toEqual(5);
            expect(result.current.userRolesFilterValueOptions[0].label).toBe(`Test Organization Admin`);
            expect(result.current.userRolesFilterValueOptions[1].label).toBe(`Test School Admin`);
            expect(result.current.userRolesFilterValueOptions[0].value).toBe(`87aca549-fdb6-4a63-97d4-d563d4a4690a`);
            expect(result.current.userRolesFilterValueOptions[1].value).toBe(`87aca549-fdb6-4a63-97d4-d563d4a4690b`);
        });
    });
});

test(`User page filter dropdown opens`, async () => {
    const component = <UsersTable
        order="asc"
        orderBy="name"
        rows={[]}
    />;
    const {
        queryAllByText,
        queryByText,
        getByText,
        findByText,
    } = render(component, {
        mockedResponses: mocks,
    });
    await act(async () => {
        await waitFor(() => {
            expect(queryAllByText(`Organization Roles`).length).toEqual(2);
            expect(queryByText(`Column`)).toBeFalsy();
        });
    });

    fireEvent.click(getByText(`Add Filter`));

    await act(async () => {
        await waitFor(() => {
            expect(queryAllByText(`Organization Roles`).length).toEqual(3);
            expect(queryAllByText(`Organization Roles`, {
                selector: `span`,
            }).length).toEqual(1);
            expect(queryAllByText(`Column`).length).toEqual(2);
        });
    });

    const rolesOption = await findByText(`Organization Roles`, {
        selector: `span `,
    });

    const mockDropdownClick = jest.fn();
    rolesOption.addEventListener(`click`, mockDropdownClick);

    fireEvent.click(rolesOption, {
        bubbles: true,
    });

    await act(async () => {
        await waitFor(() => {
            expect(mockDropdownClick).toHaveBeenCalledTimes(1);
        });
    });
});
