import {
    AgeRangeEdge,
    useGetPaginatedAgeRangesList,
} from "@/api/ageRanges";
import { AgeRangeNode } from "@/api/programs";
import { AgeRangeRow } from "@/components/AgeRange/Table";
import { buildOrganizationAgeRangeFilter } from "@/operations/queries/getPaginatedAgeRanges";
import {
    AgeRange,
    NON_SPECIFIED,
    Program,
    Status,
} from "@/types/graphQL";
import { FilterValueOption } from "kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import { isEqual } from "lodash";
import {
    useEffect,
    useState,
} from "react";

export const buildEmptyAgeRange = (): AgeRange => ({
    id: ``,
});

const buildUnit = (unit: string) => {
    switch (unit) {
    case `month`: return `Month(s)`;
    case `year`: return `Year(s)`;
    default: `Unknown`;
    }
};

const buildLabel = (value: number | null | undefined, unit: string | null | undefined, showUnit = true) => {
    return `${value}${showUnit ? ` ${buildUnit(unit ?? ``)}` : ``}`;
};

export const buildAgeRangeLabel = (ageRange: AgeRange) => {
    if (ageRange.system && ageRange.name === NON_SPECIFIED) return NON_SPECIFIED;
    const showFromUnit = ageRange.low_value_unit !== ageRange.high_value_unit;
    return `${buildLabel(ageRange.low_value, ageRange.low_value_unit, showFromUnit)} - ${buildLabel(ageRange.high_value, ageRange.high_value_unit)}`;
};

export const buildAgeRangeEdgeLabel = (ageRange: AgeRangeNode) => {
    if (ageRange?.system && ageRange?.name === NON_SPECIFIED) return NON_SPECIFIED;
    const showFromUnit = ageRange?.lowValueUnit !== ageRange?.highValueUnit;
    return `${ageRange?.lowValue}${showFromUnit ? ` ${buildUnit(ageRange?.lowValueUnit ?? ``)}` : ``} - ${ageRange?.highValue} ${buildUnit(ageRange?.highValueUnit ?? ``)}`;
};

export const sortAgeRanges = (a: AgeRange, b: AgeRange) => buildAgeRangeLabel(a).localeCompare(buildAgeRangeLabel(b));

export const mapAgeRangeNodeToAgeRange = (node: AgeRangeNode): AgeRange => ({
    id: node.id,
    name: node.name,
    status: node.status,
    system: node.system,
    low_value: node.lowValue,
    low_value_unit: node.lowValueUnit,
    high_value: node.highValue,
    high_value_unit: node.highValueUnit,
});

export interface AgeRangesNode{
    id?: string;
    name?: string;
    status?: Status;
    system?: boolean;
    lowValue?: number;
    lowValueUnit?: string;
    highValue?: number;
    highValueUnit?: string;
}

export const mapAgeRangeNodeToAgeRangeRow = (node: AgeRangesNode | undefined): AgeRangeRow => ({
    id: node?.id ?? ``,
    system: node?.system ?? false,
    ageRange: buildAgeRangeLabel({
        high_value: node?.highValue,
        high_value_unit: node?.highValueUnit,
        low_value: node?.lowValue,
        low_value_unit: node?.lowValueUnit,
    }),
    from: buildLabel(node?.lowValue, node?.lowValueUnit),
    to: buildLabel(node?.highValue, node?.highValueUnit),
});

export const buildAgeRangeLowValueLabel = (ageRange: AgeRangeEdge['node']) => {
    if (ageRange?.system && ageRange?.name === NON_SPECIFIED) return NON_SPECIFIED;
    const showFromUnit = ageRange?.lowValueUnit;
    return `${ageRange?.lowValue}${showFromUnit ? ` ${buildUnit(ageRange?.lowValueUnit ?? ``)}` : ``}`;
};

export const buildAgeRangeHighValueLabel = (ageRange: AgeRangeEdge['node']) => {
    if (ageRange?.system && ageRange?.name === NON_SPECIFIED) return NON_SPECIFIED;
    const showFromUnit = ageRange?.highValueUnit;
    return `${ageRange?.highValue}${showFromUnit ? ` ${buildUnit(ageRange?.highValueUnit ?? ``)}` : ``}`;
};

export const mapAgeRangesLowValueToFilter = (edges: AgeRangeEdge[]) => (
    edges.filter(edge => edge.node?.name !== NON_SPECIFIED).map(edge => ({
        value: `${edge.node?.lowValue} ${edge.node?.lowValueUnit}`,
        label: buildAgeRangeLowValueLabel(edge?.node),
    })).filter((filter, i, array) => (i === array.findIndex(foundFilter => isEqual(foundFilter, filter))))
);

export const mapAgeRangesHighValueToFilter = (edges: AgeRangeEdge[]) => (
    edges.filter(edge => edge.node?.name !== NON_SPECIFIED)
        .sort((a, b) => a.node?.highValueUnit?.localeCompare(b.node?.highValueUnit ?? ``) || (a.node?.highValue ?? 0) - (b.node?.highValue ?? 0))
        .map(edge => ({
            value: `${edge.node?.highValue} ${edge.node?.highValueUnit}`,
            label: buildAgeRangeHighValueLabel(edge?.node),
        })).filter((filter, i, array) => (i === array.findIndex(foundFilter => isEqual(foundFilter, filter))))
);

export const useAgeRangesFilters = (orgId: string, skip?: boolean) => {
    const [ ageRangesLowValueOptions, setAgeRangesLowValueOptions ] = useState<FilterValueOption[]>([]);
    const [ ageRangesHighValueOptions, setAgeRangesHighValueOptions ] = useState<FilterValueOption[]>([]);

    const {
        data: ageRangesData,
        fetchMore: fetchMoreAgeRanges,
        refetch: refetchAgeRanges,
    } = useGetPaginatedAgeRangesList({
        variables: {
            direction: `FORWARD`,
            count: 100,
            orderBy: [ `lowValueUnit`, `lowValue` ],
            order: `ASC`,
            filter: buildOrganizationAgeRangeFilter({
                organizationId: orgId ?? ``,
                filters: [],
            }),
        },
        returnPartialData: true,
        fetchPolicy: `no-cache`,
        skip: !orgId || skip,
    });

    useEffect(() => {
        setAgeRangesLowValueOptions(mapAgeRangesLowValueToFilter(ageRangesData?.ageRangesConnection?.edges ?? []));
        setAgeRangesHighValueOptions(mapAgeRangesHighValueToFilter(ageRangesData?.ageRangesConnection?.edges ?? []));

        if (ageRangesData?.ageRangesConnection?.pageInfo?.hasNextPage) {
            fetchMoreAgeRanges({
                variables: {
                    cursor: ageRangesData?.ageRangesConnection?.pageInfo?.endCursor ?? ``,
                },
            });
        }
    }, [ ageRangesData ]);

    return {
        ageRangesLowValueOptions,
        ageRangesHighValueOptions,
        refetchAgeRanges,
    };
};

export const mapAgeRangesFromPrograms = (programs: Program[]): AgeRange[] => {
    const ageRanges = programs.filter(program => program.age_ranges?.length).flatMap(program => program.age_ranges)
        .filter((ageRange, i, array) => (i === array.findIndex(foundFilter => isEqual(foundFilter, ageRange))));

    return ageRanges as AgeRange[] ?? [];
};
