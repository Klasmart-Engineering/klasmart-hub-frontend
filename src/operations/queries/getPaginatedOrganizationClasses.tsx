import { ClassesFilter } from "@/api/classes";
import { ClassRow } from "@/components/Class/Table";
import { Status } from "@/types/graphQL";
import { isUuid } from "@/utils/pagination";
import { gql } from "@apollo/client";
import { BaseTableData } from "kidsloop-px/dist/types/components/Table/Common/BaseTable";

export interface ClassPaginationFilter {
    organizationId: string;
    search: string;
    filters: ClassesFilter[];
}

export const buildOrganizationClassesSearchFilter = (search: string): ClassesFilter => ({
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

export const buildOrganizationClassesFilter = (filter: ClassPaginationFilter): ClassesFilter => ({
    organizationId: {
        operator: `eq`,
        value: filter.organizationId,
    },
    AND: [ buildOrganizationClassesSearchFilter(filter.search), ...filter.filters ],
});

export const buildClassesFilters = (filters: BaseTableData<ClassRow>['filters'] = []): ClassesFilter[] => {
    return filters.map((filter) => {
        switch(filter.columnId) {
        case `status`: {
            const values = filter.values.map((value) => {
                const statusFilter: ClassesFilter = {
                    status: {
                        operator: `eq`,
                        value: value === Status.ACTIVE ? Status.ACTIVE : Status.INACTIVE,
                    },
                };
                return statusFilter;
            });

            return {
                OR: values,
            };
        }
        case `schoolNames`: {
            const values = filter.values.map((value) => {
                const schoolFilter: ClassesFilter = {
                    schoolId: {
                        operator: `eq`,
                        value,
                    },
                };
                return schoolFilter;
            });

            return {
                OR: values,
            };
        }
        case `programs`: {
            const values = filter.values.map((value) => {
                const programFilter: ClassesFilter = {
                    programId: {
                        operator: `eq`,
                        value,
                    },
                };
                return programFilter;
            });

            return {
                OR: values,
            };
        }
        case `subjects`: {
            const values = filter.values.map((value) => {
                const subjectFilter: ClassesFilter = {
                    subjectId: {
                        operator: `eq`,
                        value,
                    },
                };
                return subjectFilter;
            });

            return {
                OR: values,
            };
        }
        case `grades`: {
            const values = filter.values.map((value) => {
                const gradeFilter: ClassesFilter = {
                    gradeId: {
                        operator: `eq`,
                        value,
                    },
                };
                return gradeFilter;
            });

            return {
                OR: values,
            };
        }
        case `ageRangeFrom`: {
            const values = filter.values.map((value) => {
                const [ fromValue, fromUnit ] = value.split(` `);
                const ageRangeFromFilters: ClassesFilter[] = [
                    {
                        ageRangeValueFrom: {
                            operator: `eq`,
                            value: parseInt(fromValue, 10),
                        },
                    },
                    {
                        ageRangeUnitFrom: {
                            operator: `eq`,
                            value: fromUnit === `year` ? `year` : `month`,
                        },
                    },
                ];
                return {
                    AND: ageRangeFromFilters,
                };
            });

            return {
                OR: values,
            };
        }
        case `ageRangeTo`: {
            const values = filter.values.map((value) => {
                const [ toValue, toUnit ] = value.split(` `);
                const ageRangeToFilters: ClassesFilter[] = [
                    {
                        ageRangeValueTo: {
                            operator: `eq`,
                            value: parseInt(toValue, 10),
                        },
                    },
                    {
                        ageRangeUnitTo: {
                            operator: `eq`,
                            value: toUnit === `year` ? `year` : `month`,
                        },
                    },
                ];
                return {
                    AND: ageRangeToFilters,
                };
            });

            return {
                OR: values,
            };
        }
        default: return {};
        }
    });
};

export const GET_PAGINATED_ORGANIZATION_CLASSES = gql`
query getOrganizationClasses(
    $direction: ConnectionDirection!
    $count: PageSize
    $cursor: String
    $orderBy: ClassSortBy!
    $order: SortOrder!
    $filter: ClassFilter
) {
    classesConnection(
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
                schools {
                    id
                    name
                }
                ageRanges {
                    id
                    name
                    lowValue
                    lowValueUnit
                    highValue
                    highValueUnit
                }
                grades {
                    id
                    name
                }
                subjects {
                    id
                    name
                }
                programs {
                    id
                    name
                }
            }
        }
    }
}
`;
