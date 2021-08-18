import UsersTable from './Table';
import { Status } from "@/types/graphQL";
import { getLanguage } from "@/utils/locale";
import { sortSchoolNames } from '@/utils/schools';
import { sortRoleNames } from '@/utils/userRoles';
import {
    screen,
    waitFor,
} from "@testing-library/react";
import {
    mockOrgId,
    users,
} from '@tests/mockDataUsers';
import qlRender from '@tests/utils';
import React from 'react';

const data = {
    usersConnection: {
        totalCount: users.length,
        pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: ``,
            endCursor: ``,
        },
        edges: users,
    },
};

const locale = getLanguage(`en`);

const rows = data?.usersConnection?.edges?.map((edge) => ({
    id: edge.id,
    givenName: edge.givenName ?? ``,
    familyName: edge.familyName ?? ``,
    avatar: edge.avatar ?? ``,
    contactInfo: edge.contactInfo.email ?? edge.contactInfo.phone ?? ``,
    roleNames: edge.roles.filter((role) => role.status === Status.ACTIVE).map((role) => role.name).sort(sortRoleNames),
    schoolNames: edge.schools.filter((school) => school.status === Status.ACTIVE).map((school) => school.name).sort(sortSchoolNames),
    status: edge.organizations?.[0].userStatus,
    joinDate: new Date(edge.organizations?.[0].joinDate),
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
    qlRender([], locale, component);

    expect(await screen.findByText(`Users`)).toBeInTheDocument();
    expect(await screen.findByText(`John`)).toBeInTheDocument();
});
