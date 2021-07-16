import { AgeRangeEdge } from "@/api/programs";
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

export const mapAgeRangeEdgesToAgeRanges = (ageRanges: AgeRangeEdge[]): AgeRange[] => {
    return (ageRanges).map((ageRange) => ({
        id: ageRange.id,
        name: ageRange.name,
        status: ageRange.status,
        system: ageRange.system,
        low_value: ageRange.lowValue,
        low_value_unit: ageRange.lowValueUnit,
        high_value: ageRange.highValue,
        high_value_unit: ageRange.highValueUnit,
    }));
};
