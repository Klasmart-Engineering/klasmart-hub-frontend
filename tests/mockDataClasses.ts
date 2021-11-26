import { Status } from "@/types/graphQL";

export const mockOrgId = `999c1f10-8be7-4501-a541-5cf0d5382025`;
export const mockClassId = `7945d1fa-d4b8-418a-b917-847bea0fa9dd`;
export const mockUserId = `144c3082-2fff-45a1-8ce4-3226ce909999`;

export const mockClass = {
    class: {
        class_id: mockClassId,
        class_name: `Demo Class`,
        age_ranges: [
            {
                id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
            },
        ],
        grades: [
            {
                id: `0ecb8fa9-d77e-4dd3-b220-7e79704f1b03`,
            },
        ],
        programs: [
            {
                id: `75004121-0c0d-486c-ba65-4c57deacb44b`,
                name: `ESL`,
                subjects: [
                    {
                        id: `20d6ca2f-13df-4a7a-8dcb-955908db7baa`,
                        name: `Language/Literacy`,
                    },
                ],
            },
        ],
        schools:[
            {
                school_id: `f7ef44ee-6576-4f65-9c14-e82060dfde23`,
                school_name: `Clapham School1`,
                programs: [
                    {
                        id: `75004121-0c0d-486c-ba65-4c57deacb44b`,
                    },
                ],
            },
        ],
        students: [
            {
                full_name: `Louis Merkel`,
                family_name: `Merkel`,
                given_name: `Louis`,
                membership: {
                    status: `active`,
                },
            },
        ],
        subjects: [
            {
                id: `20d6ca2f-13df-4a7a-8dcb-955908db7baa`,
            },
        ],
        teachers: [
            {
                full_name: `George Merkel`,
                family_name: `Merkel`,
                given_name: `George`,
                membership: {
                    status: `active`,
                },
            },
            {
                full_name: `Juan Obrador`,
                family_name: `Obrador`,
                given_name: `Juan`,
                membership: {
                    status: `inactive`,
                },
            },
        ],
    },
};

export const mockClasses = {
    totalCount:10,
    pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: `eyJjbGFzc19pZCI6IjdkOWMxZjEwLThiZTctNDUwMS1hNTQxLTVjZjBkNTM4MjAyNSIsImNsYXNzX25hbWUiOiJDbGFzcyA2In0=`,
        endCursor: `eyJjbGFzc19pZCI6Ijc0NWU3OTYwLTUzZDEtNGM0Mi1iYzE1LWI4ZDBiOGY0OWFiOCIsImNsYXNzX25hbWUiOiJKdW5pb3IifQ==`,
    },
    edges: [
        {
            node: {
                id:`7d9c1f10-8be7-4501-a541-5cf0d5382025`,
                name:`Class 6`,
                status: Status.ACTIVE,
                schools:[],
                ageRanges:[],
                grades:[],
                subjects:[],
                programs:[],
            },
        },
        {
            node: {
                id:`ab3807a6-1f98-4c16-9a38-c0d5426bcab4`,
                name:`Class 7`,
                status: Status.ACTIVE,
                schools:[],
                ageRanges:[],
                grades:[],
                subjects:[],
                programs:[],
            },
        },
        {
            node: {
                id:`a4e5acc2-b00a-4797-95bd-fcaaec2729af`,
                name:`Class 9`,
                status: Status.ACTIVE,
                schools:[],
                ageRanges:[],
                grades:[],
                subjects:[],
                programs:[],
            },
        },
        {
            node:{
                id:`abf4c567-dd65-43c1-919b-7c19e6463eaf`,
                name:`Class Grade 2`,
                status: Status.ACTIVE,
                schools:[],
                ageRanges:[],
                grades:[],
                subjects:[],
                programs:[],
            },
        },
        {
            node: {
                id:`738d15ec-138d-4596-acba-30d89747abe6`,
                name:`Class Grade 3`,
                status: Status.ACTIVE,
                schools:[],
                ageRanges:[],
                grades:[],
                subjects:[],
                programs:[],
            },
        },
        {
            node:{
                id:`419b79c3-0b64-4e46-8f7d-12e35abb7e26`,
                name:`Elem 10`,
                status: Status.ACTIVE,
                schools:[],
                ageRanges:[],
                grades:[],
                subjects:[],
                programs:[],
            },
        },
        {
            node:{
                id:`9b44b46c-4597-4ce3-8320-250e958c989a`,
                name:`Elem 8`,
                status: Status.ACTIVE,
                schools:[],
                ageRanges:[],
                grades:[],
                subjects:[],
                programs:[],
            },
        },
        {
            node:{
                id:`4f9ddd93-4ac5-4c59-95ee-4a29698588c6`,
                name:`Elementary 5`,
                status: Status.ACTIVE,
                schools:[
                    {
                        id:`649e1722-1cab-4930-99b2-ad6bd0278e0d`,
                        name:`Online Elementary`,
                    },
                ],
                ageRanges:[],
                grades:[
                    {
                        id:`98461ca1-06a1-432a-97d0-4e1dff33e1a5`,
                        name:`None Specified`,
                    },
                ],
                subjects:[],
                programs:[
                    {
                        id:`75004121-0c0d-486c-ba65-4c57deacb44b`,
                        name:`ESL`,
                    },
                    {
                        id:`14d350f1-a7ba-4f46-bef9-dc847f0cbac5`,
                        name:`Math`,
                    },
                    {
                        id:`04c630cc-fabe-4176-80f2-30a029907a33`,
                        name:`Science`,
                    },
                    {
                        id:`b39edb9a-ab91-4245-94a4-eb2b5007c033`,
                        name:`Bada Genius`,
                    },
                    {
                        id:`4591423a-2619-4ef8-a900-f5d924939d02`,
                        name:`Bada Math`,
                    },
                    {
                        id:`7a8c5021-142b-44b1-b60b-275c29d132fe`,
                        name:`Bada Read`,
                    },
                    {
                        id:`93f293e8-2c6a-47ad-bc46-1554caac99e4`,
                        name:`Bada Rhyme`,
                    },
                    {
                        id:`56e24fa0-e139-4c80-b365-61c9bc42cd3f`,
                        name:`Bada Sound`,
                    },
                    {
                        id:`d1bbdcc5-0d80-46b0-b98e-162e7439058f`,
                        name:`Bada STEM`,
                    },
                    {
                        id:`f6617737-5022-478d-9672-0354667e0338`,
                        name:`Bada Talk`,
                    },
                    {
                        id:`cdba0679-5719-47dc-806d-78de42026db6`,
                        name:`Bada STEAM 1`,
                    },
                ],
            },
        },
        {
            node:{
                id:`c578a23d-a8d2-4284-a24f-0326d62853d7`,
                name:`Grade 1 Class`,
                status: Status.ACTIVE,
                schools:[
                    {
                        id:`649e1722-1cab-4930-99b2-ad6bd0278e0d`,
                        name:`Online Elementary`,
                    },
                ],
                ageRanges:[
                    {
                        id:`7965d220-619d-400f-8cab-42bd98c7d23c`,
                        name:`3 - 4 year(s)`,
                        lowValue:3,
                        lowValueUnit:`year`,
                        highValue:4,
                        highValueUnit:`year`,
                    },
                    {
                        id:`bb7982cd-020f-4e1a-93fc-4a6874917f07`,
                        name:`4 - 5 year(s)`,
                        lowValue:4,
                        lowValueUnit:`year`,
                        highValue:5,
                        highValueUnit:`year`,
                    },
                    {
                        id:`fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
                        name:`5 - 6 year(s)`,
                        lowValue:5,
                        lowValueUnit:`year`,
                        highValue:6,
                        highValueUnit:`year`,
                    },
                    {
                        id:`145edddc-2019-43d9-97e1-c5830e7ed689`,
                        name:`6 - 7 year(s)`,
                        lowValue:6,
                        lowValueUnit:`year`,
                        highValue:7,
                        highValueUnit:`year`,
                    },
                    {
                        id:`21f1da64-b6c8-4e74-9fef-09d08cfd8e6c`,
                        name:`7 - 8 year(s)`,
                        lowValue:7,
                        lowValueUnit:`year`,
                        highValue:8,
                        highValueUnit:`year`,
                    },
                ],
                grades:[
                    {
                        id:`a9f0217d-f7ec-4add-950d-4e8986ab2c82`,
                        name:`Kindergarten`,
                    },
                    {
                        id:`e4d16af5-5b8f-4051-b065-13acf6c694be`,
                        name:`Grade 1`,
                    },
                    {
                        id:`b20eaf10-3e40-4ef7-9d74-93a13782d38f`,
                        name:`PreK-3`,
                    },
                    {
                        id:`89d71050-186e-4fb2-8cbd-9598ca312be9`,
                        name:`PreK-4`,
                    },
                    {
                        id:`abc900b9-5b8c-4e54-a4a8-54f102b2c1c6`,
                        name:`PreK-5`,
                    },
                    {
                        id:`3ee3fd4c-6208-494f-9551-d48fabc4f42a`,
                        name:`PreK-6`,
                    },
                    {
                        id:`781e8a08-29e8-4171-8392-7e8ac9f183a0`,
                        name:`PreK-7`,
                    },
                    {
                        id:`d7e2e258-d4b3-4e95-b929-49ae702de4be`,
                        name:`PreK-1`,
                    },
                    {
                        id:`3e7979f6-7375-450a-9818-ddb09b250bb2`,
                        name:`PreK-2`,
                    },
                    {
                        id:`81dcbcc6-3d70-4bdf-99bc-14833c57c628`,
                        name:`K`,
                    },
                    {
                        id:`100f774a-3d7e-4be5-9c2c-ae70f40f0b50`,
                        name:`Grade 1`,
                    },
                    {
                        id:`9d3e591d-06a6-4fc4-9714-cf155a15b415`,
                        name:`Grade 2`,
                    },
                    {
                        id:`0ecb8fa9-d77e-4dd3-b220-7e79704f1b03`,
                        name:`PreK-1`,
                    },
                    {
                        id:`66fcda51-33c8-4162-a8d1-0337e1d6ade3`,
                        name:`PreK-2`,
                    },
                    {
                        id:`98461ca1-06a1-432a-97d0-4e1dff33e1a5`,
                        name:`None Specified`,
                    },
                ],
                subjects:[
                    {
                        id:`7cf8d3a3-5493-46c9-93eb-12f220d101d0`,
                        name:`Math`,
                    },
                    {
                        id:`fab745e8-9e31-4d0c-b780-c40120c98b27`,
                        name:`Science`,
                    },
                    {
                        id:`36c4f793-9aa3-4fb8-84f0-68a2ab920d5a`,
                        name:`Math`,
                    },
                    {
                        id:`29d24801-0089-4b8e-85d3-77688e961efb`,
                        name:`Science 2`,
                    },
                    {
                        id:`f12276a9-4331-4699-b0fa-68e8df172843`,
                        name:`STEAM`,
                    },
                ],
                programs:[
                    {
                        id:`75004121-0c0d-486c-ba65-4c57deacb44b`,
                        name:`ESL`,
                    },
                    {
                        id:`14d350f1-a7ba-4f46-bef9-dc847f0cbac5`,
                        name:`Math`,
                    },
                    {
                        id:`04c630cc-fabe-4176-80f2-30a029907a33`,
                        name:`Science`,
                    },
                    {
                        id:`b39edb9a-ab91-4245-94a4-eb2b5007c033`,
                        name:`Bada Genius`,
                    },
                    {
                        id:`4591423a-2619-4ef8-a900-f5d924939d02`,
                        name:`Bada Math`,
                    },
                    {
                        id:`7a8c5021-142b-44b1-b60b-275c29d132fe`,
                        name:`Bada Read`,
                    },
                    {
                        id:`93f293e8-2c6a-47ad-bc46-1554caac99e4`,
                        name:`Bada Rhyme`,
                    },
                    {
                        id:`56e24fa0-e139-4c80-b365-61c9bc42cd3f`,
                        name:`Bada Sound`,
                    },
                    {
                        id:`d1bbdcc5-0d80-46b0-b98e-162e7439058f`,
                        name:`Bada STEM`,
                    },
                    {
                        id:`f6617737-5022-478d-9672-0354667e0338`,
                        name:`Bada Talk`,
                    },
                    {
                        id:`cdba0679-5719-47dc-806d-78de42026db6`,
                        name:`Bada STEAM 1`,
                    },
                ],
            },
        },
        {
            node:{
                id:`9b44b46c-4597-4ce3-8320-250e958c9800`,
                name:`Last Class`,
                status: Status.ACTIVE,
                schools:[],
                ageRanges:[],
                grades:[],
                subjects:[],
                programs:[],
            },
        },
    ],
};

export const mockSchoolsData = {
    organization: {
        schools: [
            {
                school_id: `f7ef44ee-6576-4f65-9c14-e82060dfde23`,
                school_name: `Clapham School1`,
                shortcode: `CS1`,
                status: `active`,
                programs: [
                    {
                        id: `75004121-0c0d-486c-ba65-4c57deacb44b`,
                        name: `ESL`,
                        status: `active`,
                        age_ranges: [
                            {
                                high_value: 4,
                                high_value_unit: `year`,
                                id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
                                low_value: 3,
                                low_value_unit: `year`,
                                name: `3 - 4 year(s)`,
                                status: `active`,
                                system: true,
                            },
                        ],
                        grades: [
                            {
                                id: `0ecb8fa9-d77e-4dd3-b220-7e79704f1b03`,
                                name: `PreK-1`,
                            },
                        ],
                        subjects: [
                            {
                                id: `20d6ca2f-13df-4a7a-8dcb-955908db7baa`,
                                name: `Language/Literacy`,
                            },
                        ],
                    },
                ],
                age_ranges: [
                    {
                        high_value: 4,
                        high_value_unit: `year`,
                        id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
                        low_value: 3,
                        low_value_unit: `year`,
                        name: `3 - 4 year(s)`,
                        status: `active`,
                        system: true,
                    },
                ],
                grades: [
                    {
                        id: `0ecb8fa9-d77e-4dd3-b220-7e79704f1b03`,
                        name: `PreK-1`,
                    },
                ],
                subjects: [
                    {
                        id: `20d6ca2f-13df-4a7a-8dcb-955908db7baa`,
                        name: `Language/Literacy`,
                    },
                ],
            },
        ],
    },
};

export const mockSearchClasses = {
    totalCount: 1,
    pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: `eyJjbGFzc19pZCI6IjdkOWMxZjEwLThiZTctNDUwMS1hNTQxLTVjZjBkNTM4MjAyNSIsImNsYXNzX25hbWUiOiJDbGFzcyA2In0=`,
        endCursor: `eyJjbGFzc19pZCI6Ijc0NWU3OTYwLTUzZDEtNGM0Mi1iYzE1LWI4ZDBiOGY0OWFiOCIsImNsYXNzX25hbWUiOiJKdW5pb3IifQ==`,
    },
    edges: [
        {
            node:{
                id:`9b44b46c-4597-4ce3-8320-250e958c9800`,
                name:`Mock Class`,
                status: Status.ACTIVE,
                schools:[
                    {
                        id:`649e1722-1cab-4930-99b2-ad6bd0278e0d`,
                        name:`Online Mock Elementary`,
                    },
                ],
                ageRanges:[],
                grades:[],
                subjects:[],
                programs:[],
            },
        },
    ],
};

export const mockUserSchoolMemberships = {
    userNode: {
        roles: [
            {
                id: `7e958466-08ba-46a9-8370-d824897e690e`,
                name: `School Admin`,
                schoolId: `f7ef44ee-6576-4f65-9c14-e82060dfde23`,
                status: Status.ACTIVE,
            },
            {
                id: `87aca549-fdb6-4a63-97d4-d563d4a4690a`,
                name: `Organization Admin`,
                schoolId: `f7ef44ee-6576-4f65-9c14-e82060dfde23`,
                status: Status.ACTIVE,
            },
        ],
        schools: [
            {
                id: `f7ef44ee-6576-4f65-9c14-e82060dfde23`,
                name: `Clapham School1`,
                status: Status.ACTIVE,
            },
        ],
    },
};
