import "regenerator-runtime/runtime";
import ClassTable from "./Table";
import { organizationPaginatedClasses } from "@/utils/classes";
import { getLanguage } from "@/utils/locale";
import {
    act,
    screen,
    waitFor,
} from "@testing-library/react";
import { mockClasses } from "@tests/mockDataClasses";
import qlRender from "@tests/utils";
import { utils } from "kidsloop-px";
import React from "react";

const orgId = `c19de3cc-aa01-47f5-9f87-850eb70ae073`;

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            organization_id: orgId,
        }),
        useCurrentOrganizationMembership: () => ({
            organization_id: orgId,
        }),
    };
});

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

const rows = mockClasses.edges?.map(organizationPaginatedClasses) ?? [];

test(`Class table renders without records`, async () => {
    const locale = getLanguage(`en`);
    const { queryByText } = qlRender([], locale, <ClassTable rows={[]}/>);

    await act(async () => {
        await waitFor(() => {
            expect(screen.queryByText(`Classes`)).toBeTruthy();
            expect(queryByText(`No records to display`)).toBeTruthy();
        });
    });
});

test(`Class table renders with records`, async () => {
    const locale = getLanguage(`en`);
    const { queryByText, queryAllByText } = qlRender([], locale, <ClassTable rows={rows}/>);

    await act(async () => {
        await waitFor(() => {
            expect(screen.queryByText(`Classes`)).toBeTruthy();
            expect(queryByText(`Class Grade 2`)).toBeTruthy();
        });

        await utils.sleep(0);

        await waitFor(() => {
            expect(queryAllByText).toBeTruthy();
        });
    });
});
