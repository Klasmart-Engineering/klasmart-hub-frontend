
export const mockPaginatedAgeRanges = {
    ageRangesConnection: {
        edges: [
            {
                node: {
                    highValue: 99,
                    highValueUnit: `year`,
                    lowValue: 0,
                    lowValueUnit: `year`,
                    name: `None Specified`,
                    status: `active`,
                },
            },
            {
                node: {
                    highValue: 5,
                    highValueUnit: `year`,
                    lowValue: 1,
                    lowValueUnit: `year`,
                    name: `1 - 4 year(s)`,
                    status: `active`,
                },
            },
            {
                node: {
                    highValue: 5,
                    highValueUnit: `year`,
                    lowValue: 3,
                    lowValueUnit: `year`,
                    name: `5 - 4 year(s)`,
                    status: `active`,
                },
            },
        ],
        pageInfo: {
            endCursor: `eyJpZCI6IjY1MzA2MDkwLTlhYjMtNGQ4ZC05MWY3LTc4ZTQ0ZWE1NWViNyIsImxvd192YWx1ZV91bml0IjoieWVhciIsImxvd192YWx1ZSI6MTB9`,
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: `eyJpZCI6IjAyM2VlZWIxLTVmNzItNGZhMy1hMmE3LTYzNjAzNjA3YWMyYiIsImxvd192YWx1ZV91bml0IjoieWVhciIsImxvd192YWx1ZSI6MH0=`,
        },
        totalCount: 3,
    },
};
