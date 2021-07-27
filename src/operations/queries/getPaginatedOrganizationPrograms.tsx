import { ProgramFilter } from "@/api/programs";
import { ProgramRow } from "@/components/Program/Table";
import {
    Status,
    UuidOperator,
} from "@/types/graphQL";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";
import { BaseTableData } from "kidsloop-px/dist/types/components/Table/Common/BaseTable";

export interface ProgramPaginationFilter {
    organizationId: string;
    search: string;
    filters: ProgramFilter[];
}

export const buildOrganizationProgramSearchFilter = (search: string): ProgramFilter => ({
    ...isUuid(search)
        ? {
            id: {
                operator: `eq`,
                value: search,
            },
        }
        : {
            OR: [
                {
                    name: {
                        operator: `contains`,
                        value: search,
                        caseInsensitive: true,
                    },
                },
            ],
        },
});

export const buildOrganizationProgramFilter = (filter: ProgramPaginationFilter): ProgramFilter => ({
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
        {
            AND: [ buildOrganizationProgramSearchFilter(filter.search), ...filter.filters  ],
        },
    ],
});

export const buildProgramIdsFilter = (ids: string[]): ProgramFilter => ({
    OR: ids.map((id) => ({
        id: {
            operator: `eq`,
            value: id,
        },
    })),
});

export const buildProgramFilters = (filters: BaseTableData<ProgramRow>['filters'] = []): ProgramFilter[] => {
    return filters.map((filter) => {
        switch(filter.columnId) {
        case `subjects`: {
            const values = filter.values.map((value) => {
                const subjectFilter: ProgramFilter = {
                    subjectId: {
                        operator: `eq` as UuidOperator,
                        value,
                    },
                };
                return subjectFilter;
            });

            return {
                OR: values,
            };
        }
        case `ageRangeFrom`: {
            const values = filter.values.map((value) => {
                const subjectFilter: ProgramFilter = {
                    ageRangeFrom: {
                        operator: `eq`,
                        value: {
                            value: parseInt(value.split(` `)[0], 10),
                            unit: value.split(` `)[1] === `year` ? `year` : `month`,
                        },
                    },
                };
                return subjectFilter;
            });

            return {
                OR: values,
            };
        }
        case `ageRangeTo`: {
            const values = filter.values.map((value) => {
                const [ ageRangeToValue, unit ] = value.split(` `);
                const subjectFilter: ProgramFilter = {
                    ageRangeTo: {
                        operator: `eq`,
                        value: {
                            value: parseInt(ageRangeToValue, 10),
                            unit: unit === `year` ? `year` : `month`,
                        },
                    },
                };
                return subjectFilter;
            });

            return {
                OR: values,
            };
        }
        default: {
            const values = filter.values.map((value) => {
                const gradeFilter: ProgramFilter = {
                    gradeId: {
                        operator: filter.operatorValue as UuidOperator,
                        value,
                    },
                };
                return gradeFilter;
            });

            return {
                OR: values,
            };
        }
        }
    });
};

export const GET_PAGINATED_ORGANIZATION_PROGRAMS = gql`
    query getOrganizationPrograms(
        $direction: ConnectionDirection!
        $count: Int
        $cursor: String
        $orderBy: [ProgramSortBy!]!
        $order: SortOrder!
        $filter: ProgramFilter
    ) {
        programsConnection(
            direction: $direction
            directionArgs: { count: $count, cursor: $cursor }
            sort: { field: $orderBy, order: $order }
            filter: $filter
        ) {
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
                    name
                    status
                    system
                    ageRanges {
                        id
                        name
                        status
                        system
                        highValue
                        highValueUnit
                        lowValue
                        lowValueUnit
                    }
                    subjects {
                        id
                        name
                        status
                        system
                    }
                    grades {
                        id
                        name
                        status
                        system
                    }
                }
            }
        }
    }
`;
