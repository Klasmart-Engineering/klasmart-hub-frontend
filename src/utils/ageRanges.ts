import { AgeRangeNode } from "@/api/programs";
import { AgeRangeRow } from "@/components/AgeRanges/Table";
import {
    AgeRange,
    NON_SPECIFIED,
} from "@/types/graphQL";

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
