import 'regenerator-runtime/runtime';
import JoinedOrganizationTable from './JoinedOrganizationTable';
import { LEAVE_MEMBERSHIP } from '@/operations/mutations/leaveMembership';
import { GET_ORGANIZATION_MEMBERSHIPS } from "@/operations/queries/getOrganizations";
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    waitFor,
    waitForElementToBeRemoved,
} from '@testing-library/react';
import {
    mockOrgId,
    mockOrgStack,
    mockUserId,
} from '@tests/mockOrganizationData';
import qlRender from '@tests/utils';
import React from 'react';

let deleteCalled = false;
const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_ORGANIZATION_MEMBERSHIPS,
        },
        result: {
            data: () => {
                return {
                    me: {
                        memberships: mockOrgStack,
                        email: `test@test.com`,
                    },
                };
            },
        },
        newData: () => {
            if (!deleteCalled) {
                return {
                    data: {
                        me: {
                            memberships: mockOrgStack,
                            email: `test@test.com`,
                        },
                    },
                };
            } else  {
                return {
                    data: {
                        me: {
                            memberships: [],
                            email: `test@test.com`,
                        },
                    },
                };
            }
        },
    },
    {
        request: {
            query: LEAVE_MEMBERSHIP,
            variables: {
                organization_id: mockOrgId,
                user_id: mockUserId,
            },
        },
        result: () => {
            deleteCalled = true;
            return {};
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
        useOrganizationStack: () => ([ mockOrgStack, jest.fn() ]),
    };
});

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

jest.mock(`@apollo/client/react`, () => {
    return {
        ...jest.requireActual(`@apollo/client/react`),
        useReactiveVar: () => mockUserId,
    };
});

test(`JoinedOrganizationTable renders correctly`, async () => {
    const locale = getLanguage(`en`);
    const {
        findByText,
        findAllByText,
        findAllByTitle,
    } = qlRender(mocks, locale, <JoinedOrganizationTable />);

    await act(async () => {
        const title = await findByText(`Joined Organizations`);
        const name = await findAllByText(`Organization Name`);
        const phone = await findAllByText(`Phone Number`);
        const email = await findAllByText(`Organization Owner's Email`);
        const roles = await findAllByText(`Your Role`);
        const rows = await findAllByTitle(`More actions`);

        await waitFor(async () => {
            expect(title).toBeTruthy();
            expect(name.length).toBeTruthy();
            expect(phone.length).toBeTruthy();
            expect(email.length).toBeTruthy();
            expect(roles.length).toBeTruthy();
            expect(rows.length).toEqual(1);
        });
    });
});

test(`JoinedOrganizationTable renders correct data`, async () => {
    const locale = getLanguage(`en`);
    const { findByText } = qlRender(mocks, locale, <JoinedOrganizationTable />);

    await act(async () => {
        const orgName = await findByText(`KidsLoop Miracle Squad`);
        const orgPhone = await findByText(`1112223344`);
        const ownerEmail = await findByText(`owneremail@testing.com`);
        const role1 = await findByText(`Organization Admin`);
        const role2 = await findByText(`School Admin`);

        await waitFor(async () => {
            expect(orgName).toBeTruthy();
            expect(orgPhone).toBeTruthy();
            expect(ownerEmail).toBeTruthy();
            expect(role1).toBeTruthy();
            expect(role2).toBeTruthy();
        });
    });
});

test(`JoinedOrganizationTable updates table correctly after leaving organization.`, async () => {
    const locale = getLanguage(`en`);
    const {
        findByText,
        findByTitle,
        queryByText,
        queryAllByTitle,
    } = qlRender(mocks, locale, <JoinedOrganizationTable />);

    await act(async () => {
        const orgName = await findByText(`KidsLoop Miracle Squad`);
        const moreActions = await findByTitle(`More actions`);

        await waitFor(async () => {
            expect(orgName).toBeTruthy();
        });

        await waitFor(() => {
            moreActions.click();
        });

        const leaveSpan = queryByText(`Leave Organization`);

        await waitFor(async () => {
            expect(leaveSpan).toBeTruthy();
        });

        await waitFor(() => {
            leaveSpan?.click();
        });

        await waitForElementToBeRemoved(() => queryByText(`KidsLoop Miracle Squad`));
        const rowsUpdate = queryAllByTitle(`More actions`);

        await waitFor(() => {
            expect(rowsUpdate.length).toEqual(0);
        });
    });
});
