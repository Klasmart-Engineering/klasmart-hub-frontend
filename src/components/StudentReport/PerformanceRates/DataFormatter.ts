import {
    GetPerformancesCategorySkill,
    GetPerformancesRepsonse,
    SubCategorySkill,
} from "@/api/sprReportApi";

export interface OverallPerformanceData {
    name: string;
    date: Date;
    above?: number;
    meets?: number;
    below?: number;
    score: {
        above?: number;
        meets?: number;
        below?: number;
    };
}
interface Score {
    name: string;
    achieved: number;
    notAchieved: number;
}
interface SkillData {
    learningOutcomeScores: Score;
    performanceScores: Score;
}

export type GroupName = 'above' | 'below' | 'meets';
export type GroupNameAll = 'all' | GroupName;

const chunk = (arr: any, size: number) => arr.reduce((acc: any, e: any, i: number) =>
    (i % size ? acc[acc.length - 1].push(e) : acc.push([ e ]), acc), []);

const mapData = (type: GroupNameAll) => (c: GetPerformancesRepsonse) => {
    return {
        name: c.name,
        date: new Date(c.name),
        ...((type === `all` || type === `above`) && {
            above: (c.above ?? 0),
        }),
        ...((type === `all` || type === `meets`) && {
            meets: (c.meets ?? 0),
        }),
        ...((type === `all` || type === `below`) && {
            below: (c.below ?? 0),
        }),
        score: {
            ...((type === `all` || type === `above`) && {
                above: (c.learningOutcome.above ?? 0),
            }),
            ...((type === `all` || type === `meets`) && {
                meets: (c.learningOutcome.meets ?? 0),
            }),
            ...((type === `all` || type === `below`) && {
                below: (c.learningOutcome.below ?? 0),
            }),
        },
    };
};

export const mapPerfomanceGraph = (data: GetPerformancesRepsonse[], type: GroupNameAll): OverallPerformanceData[] => {
    return data.map(mapData(type))
        .reverse();
};

export const mapSkillGraph = (data: GetPerformancesCategorySkill[]) => data.map((d: GetPerformancesCategorySkill) => ({
    ...d,
    subcategories: chunk(d.subcategories, 5)
        .map((subCategory: SubCategorySkill[]) => subCategory.map((s: SubCategorySkill) => ({
            performanceScores: {
                name: s.name,
                achieved: s.achieved,
                notAchieved: s.notAchieved,
            },
            learningOutcomeScores: {
                name: s.name,
                achieved: s.learningOutcome.achieved,
                notAchieved: s.learningOutcome.notAchieved,
            },
        }))),
}))
    .reverse()
    .reduce((p: SkillData[], c: any) => {
        const splite = c.subcategories.map((data: SkillData) => ({
            category: c.category,
            data,
        }));
        return [ ...splite, ...p ];
    }, []);
