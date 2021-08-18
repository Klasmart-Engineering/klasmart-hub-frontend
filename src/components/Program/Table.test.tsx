import { GetAllProgramsPaginatedResponse } from "@/api/programs";
import ProgramTable from "@/components/Program/Table";
import {
    buildOrganizationAgeRangeFilter,
    GET_PAGINATED_AGE_RANGES,
} from "@/operations/queries/getPaginatedAgeRanges";
import { isActive } from "@/types/graphQL";
import { useGetTableFilters } from "@/utils/filters";
import { getLanguage } from "@/utils/locale";
import { isUuid } from "@/utils/pagination";
import { mapProgramNodeToProgramRow } from "@/utils/programs";
import { MockedProvider } from "@apollo/client/testing/";
import {
    act,
    screen,
    waitFor,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { mockPaginatedAgeRanges } from "@tests/mockDataAgeRanges";
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
import TestRenderer from 'react-test-renderer';

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

const mocks = [
    {
        request: {
            query: GET_PAGINATED_AGE_RANGES,
            variables: {
                direction: `FORWARD`,
                count: 100,
                orderBy: [ `lowValueUnit`, `lowValue` ],
                order: `ASC`,
                filter: buildOrganizationAgeRangeFilter({
                    organizationId: mockOrganizationId,
                }),
            },
        },
        result: {
            data: mockPaginatedAgeRanges,
        },
    },
];

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

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
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

test(`useGetTableFilters hook should return mapped age range data`, async () => {
    const { act } = TestRenderer;
    const wrapper = ({ children }: { children: [] }) => (
        <MockedProvider
            mocks={mocks}
            addTypename={false}>
            {children}
        </MockedProvider>
    );
    const { result } = renderHook(() => useGetTableFilters(mockOrganizationId, {
        queryAgeRanges: true,
    }), {
        wrapper,
    });
    await act(async () => {
        await waitFor(() => {
            expect(result.current.ageRangesHighValueOptions.length).toEqual(1);
            expect(result.current.ageRangesLowValueOptions.length).toEqual(2);
            expect(result.current.ageRangesHighValueOptions[0].value).toBe(`5 year`);
            expect(result.current.ageRangesLowValueOptions[0].value).toBe(`1 year`);
            expect(result.current.ageRangesLowValueOptions[1].value).toBe(`3 year`);
            expect(result.current.ageRangesHighValueOptions[0].label).toBe(`5 Year(s)`);
            expect(result.current.ageRangesLowValueOptions[0].label).toBe(`1 Year(s)`);
            expect(result.current.ageRangesLowValueOptions[1].label).toBe(`3 Year(s)`);
        });
    });
});
