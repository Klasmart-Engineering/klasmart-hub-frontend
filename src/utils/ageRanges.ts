import { AgeRange } from "@/types/graphQL";

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
    if (ageRange.system && ageRange.name === `Non specified`) return `Non specified`;
    const showFromUnit = ageRange.low_value_unit !== ageRange.high_value_unit;
    return `${ageRange.low_value}${showFromUnit ? ` ${buildUnit(ageRange.low_value_unit ?? ``)}` : ``} - ${ageRange.high_value} ${buildUnit(ageRange.high_value_unit ?? ``)}`;
};

export const sortAgeRanges = (a: AgeRange, b: AgeRange) => buildAgeRangeLabel(a).localeCompare(buildAgeRangeLabel(b));
