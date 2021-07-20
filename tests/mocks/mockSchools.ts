import {
    School,
    Status,
} from "@/types/graphQL";

export const schoolA: School = {
    school_id: `2b15bed3-d371-4837-bd4d-4b40068c7c51`,
    school_name: `BTS University`,
    status: Status.ACTIVE,
    shortcode: null,
    programs: [
        {
            id: `0a54c6b4-b051-4503-a4fd-f7b8b4f88aa6`,
            name: `My Second Program`,
            grades: [
                {
                    id: `a2f468d0-dd09-426a-8d33-009aa5dc6674`,
                    name: `My second Grade`,
                },
            ],
            subjects: [
                {
                    id: `69d0cfca-4e7d-408b-96cc-53814b7a45d2`,
                    name: `My second subject`,
                },
            ],
            age_ranges: [
                {
                    id: `48ae4957-fd81-469c-a032-5f08459efcd6`,
                    name: `Age Range 1`,
                    low_value: 1,
                    low_value_unit: `month`,
                    high_value: 8,
                    high_value_unit: `month`,
                    system: false,
                    status: Status.ACTIVE,
                },
            ],
            status: Status.ACTIVE,
        },
    ],
};

export const schoolB: School = {
    school_id: `b3ce8cc0-616b-43cc-b4a8-adae9b5c6940`,
    school_name: `Unam University`,
    status: Status.INACTIVE,
    shortcode: null,
    programs: [],
};

export const schoolC: School = {
    school_id: `6c1523f8-43f2-4816-8036-93bf29da1018`,
    school_name: `San Javier University`,
    status: Status.ACTIVE,
    shortcode: null,
    programs: [
        {
            id: `c1887918-0cb6-46f7-a8a9-80d4324c1147`,
            name: `My Third Program`,
            grades: [
                {
                    id: `e81e245c-336a-4138-b57d-2bef03c3b1cb`,
                    name: `My third Grade`,
                },
            ],
            subjects: [
                {
                    id: `c85a80ab-0e57-48f1-8b2d-280c8f79c664`,
                    name: `My third subject`,
                },
            ],
            age_ranges: [
                {
                    id: `4cb0ad2f-2c4a-4120-a9d4-7c874bda717a`,
                    name: `Age Range 3`,
                    low_value: 2,
                    low_value_unit: `month`,
                    high_value: 10,
                    high_value_unit: `month`,
                    system: false,
                    status: Status.ACTIVE,
                },
            ],
            status: Status.ACTIVE,
        },
    ],
};

export const schoolD: School = {
    school_id: `ef37c995-c7c1-42f5-8c0d-9bb0a91cd6ec`,
    school_name: `School for CSV`,
    status: Status.ACTIVE,
    shortcode: `6ASOPADS0T`,
    programs: [
        {
            id: `b39edb9a-ab91-4245-94a4-eb2b5007c033`,
            name: `Bada Genius`,
            grades: [
                {
                    id: `98461ca1-06a1-432a-97d0-4e1dff33e1a5`,
                    name: `None Specified`,
                },
            ],
            subjects: [
                {
                    id: `66a453b0-d38f-472e-b055-7a94a94d66c4`,
                    name: `Language/Literacy`,
                },
            ],
            age_ranges: [
                {
                    id: `fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
                    name: `5 - 6 year(s)`,
                    low_value: 5,
                    low_value_unit: `year`,
                    high_value: 6,
                    high_value_unit: `year`,
                    system: true,
                    status: Status.ACTIVE,
                },
                {
                    id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
                    name: `3 - 4 year(s)`,
                    low_value: 3,
                    low_value_unit: `year`,
                    high_value: 4,
                    high_value_unit: `year`,
                    system: true,
                    status: Status.ACTIVE,
                },
                {
                    id: `bb7982cd-020f-4e1a-93fc-4a6874917f07`,
                    name: `4 - 5 year(s)`,
                    low_value: 4,
                    low_value_unit: `year`,
                    high_value: 5,
                    high_value_unit: `year`,
                    system: true,
                    status: Status.ACTIVE,
                },
            ],
            status: Status.ACTIVE,
        },
    ],
};
