import EditSchool from './Edit';
import {
    GetAllProgramsPaginatedRequest,
    GetAllProgramsPaginatedResponse,
    useGetAllPaginatedPrograms,
} from '@/api/programs';
import { mockIntl } from '@/locale/__mocks__/locale';
import { GET_SCHOOL_NODE } from '@/operations/queries/getSchoolNode';
import { QueryResult } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import {
    screen,
    waitFor,
} from '@testing-library/react';
import { mockProgramsSchoolSummary } from '@tests/mockDataPrograms';
import {
    mockSchoolId1,
    singleSchoolNode,
} from '@tests/mockDataSchools';
import { render } from "@tests/utils/render";
import React from 'react';

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

jest.mock(`@/api/programs`, () => {
    return {
        ...jest.requireActual(`@/api/programs`),
        useGetAllPaginatedPrograms: jest.fn(),
    };
});

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_SCHOOL_NODE,
            variables: {
                id: mockSchoolId1,
                programCount: 50,
            },
        },
        result: {
            data: singleSchoolNode,
        },
    },
];

beforeAll(() => {
    (useGetAllPaginatedPrograms as jest.MockedFunction<typeof useGetAllPaginatedPrograms>).mockReturnValue({
        data: mockProgramsSchoolSummary,
        refetch: jest.fn(),
    } as unknown as QueryResult<GetAllProgramsPaginatedResponse, GetAllProgramsPaginatedRequest>);
});

const inputs = {
    schoolName: () => {
        return screen.getByLabelText(mockIntl.formatMessage({
            id: `schools_schoolNameLabel`,
        }));
    },
    shortCode: () => {
        return screen.getByLabelText(mockIntl.formatMessage({
            id: `common.inputField.optional`,
        }, {
            inputField: mockIntl.formatMessage({
                id: `schools_shortCodeLabel`,
            }),
        }));
    },
};

describe(`School edit`, () => {
    test(`School edit dialog renders correctly with correct data`, async () => {
        render(<EditSchool
            open={true}
            schoolId={mockSchoolId1}
            onClose={jest.fn()}/>, {
            mockedResponses: mocks,
        });
        await waitFor(() => {
            expect(inputs.schoolName()).toHaveValue(singleSchoolNode.schoolNode.name);
            expect(inputs.shortCode()).toHaveValue(singleSchoolNode.schoolNode.shortCode);
        });
    });
});
