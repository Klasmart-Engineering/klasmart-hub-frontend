import AgeRanges from "./Table";
import {
    buildOrganizationAgeRangeFilter,
    GET_PAGINATED_AGE_RANGES,
} from "@/operations/queries/getPaginatedAgeRanges";
import { mapAgeRangeNodeToAgeRangeRow } from "@/utils/ageRanges";
import { useGetTableFilters } from "@/utils/filters";
import { MockedProvider } from "@apollo/client/testing";
import {
    screen,
    waitFor,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import {
    ageRangesEdges,
    mockOrganizationId,
    mockPaginatedAgeRanges,
} from "@tests/mockDataAgeRanges";
import { render } from "@tests/utils/render";
import React from "react";

const data = {
    ageRangesConnection: {
        totalCount: ageRangesEdges.length,
        pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: ``,
            endCursor: ``,
        },
        edges: ageRangesEdges,
    },
};

const mocks = [
    {
        request: {
            query: GET_PAGINATED_AGE_RANGES,
            variables: {
                direction: `FORWARD`,
                count: 50,
                orderBy: [ `lowValueUnit`, `lowValue` ],
                order: `ASC`,
                filter: buildOrganizationAgeRangeFilter({
                    organizationId: mockOrganizationId,
                    filters: [],
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
            id: mockOrganizationId,
        }),
    };
});

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

test(`Age ranges page renders with correct data`, async () => {
    const rows =
    data?.ageRangesConnection?.edges
        ?.map((edge) => mapAgeRangeNodeToAgeRangeRow(edge.node)) ?? [];

    const component = <AgeRanges
        order="asc"
        orderBy="name"
        rows={rows} />;
    render(component);

    const title = await screen.findByText(`Age Ranges`);

    await waitFor(() => {
        expect(title).toBeInTheDocument();
    });

    for (let i = 0; i < ageRangesEdges.length; i++) {
        const value = `${ageRangesEdges[i].node?.lowValue} - ${ageRangesEdges[i].node?.highValue} Year(s)`;
        await waitFor(() => {
            expect(screen.queryAllByText(value)).toHaveLength(1);
        });
    }
});

test(`useGetTableFilters hook should return mapped age range data`, async () => {

    const wrapper = ({ children }: { children: [] }) => (
        <MockedProvider
            mocks={mocks}
            addTypename={false}>
            {children}
        </MockedProvider>
    );

    const { result, waitFor } = renderHook(() => useGetTableFilters(mockOrganizationId, {
        queryAgeRanges: true,
    }), {
        wrapper,
    });

    await waitFor(() => {
        expect(result.current.ageRangesHighValueOptions).toHaveLength(2);
        expect(result.current.ageRangesLowValueOptions).toHaveLength(3);
        expect(result.current.ageRangesHighValueOptions[0].value).toBe(`5 year`);
        expect(result.current.ageRangesLowValueOptions[0].value).toBe(`0 year`);
        expect(result.current.ageRangesLowValueOptions[1].value).toBe(`1 year`);
        expect(result.current.ageRangesHighValueOptions[0].label).toBe(`5 Year(s)`);
        expect(result.current.ageRangesLowValueOptions[0].label).toBe(`0 Year(s)`);
        expect(result.current.ageRangesLowValueOptions[1].label).toBe(`1 Year(s)`);
    });
});
