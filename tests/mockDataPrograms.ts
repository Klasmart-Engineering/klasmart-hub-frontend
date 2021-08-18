import { ProgramEdge } from "../src/api/programs";
import { Status } from "../src/types/graphQL";

export const mockOrganizationId = `c19de3cc-aa01-47f5-9f87-850eb70ae073`;
export const programIdA = `7a8c5021-142b-44b1-b60b-275c29d132fe`;
export const programIdB = `93f293e8-2c6a-47ad-bc46-1554caac99e4`;
export const programIdC = `56e24fa0-e139-4c80-b365-61c9bc42cd3f`;
export const programIdD = `d1bbdcc5-0d80-46b0-b98e-162e7439058f`;
export const inputSearch = `Bada Read`;
export const programNameA = `Bada Genius`;
export const programNameB = `Bada Math`;
export const programNameC = `Geometry`;
export const programNameD = `Science`;

export const programA = {
    node: {
        id: programIdA,
        name: `Bada Read`,
        status: Status.ACTIVE,
        system: true,
        ageRanges: [
            {
                id: `fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
                name: `5 - 6 year(s)`,
                highValue: 6,
                highValueUnit: `year`,
                lowValue: 5,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `21f1da64-b6c8-4e74-9fef-09d08cfd8e6c`,
                name: `7 - 8 year(s)`,
                highValue: 8,
                highValueUnit: `year`,
                lowValue: 7,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
                name: `3 - 4 year(s)`,
                highValue: 4,
                highValueUnit: `year`,
                lowValue: 3,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `bb7982cd-020f-4e1a-93fc-4a6874917f07`,
                name: `4 - 5 year(s)`,
                highValue: 5,
                highValueUnit: `year`,
                lowValue: 4,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
        subjects: [
            {
                id: `b997e0d1-2dd7-40d8-847a-b8670247e96b`,
                name: `Language/Literacy`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
        grades: [
            {
                id: `98461ca1-06a1-432a-97d0-4e1dff33e1a5`,
                name: `None Specified`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
    },
};

export const programB = {
    node: {
        id: programIdB,
        name: `Bada Rhyme`,
        status: Status.ACTIVE,
        system: true,
        ageRanges: [
            {
                id: `fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
                name: `5 - 6 year(s)`,
                highValue: 6,
                highValueUnit: `year`,
                lowValue: 5,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
                name: `3 - 4 year(s)`,
                highValue: 4,
                highValueUnit: `year`,
                lowValue: 3,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `bb7982cd-020f-4e1a-93fc-4a6874917f07`,
                name: `4 - 5 year(s)`,
                highValue: 5,
                highValueUnit: `year`,
                lowValue: 4,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
        subjects: [
            {
                id: `49c8d5ee-472b-47a6-8c57-58daf863c2e1`,
                name: `Language/Literacy`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
        grades: [
            {
                id: `98461ca1-06a1-432a-97d0-4e1dff33e1a5`,
                name: `None Specified`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
    },
};

export const programC = {
    node: {
        id: programIdC,
        name: `Bada Sound`,
        status: Status.ACTIVE,
        system: true,
        ageRanges: [
            {
                id: `fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
                name: `5 - 6 year(s)`,
                highValue: 6,
                highValueUnit: `year`,
                lowValue: 5,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `21f1da64-b6c8-4e74-9fef-09d08cfd8e6c`,
                name: `7 - 8 year(s)`,
                highValue: 8,
                highValueUnit: `year`,
                lowValue: 7,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
                name: `3 - 4 year(s)`,
                highValue: 4,
                highValueUnit: `year`,
                lowValue: 3,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `bb7982cd-020f-4e1a-93fc-4a6874917f07`,
                name: `4 - 5 year(s)`,
                highValue: 5,
                highValueUnit: `year`,
                lowValue: 4,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
        subjects: [
            {
                id: `b19f511e-a46b-488d-9212-22c0369c8afd`,
                name: `Language/Literacy`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
        grades: [
            {
                id: `98461ca1-06a1-432a-97d0-4e1dff33e1a5`,
                name: `None Specified`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
    },
};

export const programD = {
    node: {
        id: programIdD,
        name: `Bada STEM`,
        status: Status.ACTIVE,
        system: true,
        ageRanges: [
            {
                id: `fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
                name: `5 - 6 year(s)`,
                highValue: 6,
                highValueUnit: `year`,
                lowValue: 5,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `145edddc-2019-43d9-97e1-c5830e7ed689`,
                name: `6 - 7 year(s)`,
                highValue: 7,
                highValueUnit: `year`,
                lowValue: 6,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `21f1da64-b6c8-4e74-9fef-09d08cfd8e6c`,
                name: `7 - 8 year(s)`,
                highValue: 8,
                highValueUnit: `year`,
                lowValue: 7,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
                name: `3 - 4 year(s)`,
                highValue: 4,
                highValueUnit: `year`,
                lowValue: 3,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `bb7982cd-020f-4e1a-93fc-4a6874917f07`,
                name: `4 - 5 year(s)`,
                highValue: 5,
                highValueUnit: `year`,
                lowValue: 4,
                lowValueUnit: `year`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
        subjects: [
            {
                id: `29d24801-0089-4b8e-85d3-77688e961efb`,
                name: `Science`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
        grades: [
            {
                id: `d7e2e258-d4b3-4e95-b929-49ae702de4be`,
                name: `PreK-1`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `3e7979f6-7375-450a-9818-ddb09b250bb2`,
                name: `PreK-2`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `81dcbcc6-3d70-4bdf-99bc-14833c57c628`,
                name: `K`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `100f774a-3d7e-4be5-9c2c-ae70f40f0b50`,
                name: `Grade 1`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `9d3e591d-06a6-4fc4-9714-cf155a15b415`,
                name: `Grade 2`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
    },
};

export const programs: ProgramEdge[] = [
    programA,
    programB,
    programC,
    programD,
];

export const mockProgramsFilterList = {
    programsConnection: {
        edges: [
            {
                node: {
                    id: programIdA,
                    name: programNameA,
                    status: `active`,
                },
            },
            {
                node: {
                    id: programIdB,
                    name: programNameB,
                    status: `active`,
                },
            },
            {
                node: {
                    id: programIdC,
                    name: programNameC,
                    status: `active`,
                },
            },
            {
                node: {
                    id: programIdD,
                    name: programNameD,
                    status: `active`,
                },
            },
        ],
        pageInfo: {
            endCursor: `eyJpZCI6ImZiZTc1OGY2LWI3ODUtNDlkZS1iNTVlLWI5ZDQxNzM0ZTIyYyIsIm5hbWUiOiJUZXN0IFByb2dyYW0ifQ==`,
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: `eyJpZCI6ImZiZTc1OGY2LWI3ODUtNDlkZS1iNTVlLWI5ZDQxNzM0ZTIyYyIsIm5hbWUiOiJUZXN0IFByb2dyYW0ifQ==`,
        },
        totalCount: 4,
    },
};
