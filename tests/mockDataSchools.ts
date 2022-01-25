import {
    programIdA,
    programIdB,
} from "./mockDataPrograms";
import { Status } from "@/types/graphQL";

export const mockSchoolId1 = `c8864666-23b6-4eec-a810-182b8b004b8a`;
export const mockSchoolId2 = `c8864666-23b6-4eec-a810-182b8b004b8b`;
export const mockSchoolId3 = `c8864666-23b6-4eec-a810-182b8b004b8c`;
export const mockSchoolName1 = `Balham Primary School`;
export const mockSchoolName2 = `Town Hall School`;
export const mockSchoolName3 = `Old Mountain School`;

export const mockSchoolsData = {
    schoolsConnection: {
        edges: [
            {
                node: {
                    id: mockSchoolId1,
                    name: mockSchoolName1,
                    shortCode: `65PJ61XQAV`,
                    status: Status.ACTIVE,

                },
            },
            {
                node: {
                    id: mockSchoolId2,
                    name: mockSchoolName2,
                    shortCode: `65PJ61XQAV`,
                    status: Status.ACTIVE,
                },
            },
            {
                node: {
                    id: mockSchoolId3,
                    name: mockSchoolName3,
                    shortCode: `65PJ61XQAV`,
                    status: Status.INACTIVE,
                },
            },
        ],
        pageInfo: {
            endCursor: `eyJzY2hvb2xfaWQiOiJjZWYyMjUxZS0wOTE0LTQyZTMtOTRlNC00MzY2Y2NjYzU3NmIiLCJzY2hvb2xfbmFtZSI6IlFBIFNjaG9vbCJ9`,
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: `eyJzY2hvb2xfaWQiOiJjODg2NDY2Ni0yM2I2LTRlZWMtYTgxMC0xODJiOGIwMDRiOGEiLCJzY2hvb2xfbmFtZSI6IkJhbGhhbSBQcmltYXJ5IFNjaG9vbGwifQ==`,
        },
        totalCount: 3,
    },
};

export const singleSchoolNode = {
    schoolNode: {
        id: mockSchoolId1,
        name: `Bada Read`,
        status: Status.ACTIVE,
        shortCode: `BR`,
        system: true,
        programsConnection: {
            edges: [
                {
                    node: {
                        id: programIdA,
                    },
                },
                {
                    node: {
                        id: programIdB,
                    },
                },
            ],
            pageInfo: {
                endCursor: `eyJzY2hvb2xfaWQiOiJjZWYyMjUxZS0wOTE0LTQyZTMtOTRlNC00MzY2Y2NjYzU3NmIiLCJzY2hvb2xfbmFtZSI6IlFBIFNjaG9vbCJ9`,
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: `eyJzY2hvb2xfaWQiOiJjODg2NDY2Ni0yM2I2LTRlZWMtYTgxMC0xODJiOGIwMDRiOGEiLCJzY2hvb2xfbmFtZSI6IkJhbGhhbSBQcmltYXJ5IFNjaG9vbGwifQ==`,
            },
        },
    },
};
