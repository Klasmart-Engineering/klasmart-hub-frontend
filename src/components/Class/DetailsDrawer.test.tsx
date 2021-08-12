
import ClassDetailsDrawer from "./DetailsDrawer";
import { GET_CLASS } from "@/operations/queries/getClass";
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from "@apollo/client/testing";
import {
    act,
    waitFor,
} from "@testing-library/react";
import {
    mockClass,
    mockClassId,
    mockOrgId,
    mockUserId,
} from "@tests/mockDataClasses";
import qlRender from "@tests/utils";
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
            query: GET_CLASS,
            variables: {
                id: mockClassId,
                organizationId: mockOrgId,
            },
        },
        result: {
            data: mockClass,
        },
    },
];

test(`Class details drawer renders with correct information`, async () => {
    const locale = getLanguage(`en`);
    const { queryByText } = qlRender(mocks, locale, <ClassDetailsDrawer
        open={true}
        classId={mockClassId}
        onClose={(() => jest.fn())}
    />);

    await act(async () => {
        await waitFor(() => {
            expect(queryByText(`Demo Class`)).toBeTruthy();
            expect(queryByText(`ESL`)).toBeTruthy();
            expect(queryByText(`Teachers (1)`)).toBeTruthy();
            expect(queryByText(`Students (1)`)).toBeTruthy();
        });

        queryByText(`ESL`)?.click();

        await waitFor(() => {
            expect(queryByText(`Subjects`)).toBeTruthy();
            expect(queryByText(`- Language/Literacy`)).toBeTruthy();
        });

        queryByText(`Teachers`)?.click();
        queryByText(`Students`)?.click();

        await waitFor(() => {
            expect(queryByText(`Louis Merkel`)).toBeTruthy();
            expect(queryByText(`George Merkel`)).toBeTruthy();
            expect(queryByText(`Juan Obrador`)).toBeFalsy();
        });
    });
});
