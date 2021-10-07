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

export const mockProgramDetailsDrawer = {
    program:{
        id: programIdA,
        name: programNameA,
        status: Status.ACTIVE,
        age_ranges:[
            {
                high_value:6,
                high_value_unit:`year`,
                id:`fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
                low_value:5,
                low_value_unit:`year`,
                name:`5 - 6 year(s)`,
                status:`active`,
                system:true,
            },
            {
                high_value:7,
                high_value_unit:`year`,
                id:`145edddc-2019-43d9-97e1-c5830e7ed689`,
                low_value:6,
                low_value_unit:`year`,
                name:`6 - 7 year(s)`,
                status:`active`,
                system:true,
            },
            {
                high_value:8,
                high_value_unit:`year`,
                id:`21f1da64-b6c8-4e74-9fef-09d08cfd8e6c`,
                low_value:7,
                low_value_unit:`year`,
                name:`7 - 8 year(s)`,
                status:`active`,
                system:true,
            },
        ],
        grades:[
            {
                id:`100f774a-3d7e-4be5-9c2c-ae70f40f0b50`,
                name:`Grade 1`,
                status:`active`,
                system:true,
            },
            {
                id:`9d3e591d-06a6-4fc4-9714-cf155a15b415`,
                name:`Grade 2`,
                status:`active`,
                system:true,
            },
        ],
        subjects:[
            {
                categories:[
                    {
                        id:`e08f3578-a7d4-4cac-b028-ef7a8c93f53f`,
                        name:`Cognitive Skills`,
                        status:`active`,
                        subcategories:[
                            {
                                id:`b32321db-3b4a-4b1e-8db9-c485d045bf01`,
                                name:`Logic & Memory`,
                                status:`active`,
                            },
                        ],
                    },
                    {
                        id:`551e59bd-7472-4dcd-b334-778d66fcdfa9`,
                        name:`Category 1`,
                        status:`active`,
                        subcategories:[
                            {
                                id:`ed85cf65-9ff7-4f9a-8b8a-5bf2a7402360`,
                                name:`Sub 1`,
                                status:`active`,
                            },
                            {
                                id:`6fb79402-2fb6-4415-874c-338c949332ed`,
                                name:`Art`,
                                status:`active`,
                            },
                            {
                                id:`e2190c0c-918d-4a05-a045-6696ae31d5c4`,
                                name:`Click`,
                                status:`active`,
                            },
                            {
                                id:`852c3495-1ced-4580-a584-9d475217f3d5`,
                                name:`Character Education`,
                                status:`active`,
                            },
                            {
                                id:`9c30644b-0e9c-43aa-a19a-442e9f6aa6ae`,
                                name:`Body Coordination`,
                                status:`active`,
                            },
                        ],
                    },
                ],
                id:`0e73997e-e2fb-4119-a56e-509dc09c163d`,
                name:`Test 1`,
                status:`active`,
                system:false,
            },
            {
                categories:[
                    {
                        id:`1080d319-8ce7-4378-9c71-a5019d6b9386`,
                        name:`Speech & Language Skills`,
                        status:`active`,
                        subcategories:[
                            {
                                id:`cd06e622-a323-40f3-8409-5384395e00d2`,
                                name:`Science`,
                                status:`active`,
                            },
                            {
                                id:`81b09f61-4509-4ce0-b099-c208e62870f9`,
                                name:`Math`,
                                status:`active`,
                            },
                            {
                                id:`39ac1475-4ade-4d0b-b79a-f31256521297`,
                                name:`Coding`,
                                status:`active`,
                            },
                            {
                                id:`2d1152a3-fb03-4c4e-aeba-98856c3241bd`,
                                name:`Vocabulary`,
                                status:`active`,
                            },
                            {
                                id:`43c9d2c5-7a23-42c9-8ad9-1132fb9c3853`,
                                name:`Colors`,
                                status:`active`,
                            },
                            {
                                id:`8d49bbbb-b230-4d5a-900b-cde6283519a3`,
                                name:`Numbers`,
                                status:`active`,
                            },
                            {
                                id:`ed88dcc7-30e4-4ec7-bccd-34aaacb47139`,
                                name:`Shapes`,
                                status:`active`,
                            },
                            {
                                id:`1cb17f8a-d516-498c-97ea-8ad4d7a0c018`,
                                name:`Letters`,
                                status:`active`,
                            },
                        ],
                    },
                    {
                        id:`f9d82bdd-4ee2-49dd-a707-133407cdef19`,
                        name:`Fine Motor Skills`,
                        status:`active`,
                        subcategories:[
                            {
                                id:`963729a4-7853-49d2-b75d-2c61d291afee`,
                                name:`Sensory`,
                                status:`active`,
                            },
                        ],
                    },
                    {
                        id:`a1c26321-e3a7-4ff2-9f1c-bb1c5e420fb7`,
                        name:`Gross Motor Skills`,
                        status:`active`,
                        subcategories:[
                            {
                                id:`f78c01f9-4b8a-480c-8c4b-80d1ec1747a7`,
                                name:`Complex Movements`,
                                status:`active`,
                            },
                            {
                                id:`f5a1e3a6-c0b1-4b2f-991f-9df7897dac67`,
                                name:`Physical Skills`,
                                status:`active`,
                            },
                            {
                                id:`bd7adbd0-9ce7-4c50-aa8e-85b842683fb5`,
                                name:`Simple Movements`,
                                status:`active`,
                            },
                        ],
                    },
                    {
                        id:`c12f363a-633b-4080-bd2b-9ced8d034379`,
                        name:`Cognitive Skills`,
                        status:`active`,
                        subcategories:[
                            {
                                id:`cd06e622-a323-40f3-8409-5384395e00d2`,
                                name:`Science`,
                                status:`active`,
                            },
                            {
                                id:`81b09f61-4509-4ce0-b099-c208e62870f9`,
                                name:`Math`,
                                status:`active`,
                            },
                            {
                                id:`39ac1475-4ade-4d0b-b79a-f31256521297`,
                                name:`Coding`,
                                status:`active`,
                            },
                            {
                                id:`2d1152a3-fb03-4c4e-aeba-98856c3241bd`,
                                name:`Vocabulary`,
                                status:`active`,
                            },
                            {
                                id:`43c9d2c5-7a23-42c9-8ad9-1132fb9c3853`,
                                name:`Colors`,
                                status:`active`,
                            },
                            {
                                id:`8d49bbbb-b230-4d5a-900b-cde6283519a3`,
                                name:`Numbers`,
                                status:`active`,
                            },
                            {
                                id:`ed88dcc7-30e4-4ec7-bccd-34aaacb47139`,
                                name:`Shapes`,
                                status:`active`,
                            },
                            {
                                id:`1cb17f8a-d516-498c-97ea-8ad4d7a0c018`,
                                name:`Letters`,
                                status:`active`,
                            },
                        ],
                    },
                    {
                        id:`e06ad483-085c-4869-bd88-56d17c7810a0`,
                        name:`Personal Development`,
                        status:`active`,
                        subcategories:[
                            {
                                id:`ba77f705-9087-4424-bff9-50fcd0b1731e`,
                                name:`Social Skills`,
                                status:`active`,
                            },
                            {
                                id:`824bb6cb-0169-4335-b7a5-6ece2b929da3`,
                                name:`Emotional Skills`,
                                status:`active`,
                            },
                        ],
                    },
                ],
                id:`7cf8d3a3-5493-46c9-93eb-12f220d101d0`,
                name:`Math`,
                status:`active`,
                system:true,
            },
            {
                categories:[
                    {
                        id:`551e59bd-7472-4dcd-b334-778d66fcdfa9`,
                        name:`Category 1`,
                        status:`active`,
                        subcategories:[
                            {
                                id:`ed85cf65-9ff7-4f9a-8b8a-5bf2a7402360`,
                                name:`Sub 1`,
                                status:`active`,
                            },
                            {
                                id:`6fb79402-2fb6-4415-874c-338c949332ed`,
                                name:`Art`,
                                status:`active`,
                            },
                            {
                                id:`e2190c0c-918d-4a05-a045-6696ae31d5c4`,
                                name:`Click`,
                                status:`active`,
                            },
                            {
                                id:`852c3495-1ced-4580-a584-9d475217f3d5`,
                                name:`Character Education`,
                                status:`active`,
                            },
                            {
                                id:`9c30644b-0e9c-43aa-a19a-442e9f6aa6ae`,
                                name:`Body Coordination`,
                                status:`active`,
                            },
                        ],
                    },
                ],
                id:`8cce1e5f-3d05-490e-9466-bc11f24d5bed`,
                name:`PTSubCatagory1`,
                status:`active`,
                system:false,
            },
        ],
        system:false,
    },
};
