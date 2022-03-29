import ClassTable from "./Table";
import {
    buildGradeFilter,
    GET_PAGINATED_ORGANIZATION_GRADES_LIST,
} from "@/operations/queries/getOrganizationGrades";
import {
    buildOrganizationProgramFilter,
    GET_PAGINATED_ORGANIZATION_PROGRAMS_LIST,
} from "@/operations/queries/getPaginatedOrganizationPrograms";
import {
    buildOrganizationSchoolFilter,
    GET_PAGINATED_ORGANIZATION_SCHOOLS,
} from "@/operations/queries/getPaginatedOrganizationSchools";
import { mapClassNodeToClassRow } from "@/utils/classes";
import { useGetTableFilters } from "@/utils/filters";
import { MockedProvider } from "@apollo/client/testing/";
import {
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { mockClasses } from "@tests/mockDataClasses";
import {
    grade2Id,
    grade2Name,
    grade3Id,
    grade3Name,
    mockPaginatedGradesList,
} from "@tests/mockDataGrades";
import {
    mockProgramsFilterList,
    programIdA,
    programIdB,
    programIdC,
    programIdD,
    programNameA,
    programNameB,
    programNameC,
    programNameD,
} from "@tests/mockDataPrograms";
import {
    mockSchoolId1,
    mockSchoolId2,
    mockSchoolName1,
    mockSchoolName2,
    mockSchoolsData,
} from "@tests/mockDataSchools";
import { render } from "@tests/utils/render";
import React from "react";

const mockOrgId = `c19de3cc-aa01-47f5-9f87-850eb70ae073`;

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            id: mockOrgId,
        }),
    };
});

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

const rows = mockClasses.edges?.map(mapClassNodeToClassRow) ?? [];

const mocks = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_SCHOOLS,
            variables: {
                direction: `FORWARD`,
                count: 50,
                order: `ASC`,
                orderBy: `name`,
                filter: buildOrganizationSchoolFilter({
                    organizationId: mockOrgId,
                    search: ``,
                }),
            },
        },
        result: {
            data: mockSchoolsData,
        },
    },
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_PROGRAMS_LIST,
            variables: {
                direction: `FORWARD`,
                count: 50,
                order: `ASC`,
                orderBy: `name`,
                filter: buildOrganizationProgramFilter({
                    organizationId: mockOrgId,
                    search: ``,
                    filters: [],
                }),
            },
        },
        result: {
            data: mockProgramsFilterList,
        },
    },
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
            data: mockPaginatedGradesList,
        },
    },
];

test(`Class table renders without records`, async () => {
    render(<ClassTable rows={[]} />);

    await waitFor(() => {
        expect(screen.queryByText(`Classes`)).toBeInTheDocument();
        expect(screen.queryByText(`No records to display`)).toBeInTheDocument();
    });
});

test(`Class table renders with records`, async () => {
    render(<ClassTable rows={rows} />);

    await waitFor(() => {
        expect(screen.queryByText(`Classes`)).toBeInTheDocument();
        expect(screen.queryByText(`Class Grade 2`)).toBeInTheDocument();
    });
});

test(`useClassFilters hook should return mapped schools data for filter drop down in classes`, async () => {
    const wrapper = ({ children }: { children: [] }) => (
        <MockedProvider
            mocks={mocks}
            addTypename={false}
        >
            {children}
        </MockedProvider>
    );

    const { result, waitFor } = renderHook(() => useGetTableFilters(mockOrgId, {
        querySchools: true,
    }), {
        wrapper,
    });

    await waitFor(() => {
        expect(result.current.schoolsFilterValueOptions).toHaveLength(2);
        expect(result.current.schoolsFilterValueOptions[0].label).toBe(mockSchoolName1);
        expect(result.current.schoolsFilterValueOptions[1].label).toBe(mockSchoolName2);
        expect(result.current.schoolsFilterValueOptions[0].value).toBe(mockSchoolId1);
        expect(result.current.schoolsFilterValueOptions[1].value).toBe(mockSchoolId2);
    });
});

test(`useClassFilters hook should return mapped programs data for filter drop down in classes`, async () => {
    const wrapper = ({ children }: { children: [] }) => (
        <MockedProvider
            mocks={mocks}
            addTypename={false}
        >
            {children}
        </MockedProvider>
    );

    const { result, waitFor } = renderHook(() => useGetTableFilters(mockOrgId, {
        queryPrograms: true,
    }), {
        wrapper,
    });

    await waitFor(() => {
        expect(result.current.programsFilterValueOptions).toHaveLength(4);
        expect(result.current.programsFilterValueOptions[0].label).toBe(programNameA);
        expect(result.current.programsFilterValueOptions[0].value).toBe(programIdA);
        expect(result.current.programsFilterValueOptions[1].label).toBe(programNameB);
        expect(result.current.programsFilterValueOptions[1].value).toBe(programIdB);
        expect(result.current.programsFilterValueOptions[2].label).toBe(programNameC);
        expect(result.current.programsFilterValueOptions[2].value).toBe(programIdC);
        expect(result.current.programsFilterValueOptions[3].label).toBe(programNameD);
        expect(result.current.programsFilterValueOptions[3].value).toBe(programIdD);
    });
});

test(`useClassFilters hook should return mapped grades data for filter drop down in classes`, async () => {
    const wrapper = ({ children }: { children: [] }) => (
        <MockedProvider
            mocks={mocks}
            addTypename={false}
        >
            {children}
        </MockedProvider>
    );

    const { result, waitFor } = renderHook(() => useGetTableFilters(mockOrgId, {
        queryGrades: true,
    }), {
        wrapper,
    });

    await waitFor(() => {
        expect(result.current.gradeFilterValueOptions).toHaveLength(2);
        expect(result.current.gradeFilterValueOptions[0].label).toBe(grade2Name);
        expect(result.current.gradeFilterValueOptions[0].value).toBe(grade2Id);
        expect(result.current.gradeFilterValueOptions[1].label).toBe(grade3Name);
        expect(result.current.gradeFilterValueOptions[1].value).toBe(grade3Id);
    });
});

test(`Class page filter dropdown opens`, async () => {
    render(<ClassTable rows={[]} />, {
        mockedResponses: mocks,
    });

    await waitFor(() => {
        expect(screen.queryAllByText(`Schools`)).toHaveLength(2);
        expect(screen.queryByText(`Column`)).toBeFalsy();
    });

    fireEvent.click(screen.getByText(`Add Filter`));

    await waitFor(() => {
        expect(screen.queryAllByText(`Schools`)).toHaveLength(3);
        expect(screen.queryAllByText(`Schools`, {
            selector: `span`,
        })).toHaveLength(1);
        expect(screen.queryAllByText(`Column`).length).toBeTruthy();
    });

    const schoolOption = await screen.findByText(`Schools`, {
        selector: `span `,
    });

    const mockDropdownClick = jest.fn();
    schoolOption.addEventListener(`click`, mockDropdownClick);

    fireEvent.click(schoolOption, {
        bubbles: true,
    });

    await waitFor(() => {
        expect(mockDropdownClick).toHaveBeenCalledTimes(1);
    });
});
