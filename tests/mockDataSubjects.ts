
import {
    Category,
    Program,
    Status,
    Subject,
} from "@/types/graphQL";

export const mockOrgId = `b19de3cc-aa01-47f5-9f87-850eb70ae073`;
export const mathId1 = `a00de3cc-aa01-47f5-9f87-850eb70ae001`;
export const mathId2 = `b00de3cc-aa01-47f5-9f87-850eb70ae002`;
export const programId1 = `b00de3cc-aa01-47f5-9f87-850eb70aprog`;
export const categoryId1 = `b00de3cc-aa01-47f5-9f87-850eb70acate`;
export const mockSubjects: Subject[] = [
    {
        id: mathId1,
        name: `Math Grade 5`,
        status: Status.ACTIVE,
        system: false,
        categories: [
            {
                id: categoryId1,
                name: `Algebra`,
                status: Status.ACTIVE,
                system: false,
                subcategories: [
                    {
                        id: `bf89c192-93dd-4192-97ab-f37198548ead`,
                        name: `Hand-Eye Coordination`,
                        status: Status.ACTIVE,
                        system: true,
                    },
                ],
            },
        ],
    },
    {
        id: mathId2,
        name: `Math Grade 6`,
        status: Status.ACTIVE,
        system: false,
        categories: [],
    },
];

export const mockPrograms: Program[] = [
    {
        id: programId1,
        name: `Elementary`,
        status: Status.ACTIVE,
        system: false,
        subjects: [
            {
                id: mathId1,
                name: `Math Grade 5`,
                status: Status.ACTIVE,
                system: false,
                categories: [],
            },
        ],
    },
];

export const mockCategories: Category[] = [
    {
        id: `2d5ea951-836c-471e-996e-76823a992689`,
        name: `None Specified`,
        status: Status.ACTIVE,
        system: true,
        subcategories: [
            {
                id: `40a232cd-d6e8-4ec1-97ec-4e4df7d00a78`,
                name: `None Specified`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
    },
    {
        id: `b4cd42b8-a09b-4f66-a03a-b9f6b6f69895`,
        name: `Fine Motor Skills`,
        status: Status.ACTIVE,
        subcategories: [
            {
                id: `bf89c192-93dd-4192-97ab-f37198548ead`,
                name: `Hand-Eye Coordination`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `963729a4-7853-49d2-b75d-2c61d291afee`,
                name: `Sensory`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
    },
    {
        id: `bcfd9d76-cf05-4ccd-9a41-6b886da661be`,
        name: `Gross Motor Skills`,
        status: Status.ACTIVE,
        system: true,
        subcategories: [
            {
                id: `f78c01f9-4b8a-480c-8c4b-80d1ec1747a7`,
                name: `Complex Movements`,
                status: Status.ACTIVE,
                system: true,
            },
            {
                id: `f5a1e3a6-c0b1-4b2f-991f-9df7897dac67`,
                name: `Physical Skills`,
                status: Status.ACTIVE,
                system: true,
            },
        ],
    },
];

export const mockFormInitialValue = {
    id: ``,
    name: ``,
    categories: [
        {
            id: `2d5ea951-836c-471e-996e-76823a992689`,
            name: `None Specified`,
            status: Status.ACTIVE,
            system: true,
            subcategories: [
                {
                    id: `40a232cd-d6e8-4ec1-97ec-4e4df7d00a78`,
                    name: `None Specified`,
                    status: Status.ACTIVE,
                    system: true,
                },
            ],
        },
    ],
};
