import EditClassDialog from "@/components/Class/Dialog/Edit";
import { GET_CLASS_NODE_CONNECTIONS } from "@/operations/queries/getClassNode";
import { GET_PAGINATED_ORGANIZATION_GRADES_LIST } from "@/operations/queries/getOrganizationGrades";
import { GET_PAGINATED_AGE_RANGES } from "@/operations/queries/getPaginatedAgeRanges";
import {
    buildSchoolIdFilter,
    GET_PAGINATED_ORGANIZATION_PROGRAMS,
} from "@/operations/queries/getPaginatedOrganizationPrograms";
import { GET_PAGINATED_ORGANIZATION_SCHOOLS } from "@/operations/queries/getPaginatedOrganizationSchools";
import { GET_PAGINATED_ORGANIZATION_SUBJECTS } from "@/operations/queries/getPaginatedOrganizationSubjects";
import { Status } from "@/types/graphQL";
import {
    mapEdgeToIdString,
    useGetClassFormSelectedValues,
} from "@/utils/classFormSelectedValues";
import { buildProgramIdFilter } from "@/utils/sharedFilters";
import { MockedResponse } from "@apollo/client/testing";
import { screen } from "@testing-library/react";
import {
    ageRangeId2,
    mockPaginatedAgeRanges,
} from "@tests/mockDataAgeRanges";
import {
    mockClassConnections,
    mockClassId,
    mockOrgId,
    mockUserId,
} from "@tests/mockDataClasses";
import {
    grade2Id,
    grade2Name,
    mockPaginatedGradesList,
} from "@tests/mockDataGrades";
import {
    mockProgramsConnection,
    programIdA,
    programNameA,
} from "@tests/mockDataPrograms";
import {
    mockSchoolId2,
    mockSchoolName2,
    mockSchoolsData,
} from "@tests/mockDataSchools";
import {
    mathId1,
    mockSubjects,
    subjectA,
} from "@tests/mockDataSubjects";
import { render } from "@tests/utils/render";
import React from 'react';

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

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_CLASS_NODE_CONNECTIONS,
            variables: {
                id: mockClassId,
            },
        },
        result: {
            data: mockClassConnections,
        },
    },
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_SCHOOLS,
            variables: {
                direction: `FORWARD`,
                count: 50,
                orderBy: `name`,
                order: `ASC`,
                filter: {
                    status: {
                        operator: `eq`,
                        value: Status.ACTIVE,
                    },
                },
            },
        },
        result: {
            data: mockSchoolsData,
        },
    },
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_PROGRAMS,
            variables: {
                direction: `FORWARD`,
                count: 50,
                order: `ASC`,
                orderBy: `name`,
                filter: buildSchoolIdFilter([ mockSchoolId2 ]),
            },
        },
        result: {
            data: mockProgramsConnection,
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
                filter: buildProgramIdFilter([ programIdA ]),
            },
        },

        result: {
            data: mockPaginatedAgeRanges,
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
                filter: buildProgramIdFilter([ programIdA ]),
            },
        },
        result: {
            data: mockPaginatedGradesList,
        },
    },
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_SUBJECTS,
            variables: {
                direction: `FORWARD`,
                count: 50,
                orderBy: `name`,
                order: `ASC`,
                filter: buildProgramIdFilter([ programIdA ]),
            },
        },
        result: {
            data: {
                subjectsConnection: mockSubjects,
            },
        },
    },
];

jest.mock(`@/utils/classFormSelectedValues`, () => {
    return {
        ...jest.requireActual(`@/utils/classFormSelectedValues`),
        useGetClassFormSelectedValues: jest.fn(),
    };
});

beforeAll(() => {
    (useGetClassFormSelectedValues as jest.MockedFunction<typeof useGetClassFormSelectedValues>).mockReturnValue({
        data: {
            id: mockClassConnections.classNode.id,
            name: mockClassConnections.classNode.name,
            status: mockClassConnections.classNode.status,
            schools: mockClassConnections.classNode.schoolsConnection.edges.map(mapEdgeToIdString),
            programs: mockClassConnections.classNode.programsConnection.edges.map(mapEdgeToIdString),
            subjects: mockClassConnections.classNode.subjectsConnection.edges.map(mapEdgeToIdString),
            grades: mockClassConnections.classNode.gradesConnection.edges.map(mapEdgeToIdString),
            ageRanges: mockClassConnections.classNode.ageRangesConnection.edges.map(mapEdgeToIdString),
        },
        refetch: jest.fn(),
        loading: false,
    });
});

test(`Class edit component renders with correct information`, async () => {
    render(<EditClassDialog
        open
        classId={mockClassId}
        onClose={(() => jest.fn())}
           />, {
        mockedResponses: mocks,
    });

    expect(screen.getByText(`Edit class`)).toBeInTheDocument();
    expect(screen.getAllByText(`Class name`).length).toBeTruthy();
    expect(await screen.findByDisplayValue(`Demo Class`)).toBeInTheDocument();
    expect(await screen.findByText(mockSchoolName2)).toBeInTheDocument();
    expect(await screen.findByText(programNameA)).toBeInTheDocument();
    expect(await screen.findByText(`1 - 5 Year(s)`)).toBeInTheDocument();
    expect(await screen.findByText(grade2Name)).toBeInTheDocument();
    expect(await screen.findByText(subjectA)).toBeInTheDocument();

    const schools = await screen.findByTestId(`Schools (optional)SelectTextInput`);
    expect(schools?.value).toBe(mockSchoolId2);
    const programs = await screen.findByTestId(`Program (optional)SelectTextInput`);
    expect(programs?.value).toBe(programIdA);
    const ageRanges = await screen.findByTestId(`Age range (optional)SelectTextInput`);
    expect(ageRanges?.value).toBe(ageRangeId2);
    const grades = await screen.findByTestId(`Grade (optional)SelectTextInput`);
    expect(grades?.value).toBe(grade2Id);
    const subjects = await screen.findByTestId(`Subjects (optional)SelectTextInput`);
    expect(subjects?.value).toBe(mathId1);
});
