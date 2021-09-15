
import { SubjectEdge } from "@/api/subjects";
import {
    Category,
    Status,
} from "@/types/graphQL";

export const mockOrgId = `b19de3cc-aa01-47f5-9f87-850eb70ae073`;
export const mockOrgId2 = `b19de3cc-aa01-47f5-9f87-850eb70ae079`;
export const mathId1 = `a00de3cc-aa01-47f5-9f87-850eb70ae001`;
export const mathId2 = `b00de3cc-aa01-47f5-9f87-850eb70ae002`;
export const mathId3 = `b00de3cc-aa01-47f5-9f87-850eb70ae003`;
export const mathId4 = `b00de3cc-aa01-47f5-9f87-850eb70ae004`;
export const mathId5 = `b00de3cc-aa01-47f5-9f87-850eb70ae005`;
export const mathId6 = `b00de3cc-aa01-47f5-9f87-850eb70ae006`;
export const mathId7 = `b00de3cc-aa01-47f5-9f87-850eb70ae007`;
export const mathId8 = `b00de3cc-aa01-47f5-9f87-850eb70ae008`;
export const mathId9 = `b00de3cc-aa01-47f5-9f87-850eb70ae009`;
export const mathId10 = `b00de3cc-aa01-47f5-9f87-850eb70ae010`;
export const programId1 = `b00de3cc-aa01-47f5-9f87-850eb70aprog`;
export const categoryId1 = `b00de3cc-aa01-47f5-9f87-850eb70acate`;

export const mockSubjectsStep: SubjectEdge[] = [
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
        },
    },
    {
        node: {
            id: mathId2,
            name: `Math Grade 6`,
            status: Status.ACTIVE,
            system: false,
            categories: [],
        },
    },
];

export const mockSubjects = {
    totalCount:10,
    pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: `eyJjbGFzc19pZCI6IjdkOWMxZjEwLThiZTctNDUwMS1hNTQxLTVjZjBkNTM4MjAyNSIsImNsYXNzX25hbWUiOiJDbGFzcyA2In0=`,
        endCursor: `eyJjbGFzc19pZCI6Ijc0NWU3OTYwLTUzZDEtNGM0Mi1iYzE1LWI4ZDBiOGY0OWFiOCIsImNsYXNzX25hbWUiOiJKdW5pb3IifQ==`,
    },
    edges:[
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
            },
        },
        {
            node: {
                id: mathId2,
                name: `Math Grade 6`,
                status: Status.ACTIVE,
                system: false,
                categories: [],
            },
        },
        {
            node: {
                id: mathId3,
                name: `Math Grade 3`,
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
            },
        },
        {
            node: {
                id: mathId4,
                name: `Math Grade 4`,
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
            },
        },
        {
            node: {
                id: mathId5,
                name: `Math Grade 1`,
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
            },
        },
        {
            node: {
                id: mathId6,
                name: `Math Grade 2`,
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
            },
        },
        {
            node: {
                id: mathId7,
                name: `Math Grade 7`,
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
            },
        },
        {
            node: {
                id: mathId8,
                name: `Math Grade 8`,
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
            },
        },
        {
            node: {
                id: mathId9,
                name: `Math Grade 9`,
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
            },
        },
        {
            node: {
                id: mathId10,
                name: `Math Grade 10`,
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
            },
        },
    ],
};

export const mockSearchSubjects = {
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
                id: mathId10,
                name: `Mock Subject`,
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
            },
        },
    ],
};

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
