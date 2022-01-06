import { AgeRangeEdge } from "@/api/ageRanges";
import { Status } from "@/types/graphQL";

export const mockOrganizationId = `b19de3cc-aa01-47f5-9f87-850eb70ae073`;
export const ageRangeId1 = `a19de3cc-aa01-47f5-9f87-850eb70ae073`;
export const ageRangeId2 = `m19de3cc-aa01-47f5-9f87-850eb70ae073`;
const ageRangeId3 = `z19de3cc-aa01-47f5-9f87-850eb70ae073`;

const ageRangeA: AgeRangeEdge = {
    node: {
        id: ageRangeId1,
        lowValue: 0,
        highValue: 99,
        lowValueUnit: `year`,
        highValueUnit: `year`,
        system: true,
        status: Status.ACTIVE,
    },
};

const ageRangeB: AgeRangeEdge = {
    node: {
        id: ageRangeId2,
        lowValue: 1,
        highValue: 5,
        lowValueUnit: `year`,
        highValueUnit: `year`,
        system: true,
        status: Status.ACTIVE,
    },
};

const ageRangeC: AgeRangeEdge = {
    node: {
        id: ageRangeId3,
        lowValue: 3,
        highValue: 5,
        lowValueUnit: `year`,
        highValueUnit: `year`,
        system: true,
        status: Status.ACTIVE,
    },
};

export const ageRangesEdges = [
    ageRangeA,
    ageRangeB,
    ageRangeC,
];

export const mockPaginatedAgeRanges = {
    ageRangesConnection: {
        edges: ageRangesEdges,
        pageInfo: {
            endCursor: `eyJpZCI6IjY1MzA2MDkwLTlhYjMtNGQ4ZC05MWY3LTc4ZTQ0ZWE1NWViNyIsImxvd192YWx1ZV91bml0IjoieWVhciIsImxvd192YWx1ZSI6MTB9`,
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: `eyJpZCI6IjAyM2VlZWIxLTVmNzItNGZhMy1hMmE3LTYzNjAzNjA3YWMyYiIsImxvd192YWx1ZV91bml0IjoieWVhciIsImxvd192YWx1ZSI6MH0=`,
        },
        totalCount: 3,
    },

};
