import { GetAllProgramsPaginatedResponse } from "@/api/programs";
import ProgramTable from "@/components/Program/Table";
import { isActive } from "@/types/graphQL";
import { getLanguage } from "@/utils/locale";
import { isUuid } from "@/utils/pagination";
import { mapProgramNodeToProgramRow } from "@/utils/programs";
import {
    act,
    screen,
    waitFor,
} from "@testing-library/react";
import {
    inputSearch,
    mockOrganizationId,
    programIdA,
    programIdB,
    programIdC,
    programIdD,
    programs,
} from '@tests/mockDataPrograms';
import qlRender from "@tests/utils";
import { utils } from "kidsloop-px";
import React from "react";

test(`should return an empty array`, () => {
    const rows = [].map(mapProgramNodeToProgramRow);

    expect(rows).toEqual([]);
});

test(`should return a truthy boolean if is a well formed UUID`, () => {
    expect(isUuid(mockOrganizationId)).toBeTruthy();
    expect(isUuid(programIdA)).toBeTruthy();
    expect(isUuid(programIdB)).toBeTruthy();
    expect(isUuid(programIdC)).toBeTruthy();
    expect(isUuid(programIdD)).toBeTruthy();
    expect(isUuid(inputSearch)).toBeFalsy();
});

const data: GetAllProgramsPaginatedResponse = {
    programsConnection: {
        totalCount: 4,
        pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: ``,
            endCursor: ``,
        },
        edges: programs,
    },
};

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            organization_id: mockOrganizationId,
        }),
        useCurrentOrganizationMembership: () => ({
            organization_id: mockOrganizationId,
        }),
    };
});

jest.mock(`@/utils/checkAllowed`, () => {
    return {
        ...jest.requireActual(`@/utils/checkAllowed`),
        usePermission: () => true,
    };
});

test(`Programs table page renders data`, async () => {
    const locale = getLanguage(`en`);
    const component = <ProgramTable
        order="asc"
        orderBy="name"
        loading={false}
        rows={data.programsConnection.edges.filter((edge) => isActive(edge.node)).map((edge) => mapProgramNodeToProgramRow(edge.node)) ?? []}
    />;
    const { queryAllByText } = qlRender([], locale, component);

    await act(async () => {
        const title = await screen.findByText(`Programs`);

        await waitFor(() => {
            expect(title).toBeTruthy();
        });

        await utils.sleep(0);

        await waitFor(() => {
            expect(queryAllByText(`Bada Read`)).toBeTruthy();
            expect(queryAllByText(`Bada Rhyme`)).toBeTruthy();
            expect(queryAllByText(`Bada Sound`)).toBeTruthy();
        });
    });
});
