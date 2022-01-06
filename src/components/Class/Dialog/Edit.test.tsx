import EditClassDialog from "@/components/Class/Dialog/Edit";
import { GET_CLASS } from "@/operations/queries/getClass";
import { GET_PAGINATED_ORGANIZATION_GRADES_LIST } from "@/operations/queries/getOrganizationGrades";
import { GET_PAGINATED_AGE_RANGES } from "@/operations/queries/getPaginatedAgeRanges";
import {
    buildSchoolIdFilter,
    GET_PAGINATED_ORGANIZATION_PROGRAMS,
} from "@/operations/queries/getPaginatedOrganizationPrograms";
import { GET_PAGINATED_ORGANIZATION_SCHOOLS } from "@/operations/queries/getPaginatedOrganizationSchools";
import { GET_PAGINATED_ORGANIZATION_SUBJECTS } from "@/operations/queries/getPaginatedOrganizationSubjects";
import { Status } from "@/types/graphQL";
import { buildProgramIdFilter } from "@/utils/sharedFilters";
import { MockedResponse } from "@apollo/client/testing";
import {
    screen,
    waitFor,
} from "@testing-library/react";
import {
    ageRangeId2,
    mockPaginatedAgeRanges,
} from "@tests/mockDataAgeRanges";
import {
    mockClass,
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
    mockSubjectsConnection,
    subjectA,
} from "@tests/mockDataSubjects";
import { render } from "@tests/utils/render";
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
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_SCHOOLS,
            variables: {
                direction: `FORWARD`,
                count: 50,
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
            data: mockSubjectsConnection,
        },
    },
];

test(`Class edit component renders with correct information`, async () => {
    render(<EditClassDialog
        open={true}
        classId={mockClassId}
        onClose={(() => jest.fn())}
    />, {
        mockedResponses: mocks,
    });

    expect(screen.queryByText(`Edit class`)).toBeInTheDocument();
    expect(screen.queryAllByText(`Class name`).length).toBeTruthy();

    await waitFor(() => {
        expect(screen.getByDisplayValue(`Demo Class`)).toBeInTheDocument();
        expect(screen.queryByText(mockSchoolName2)).toBeInTheDocument();
        expect(screen.getByTestId(`Schools (optional)SelectTextInput`)?.value).toBe(mockSchoolId2);
        expect(screen.queryByText(programNameA)).toBeInTheDocument();
        expect(screen.getByTestId(`Program (optional)SelectTextInput`)?.value).toBe(programIdA);
    });

    await waitFor(() => {
        expect(screen.queryByText(`1 - 5 Year(s)`)).toBeInTheDocument();
        expect(screen.getByTestId(`Age range (optional)SelectTextInput`)?.value).toBe(ageRangeId2);
        expect(screen.queryByText(grade2Name)).toBeInTheDocument();
        expect(screen.getByTestId(`Grade (optional)SelectTextInput`)?.value).toBe(grade2Id);
        expect(screen.queryByText(subjectA)).toBeInTheDocument();
        expect(screen.getByTestId(`Subjects (optional)SelectTextInput`)?.value).toBe(mathId1);
    });
});
