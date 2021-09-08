
import { SubjectEdge } from "@/api/subjects";
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
export const mockSubjects: SubjectEdge[] = [
    {
        node: {
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
                },
            ],
        }
    },
    {
        node: {
            id: mathId2,
            name: `Math Grade 6`,
            status: Status.ACTIVE,
            system: false,
            categories: [],
        }
    },
];


export const mockCategories: Category[] = [
    {
        id: `2d5ea951-836c-471e-996e-76823a992689`,
        name: `None Specified`,
        status: Status.ACTIVE,
        system: true,
    },
    {
        id: `b4cd42b8-a09b-4f66-a03a-b9f6b6f69895`,
        name: `Fine Motor Skills`,
        status: Status.ACTIVE,
    },
    {
        id: `bcfd9d76-cf05-4ccd-9a41-6b886da661be`,
        name: `Gross Motor Skills`,
        status: Status.ACTIVE,
        system: true,
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
        },
    ],
};
