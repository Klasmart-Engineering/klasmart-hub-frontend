import {
    Grade,
    Status,
} from "@/types/graphQL";
import { makeVar } from "@apollo/client";

export const mockOrgId = `b19de3cc-aa01-47f5-9f87-850eb70ae073`;
export const grade1Id = `p19de3cc-aa01-47f5-9f87-850eb70ae071`;
export const grade2Id = `p19de3cc-aa01-47f5-9f87-850eb70ae072`;
export const grade3Id = `048000ea-e503-4ef4-87f0-78e893ffb4ac`;
export const grade4Id = `p19de3cc-aa01-47f5-9f87-850eb70ae074`;
export const grade1Name = `Grade 1`;
export const grade3Name = `Grade 3`;

export const grades: Grade[] = [
    {
        id: grade1Id,
        name: grade1Name,
        progress_from_grade: null,
        progress_to_grade: null,
        system: false,
        status: Status.ACTIVE,
    },
    {
        id: grade2Id,
        name: `Grade 2`,
        progress_from_grade: {
            id: grade1Id,
            name: `Grade 1`,
        },
        progress_to_grade: {
            id: grade3Id,
            name: `Grade 3`,
        },
        system: false,
        status: Status.ACTIVE,
    },
    {
        id: grade3Id,
        name: `Grade 3`,
        progress_from_grade: null,
        progress_to_grade: null,
        system: false,
        status: Status.ACTIVE,
    },
    {
        id: grade4Id,
        name: `Grade 4`,
        progress_from_grade: null,
        progress_to_grade: null,
        system: true,
        status: Status.INACTIVE,
    },
];

export const mockGrade: Grade = {
    id: grade2Id,
    name: `Grade 2`,
    progress_from_grade: {
        id: grade1Id,
        name: `Grade 1`,
        progress_from_grade: null,
        progress_to_grade: null,
        system: false,
        status: Status.ACTIVE,
    },
    progress_to_grade: {
        id: grade3Id,
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
                    id: grade2Id,
                    name: `Grade 2`,
                    status: `active`,
                    system: false,
                    toGrade: null,
                    fromGrade: null,
                },
            },
            {
                node: {
                    id: grade3Id,
                    name: grade3Name,
                    status: `active`,
                    system: false,
                    toGrade: {
                        id: grade4Id,
                        name: `Grade 4`,
                        status: `active`,
                        system: true,
                    },
                    fromGrade: {
                        id: grade2Id,
                        name: `Grade 2`,
                        status: `active`,
                        system: true,
                    },
                },
            },
        ],
        pageInfo: {
            endCursor: grade3Id,
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: ``,
        },
        totalCount: 1,
    },
};

export const gradesVar = makeVar(mockPaginatedGrades.gradesConnection);
