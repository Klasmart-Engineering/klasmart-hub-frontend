import { AgeRangeEdge } from "@/api/ageRanges";
import { AgeRangeNode } from "@/api/programs";
import { AgeRangeRow } from "@/components/AgeRange/Table";
import {
    AgeRange,
    NON_SPECIFIED,
    Status,
} from "@/types/graphQL";
import { isEqual } from "lodash";

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

export const buildAgeRangeLabel = (ageRange: AgeRange) => {
    if (ageRange.system && ageRange.name === NON_SPECIFIED) return NON_SPECIFIED;
    const showFromUnit = ageRange.low_value_unit !== ageRange.high_value_unit;
    return `${ageRange.low_value}${showFromUnit ? ` ${buildUnit(ageRange.low_value_unit ?? ``)}` : ``} - ${ageRange.high_value} ${buildUnit(ageRange.high_value_unit ?? ``)}`;
};

export const buildAgeRangeEdgeLabel = (ageRange: AgeRangeEdge['node']) => {
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
    id: node?.id,
    system: node?.system,
    ageRange: buildAgeRangeLabel({
        high_value: node?.highValue,
        high_value_unit: node?.highValueUnit,
        low_value: node?.lowValue,
        low_value_unit: node?.lowValueUnit,
    }),
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
