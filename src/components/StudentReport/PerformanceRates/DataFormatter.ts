import { GetPerformancesRepsonse } from "@/api/sprReportApi";

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

export type GroupName = 'above' | 'below' | 'meets';
export type GroupNameAll = 'all' | GroupName;

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

export default function mapGraph (data: GetPerformancesRepsonse[], type: GroupNameAll): OverallPerformanceData[] {
    return data.map(mapData(type))
        .reverse();
}
