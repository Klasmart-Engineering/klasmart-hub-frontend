import Programs from './Programs';
import {
    GetAllProgramsPaginatedRequest,
    GetAllProgramsPaginatedResponse,
    useGetAllPaginatedPrograms,
} from '@/api/programs';
import {
    buildGradeFilter,
    GET_PAGINATED_ORGANIZATION_GRADES_LIST,
} from "@/operations/queries/getOrganizationGrades";
import {
    buildOrganizationAgeRangeFilter,
    GET_PAGINATED_AGE_RANGES,
} from "@/operations/queries/getPaginatedAgeRanges";
import { Status } from "@/types/graphQL";
import { useGetTableFilters } from "@/utils/filters";
import { QueryResult } from '@apollo/client';
import {
    MockedProvider,
    MockedResponse,
} from "@apollo/client/testing";
import {
    screen,
    waitFor,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { mockPaginatedAgeRanges } from "@tests/mockDataAgeRanges";
import {
    mockOrgId,
    mockPaginatedGrades,
} from "@tests/mockDataGrades";
import {
    mockProgramsSchoolTable,
    programA,
    programB,
    programC,
    programIdA,
} from "@tests/mockDataPrograms";
import { render } from "@tests/utils/render";
import React from "react";

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_GRADES_LIST,
            variables: {
                direction: `FORWARD`,
                count: 50,
                orderBy: `name`,
                order: `ASC`,
                filter: buildGradeFilter({
                    organizationId: mockOrgId,
                    search: ``,
                    filters: [],
                }),
            },
        },
        result: {
            data: mockPaginatedGrades,
        },
    },
    {
        request: {
            query: GET_PAGINATED_AGE_RANGES,
            variables: {
                direction: `FORWARD`,
                count: 50,
                orderBy: [ `lowValueUnit`, `lowValue` ],
                order: `ASC`,
                filter: buildOrganizationAgeRangeFilter({
                    organizationId: mockOrgId,
                    filters: [],
                }),
            },
        },
        result: {
            data: mockPaginatedAgeRanges,
        },
    },
];

jest.mock(`@/api/programs`, () => {
    return {
        ...jest.requireActual(`@/api/programs`),
        useGetAllPaginatedPrograms: jest.fn(),
    };
});

beforeAll(() => {
    (useGetAllPaginatedPrograms as jest.MockedFunction<typeof useGetAllPaginatedPrograms>).mockReturnValue({
        data: mockProgramsSchoolTable,
        refetch: jest.fn(),
    } as unknown as QueryResult<GetAllProgramsPaginatedResponse, GetAllProgramsPaginatedRequest>);
});

test(`useGetTableFilters hook should return mapped grades for drop down filter in programs table.`, async () => {
    const wrapper = ({ children }: { children: [] }) => (
        <MockedProvider
            mocks={mocks}
            addTypename={false}>
            {children}
        </MockedProvider>
    );

    const { result, waitFor } = renderHook(() => useGetTableFilters(mockOrgId, {
        queryGrades: true,
        queryAgeRanges: true,
    }), {
        wrapper,
    });

    await waitFor(() => {
        expect(result.current.gradeFilterValueOptions).toHaveLength(2);
        expect(result.current.gradeFilterValueOptions[0].label).toBe(`Grade 2`);
        expect(result.current.gradeFilterValueOptions[1].label).toBe(`Grade 3`);
        expect(result.current.ageRangesLowValueOptions).toHaveLength(3);
        expect(result.current.ageRangesHighValueOptions).toHaveLength(2);
    });
});

describe(`Programs school create / edit`, () => {
    const component = <Programs
        value={{
            id: `abc123`,
            name: `ABC school`,
            status: Status.ACTIVE,
            shortcode: `abc`,
            programIds: [ programIdA ],
        }}
        onChange={jest.fn()}
    />;

    describe(`Render`, () => {
        test(`Data renders correctly`, async () => {
            render(component, {
                mockedResponses: mocks,
            });

            await waitFor(() => {
                expect(screen.queryByText(programA.node.name)).toBeInTheDocument();
                expect(screen.queryByText(programB.node.name)).toBeInTheDocument();
                expect(screen.queryByText(programC.node.name)).toBeInTheDocument();
            });

        });
    });
});
