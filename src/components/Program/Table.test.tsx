import { ProgramEdge } from "@/api/programs";
import ProgramTable,
{ organizationProgram } from "@/components/Program/Table";
import { DELETE_PROGRAM } from "@/operations/mutations/deleteProgram";
import { GET_PAGINATED_ORGANIZATION_PROGRAMS } from "@/operations/queries/getPaginatedOrganizationPrograms";
import { Status } from "@/types/graphQL";
import { getLanguage } from "@/utils/locale";
import { isUUID } from "@/utils/pagination";
import { MockedResponse } from "@apollo/client/testing";
import {
    act,
    screen,
    waitFor,
} from "@testing-library/react";
import { grade1Name } from "@tests/mockDataGrades";
import qlRender from "@tests/utils";
import { utils } from "kidsloop-px";
import React from "react";

const organizationId = `c19de3cc-aa01-47f5-9f87-850eb70ae073`;
const programIdA = `7a8c5021-142b-44b1-b60b-275c29d132fe`;
const programIdB = `93f293e8-2c6a-47ad-bc46-1554caac99e4`;
const programIdC = `56e24fa0-e139-4c80-b365-61c9bc42cd3f`;
const programIdD = `d1bbdcc5-0d80-46b0-b98e-162e7439058f`;
const inputSearch = `Bada Read`;
let deleteCalled = true;

const programA: ProgramEdge = {
    node: {
        id: programIdA,
        name: `Bada Read`,
        status: `active`,
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

const programB: ProgramEdge = {
    node: {
        id: programIdB,
        name: `Bada Rhyme`,
        status: `active`,
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

const programC: ProgramEdge = {
    node: {
        id: programIdC,
        name: `Bada Sound`,
        status: `active`,
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

const programD: ProgramEdge = {
    node: {
        id: programIdD,
        name: `Bada STEM`,
        status: `active`,
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

const programs: ProgramEdge[] = [
    programA,
    programB,
    programC,
    programD,
];

test(`should create an array of objects that conforms the Programs Table ProgramRow interface`, () => {
    const rows = programs.filter((status) => status.node.status === `active`).map(organizationProgram);

    const final = [
        {
            id: `7a8c5021-142b-44b1-b60b-275c29d132fe`,
            name: `Bada Read`,
            grades: [ `None Specified` ],
            ageRanges: [
                `5 - 6 Year(s)`,
                `7 - 8 Year(s)`,
                `3 - 4 Year(s)`,
                `4 - 5 Year(s)`,
            ],
            subjects: [ `Language/Literacy` ],
            system: true,
        },
        {
            id: `93f293e8-2c6a-47ad-bc46-1554caac99e4`,
            name: `Bada Rhyme`,
            grades: [ `None Specified` ],
            ageRanges: [
                `5 - 6 Year(s)`,
                `3 - 4 Year(s)`,
                `4 - 5 Year(s)`,
            ],
            subjects: [ `Language/Literacy` ],
            system: true,
        },
        {
            id: `56e24fa0-e139-4c80-b365-61c9bc42cd3f`,
            name: `Bada Sound`,
            grades: [ `None Specified` ],
            ageRanges: [
                `5 - 6 Year(s)`,
                `7 - 8 Year(s)`,
                `3 - 4 Year(s)`,
                `4 - 5 Year(s)`,
            ],
            subjects: [ `Language/Literacy` ],
            system: true,
        },
        {
            id: `d1bbdcc5-0d80-46b0-b98e-162e7439058f`,
            name: `Bada STEM`,
            grades: [
                `PreK-1`,
                `PreK-2`,
                `K`,
                `Grade 1`,
                `Grade 2`,
            ],
            ageRanges: [
                `5 - 6 Year(s)`,
                `6 - 7 Year(s)`,
                `7 - 8 Year(s)`,
                `3 - 4 Year(s)`,
                `4 - 5 Year(s)`,
            ],
            subjects: [ `Science` ],
            system: true,
        },
    ];

    expect(rows).toEqual(final);
});

test(`should return an empty array`, () => {
    const rows = [].map(organizationProgram);

    expect(rows).toEqual([]);
});

test(`should return a truthy boolean if is a well formed UUID`, () => {
    expect(isUUID(organizationId)).toBeTruthy();
    expect(isUUID(programIdA)).toBeTruthy();
    expect(isUUID(programIdB)).toBeTruthy();
    expect(isUUID(programIdC)).toBeTruthy();
    expect(isUUID(programIdD)).toBeTruthy();
    expect(isUUID(inputSearch)).toBeFalsy();
});

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_PROGRAMS,
            variables: {
                direction: `FORWARD`,
                count: 10,
                organizationId: organizationId,
                orderBy: `name`,
                order: `ASC`,
                cursor: null,
                filter: [
                    {
                        name: {
                            operator: `contains`,
                            caseInsensitive: true,
                            value: ``,
                        },
                    },
                ],
            },
        },
        result: {
            data: {
                programsConnection: {
                    totalCount: 4,
                    pageInfo: {
                        hasNextPage: true,
                        hasPreviousPage: false,
                        startCursor: ``,
                        endCursor: ``,
                    },
                    edges: programs,
                },
            },
        },
        newData: () => {
            if (deleteCalled) {
                return {
                    data: {
                        programsConnection: {
                            totalCount: 3,
                            pageInfo: {
                                hasNextPage: false,
                                hasPreviousPage: false,
                                startCursor: ``,
                                endCursor: ``,
                            },
                            edges: programs.filter((program) => program.node.id !== programIdC),
                        },
                    },
                };
            }

            return {
                data: {
                    programsConnection: {
                        totalCount: 4,
                        pageInfo: {
                            hasNextPage: false,
                            hasPreviousPage: false,
                            startCursor: ``,
                            endCursor: ``,
                        },
                        edges: programs,
                    },
                },
            };
        },
    },
    {
        request: {
            query: DELETE_PROGRAM,
            variables: {
                id: programIdD,
            },
        },
        result: () => {
            deleteCalled = true;
            return {};
        },
    },
];

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            organization_id: organizationId,
        }),
        useCurrentOrganizationMembership: () => ({
            organization_id: organizationId,
        }),
    };
});

jest.mock(`@/utils/checkAllowed`, () => {
    return {
        ...jest.requireActual(`@/utils/checkAllowed`),
        usePermission: () => true,
    };
});

test(`Programs table page renders data`, async () => {
    const locale = getLanguage(`en`);
    const { findByText, queryAllByText } = qlRender(mocks, locale, <ProgramTable />);

    await act(async () => {
        const title = await screen.findByText(`Programs`);

        const noRecords = await findByText(`No records to display`);
        await waitFor(() => {
            expect(title).toBeTruthy();
            expect(noRecords).toBeTruthy();
        });

        await utils.sleep(0);

        await waitFor(() => {
            expect(queryAllByText(`Bada Read`)).toBeTruthy();
            expect(queryAllByText(`Bada Rhyme`)).toBeTruthy();
            expect(queryAllByText(`Bada Sound`)).toBeTruthy();
        });
    });
});

test(`Programs table properly updates records after delete`, async () => {
    const locale = getLanguage(`en`);
    const {
        findAllByTitle,
        queryByText,
        queryAllByText,
    } = await qlRender(mocks, locale, <ProgramTable />);

    await act(async () => {
        await utils.sleep(0);

        const deleteSpan = await queryByText(`Delete`);

        deleteSpan?.click();

        await waitFor(() => {
            expect(queryAllByText(grade1Name).length).toBeLessThan(2);
        });

        const rowsUpdate = await findAllByTitle(`More actions`);

        await waitFor(() => {
            expect(rowsUpdate.length).toEqual(3);
        });
    });
});

test(`Programs table properly paginates when Next Page is clicked`, async () => {
    const locale = getLanguage(`en`);
    const { findAllByTitle, queryByText } = await qlRender(mocks, locale, <ProgramTable />);

    await act(async () => {
        await utils.sleep(0);
        const rows = await findAllByTitle(`Next Page`);

        await waitFor(() => {
            expect(queryByText(`Next Page`)).toBeNull();
        });

        await waitFor(() => {
            rows[0].click();
        });

        const nextSpan = await queryByText(`Next Page`);

        await waitFor(() => {
            nextSpan?.click();
        });

        await waitFor(() => {
            expect(rows.length).toEqual(1);
        });
    });
});

const searchMock: MockedResponse[] = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_PROGRAMS,
            variables: {
                direction: `FORWARD`,
                count: 10,
                organizationId: organizationId,
                orderBy: `name`,
                order: `ASC`,
                cursor: null,
                filter: [
                    {
                        name: {
                            operator: `contains`,
                            caseInsensitive: true,
                            value: ``,
                        },
                    },
                ],
            },
        },
        result: {
            data: {
                programsConnection: {
                    totalCount: 1,
                    pageInfo: {
                        hasNextPage: false,
                        hasPreviousPage: false,
                        startCursor: ``,
                        endCursor: ``,
                    },
                    edges: programs.filter((program) => program.node.name === inputSearch),
                },
            },
        },
    },
];

test(`Programs table properly paginates when search input is used`, async () => {
    const locale = getLanguage(`en`);
    const { findAllByTitle } = qlRender(searchMock, locale, <ProgramTable />);

    await act(async () => {
        await utils.sleep(0);
        const title = await screen.findByText(`Programs`);
        const rows = await findAllByTitle(`More actions`);

        await waitFor(() => {
            expect(title).toBeTruthy();
        });

        await utils.sleep(0);

        await waitFor(() => {
            expect(rows.length).toEqual(1);
        });
    });
});
