import {
    Grade,
    Status,
} from "@/types/graphQL";

export const mockOrgId = `b19de3cc-aa01-47f5-9f87-850eb70ae073`;
export const grade1 = `p19de3cc-aa01-47f5-9f87-850eb70ae071`;
export const grade2 = `p19de3cc-aa01-47f5-9f87-850eb70ae072`;
export const grade3 = `p19de3cc-aa01-47f5-9f87-850eb70ae073`;
export const grade4 = `p19de3cc-aa01-47f5-9f87-850eb70ae074`;

export const grades: Grade[] = [
    {
        id: grade1,
        name: `Grade 1`,
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
