import { GetPerformancesRepsonse } from "@/api/sprReportApi";

interface DataProps {
    name: string;
    date: Date;
    above: number;
    meets: number;
    below: number;
    score: {
        above: number;
        meets: number;
        below: number;
    };
}

export type GroupName = 'above' | 'below' | 'meets';
export type GroupNameAll = 'all' | GroupName;

const mapData = (type: GroupNameAll, los: boolean) => (p: DataProps, c: GetPerformancesRepsonse) => {
    return {
        ...((type === `all` || type === `above`) && {
            above: (c.above ?? 0) + p.above,
        }),
        ...((type === `all` || type === `meets`) && {
            meets: (c.meets ?? 0) + p.meets,
        }),
        ...((type === `all` || type === `below`) && {
            below: (c.below ?? 0) + p.below,
        }),
        score: {
            ...((type === `all` || type === `above`) && {
                above: c.learningOutcome.above + p.score.above,
            }),
            ...((type === `all` || type === `meets`) && {
                meets: c.learningOutcome.meets + p.score.meets,
            }),
            ...((type === `all` || type === `below`) && {
                below: c.learningOutcome.below + p.score.below,
            }),
        },
    };
};
const defaultMaps = {
    above: 0,
    meets: 0,
    below: 0,
    score: {
        above: 0,
        meets: 0,
        below: 0,
    },
} as DataProps;
const checkIfDateInRange = (date: Date, startDate: Date, endDate: Date) => date > startDate && date < endDate;
const checkWeekend = (date: Date) => {
    return date.getDay() !== 6 && date.getDay() !== 0;
};
const formatToDDMM = (date: Date) => `${(`${date.getDate()}`).padStart(2, `0`)}/${(`${date.getMonth() + 1}`).padStart(2, `0`)}`;
const formatToDDMMM = (date: Date) => date.toLocaleString(`default`, {
    month: `short`,
    year: `2-digit`,
});
const formatToDDD = (date: Date) => date.toLocaleString(`default`, {
    weekday: `short`,
});

const weekMap = (data: GetPerformancesRepsonse[], type: GroupNameAll, los: boolean) => {
    const date = new Date();
    const sevendays = 86400000;
    return Array(7)
        .fill(1)
        .map((d, i) => {
            const labelDate = new Date(date.getTime() - (i * sevendays));
            const ddmm = formatToDDD(labelDate);
            const from = new Date(date.getTime() - ((i + 1) * sevendays));
            const to = new Date(date.getTime() - (i * sevendays));
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 99);
            return {
                label: ddmm,
                date: labelDate,
                ...data
                    .filter(d => checkIfDateInRange(new Date(d.name), from, to))
                    .reduce(mapData(type, los), defaultMaps),
            };
        })
        .filter((d) => checkWeekend(new Date(d.date)))
        .reverse();
};

const monthMap = (data: GetPerformancesRepsonse[], type: GroupNameAll, los: boolean) => {
    const date = new Date();
    const day = 604800000;
    return Array(5)
        .fill(1)
        .map((d, i) => {
            const labelDate = new Date(date.getTime() - (i * day));
            const ddmm = formatToDDMM(labelDate);
            const from = new Date(date.getTime() - ((i + 1) * day));
            const to = new Date(date.getTime() - (i * day));
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 99);
            return {
                label: ddmm,
                date: labelDate,
                ...data.filter(d => checkIfDateInRange(new Date(d.name), from, to))
                    .reduce(mapData(type, los), defaultMaps),
            };
        })
        .reverse();
};

const yearMap = (data: GetPerformancesRepsonse[], type: GroupNameAll, los: boolean) => {
    const today = new Date();
    const day = 604800000;
    return Array(12)
        .fill(1)
        .map((d, i) => {
            const labelDate = new Date(today.getFullYear(), today.getMonth() - i, today.getDate());
            const ddMMM = formatToDDMMM(labelDate);
            const from = new Date(today.getFullYear(), today.getMonth() - i - 1, today.getDate());
            const to = new Date(today.getFullYear(), today.getMonth() - i, today.getDate());
            to.setHours(23, 59, 59, 999);
            return {
                label: ddMMM,
                date: labelDate,
                ...data.filter(d => checkIfDateInRange(new Date(d.name), from, to))
                    .reduce(mapData(type, los), defaultMaps),
            };
        })
        .reverse();
};

export default function aggregateData (data: GetPerformancesRepsonse[], type: GroupNameAll, los: boolean, filter: 7 | 30 | 365) {
    if(filter === 30) {
        return monthMap(data, type, los);
    } else if(filter === 365) {
        return yearMap(data, type, los);
    } else {
        return weekMap(data, type, los);
    }
}
