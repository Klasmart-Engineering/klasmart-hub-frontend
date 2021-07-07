import {
    Grade,
    Status,
} from "@/types/graphQL";
import { makeVar } from "@apollo/client";

export const mockOrgId = `b19de3cc-aa01-47f5-9f87-850eb70ae073`;
export const grade1 = `p19de3cc-aa01-47f5-9f87-850eb70ae071`;
export const grade2 = `p19de3cc-aa01-47f5-9f87-850eb70ae072`;
export const grade3 = `048000ea-e503-4ef4-87f0-78e893ffb4ac`;
export const grade4 = `p19de3cc-aa01-47f5-9f87-850eb70ae074`;
export const grade1Name = `Grade 1`;
export const grade3Name = `Grade 3`;

export const grades: Grade[] = [
    {
        id: grade1,
        name: grade1Name,
        progress_from_grade: null,
        progress_to_grade: null,
        system: false,
        status: Status.ACTIVE,
    },
    {
        id: grade2,
        name: `Grade 2`,
        progress_from_grade: {
            id: grade1,
            name: `Grade 1`,
            progress_from_grade: null,
            progress_to_grade: null,
            system: false,
            status: Status.ACTIVE,
        },
        progress_to_grade: {
            id: grade3,
            name: `Grade 3`,
            progress_from_grade: null,
            progress_to_grade: null,
            system: false,
            status: Status.ACTIVE,
        },
        system: false,
        status: Status.ACTIVE,
    },
    {
        id: grade3,
        name: `Grade 3`,
        progress_from_grade: null,
        progress_to_grade: null,
        system: false,
        status: Status.ACTIVE,
    },
    {
        id: grade4,
        name: `Grade 4`,
        progress_from_grade: null,
        progress_to_grade: null,
        system: true,
        status: Status.INACTIVE,
    },
];

export const mockGrade: Grade = {
    id: grade2,
    name: `Grade 2`,
    progress_from_grade: {
        id: grade1,
        name: `Grade 1`,
        progress_from_grade: null,
        progress_to_grade: null,
        system: false,
        status: Status.ACTIVE,
    },
    progress_to_grade: {
        id: grade3,
        name: `Grade 3`,
        progress_from_grade: null,
        progress_to_grade: null,
        system: false,
        status: Status.ACTIVE,
    },
    system: false,
    status: Status.ACTIVE,
};

export const mockPaginatedGrades = {
    gradesConnection: {
        edges: [
            {
                node: {
                    id: grade2,
                    name: `Grade 2`,
                    status: `active`,
                    system: false,
                    toGrade: null,
                    fromGrade: null,
                },
            },
            {
                node: {
                    id: grade3,
                    name: grade3Name,
                    status: `active`,
                    system: false,
                    toGrade: {
                        id: grade4,
                        name: `Grade 4`,
                        status: `active`,
                        system: true,
                    },
                    fromGrade: {
                        id: grade2,
                        name: `Grade 2`,
                        status: `active`,
                        system: true,
                    },
                },
            },
        ],
        pageInfo: {
            endCursor: grade3,
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: ``,
        },
        totalCount: 1,
    },
};

export const gradesVar = makeVar(mockPaginatedGrades.gradesConnection);
