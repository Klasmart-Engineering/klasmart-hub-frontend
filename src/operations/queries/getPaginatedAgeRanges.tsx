import { AgeRangeQueryFilter } from "@/api/ageRanges";
import { AgeRangeRow } from "@/components/AgeRanges/Table";
import { Status } from "@/types/graphQL";
import { gql } from "@apollo/client";
import { BaseTableData } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/BaseTable";

export interface AgeRangePaginationFilter {
    organizationId: string;
    filters: AgeRangeQueryFilter[];
}

export const buildOrganizationAgeRangeFilter = (filter: AgeRangePaginationFilter): AgeRangeQueryFilter => ({
    status: {
        operator: `eq`,
        value: Status.ACTIVE,
    },
    AND: [
        {
            OR: [
                {
                    organizationId: {
                        operator: `eq`,
                        value: filter.organizationId,
                    },
                },
                {
                    system: {
                        operator: `eq`,
                        value: true,
                    },
                },
            ],
        },
        ...(filter.filters?.length > 0 ? filter.filters : []),
    ],
});

export const buildAgeRangesFilters = (filters: BaseTableData<AgeRangeRow>['filters'] = []): AgeRangeQueryFilter[] => {
    return filters.map((filter) => {
        switch(filter.columnId) {
        case `from`: {
            const values = filter.values.map((value) => {
                const fromFilter: AgeRangeQueryFilter = {
                    ageRangeValueFrom: {
                        operator: `eq`,
                        value: parseInt(value.split(` `)[0], 10),
                    },
                    ageRangeUnitFrom: {
                        operator: `eq`,
                        value: value.split(` `)[1] === `year` ? `year` : `month`,
                    },
                };
                return fromFilter;
            });

            return {
                OR: values,
            };
        }
        case `to`: {
            const values = filter.values.map((value) => {
                const toFilter: AgeRangeQueryFilter = {
                    ageRangeValueTo: {
                        operator: `eq`,
                        value: parseInt(value.split(` `)[0], 10),
                    },
                    ageRangeUnitTo: {
                        operator: `eq`,
                        value: value.split(` `)[1] === `year` ? `year` : `month`,
                    },
                };
                return toFilter;
            });

            return {
                OR: values,
            };
        }
        default: return {};
        }
    });
};

export const GET_PAGINATED_AGE_RANGES = gql`
query getPaginatedAgeRanges(
    $count: PageSize
    $cursor: String
    $direction: ConnectionDirection!
    $orderBy: [AgeRangeSortBy!]!
    $order: SortOrder!
    $filter: AgeRangeFilter
){
    ageRangesConnection(
        direction: $direction
        directionArgs: { count: $count, cursor: $cursor }
        sort: { field: $orderBy, order: $order }
        filter: $filter
    ){
        totalCount
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
        edges {
            node {
                id
                lowValue
                lowValueUnit
                highValue
                highValueUnit
                system
                name
            }
        }
    }
}
`;
