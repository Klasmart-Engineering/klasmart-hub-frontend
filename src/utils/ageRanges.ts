import { AgeRange } from "@/types/graphQL";

export const buildEmptyAgeRange = (): AgeRange => ({
    age_range_id: ``,
});

const buildUnit = (unit: string) => {
    switch (unit) {
    case `month`: return `Month(s)`;
    case `year`: return `Year(s)`;
    default: `Unknown`;
    }
};

export const buildAgeRangeLabel = (ageRange: AgeRange) => {
    const showFromUnit = ageRange.fromUnit !== ageRange.toUnit;
    return `${ageRange.from}${showFromUnit ? ` ${buildUnit(ageRange.fromUnit ?? ``)}` : ``} - ${ageRange.to} ${buildUnit(ageRange.toUnit ?? ``)}`;
};
