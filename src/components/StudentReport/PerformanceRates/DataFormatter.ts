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
interface RawDataProps {
    name: string;
    date: Date;
    above: number;
    meets: number;
    below: number;
    learningOutcome: {
        above: number;
        meets: number;
        below: number;
    };
}

const mapData = (type: `all` | `above` | `below` | `meets`, los: boolean) => (p: DataProps, c: RawDataProps) => {
    return {
        ...((type === `all` || type === `above`) && {
            above: c.above + p.above,
        }),
        ...((type === `all` || type === `meets`) && {
            meets: c.meets + p.meets,
        }),
        ...((type === `all` || type === `below`) && {
            below: c.below + p.below,
        }),
        ...(los && {
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
        }),
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
const checkIfDateInRange = (record: DataProps, startDate: Date, endDate: Date) => {
    const date = new Date(record.name);
    return date > startDate && date < endDate;
};
const checkWeekend = (date: Date) => {
    return date.getDay() !== 6 && date.getDay() !== 0;
};
const formatToDDMM = (date: Date) => `${(`${date.getDate()}`).padStart(2, `0`)}/${(`${date.getMonth() + 1}`).padStart(2, `0`)}`;
const formatToDDMMM = (date: Date) => `${date.getDate()} ${date.toLocaleString(`default`, {
    month: `long`,
})}`;
const formatToDDD = (date: Date) => date.toLocaleString(`default`, {
    weekday: `short`,
});

const weekMap = (data: DataProps[], type: `all` | `above` | `below` | `meets`, los: boolean) => {
    const date = new Date();
    const sevendays = 86400000;
    return Array(7)
        .fill(1)
        .map((_, i) => {
            const labelDate = new Date(date.getTime() - (i * sevendays));
            const ddmm = formatToDDD(labelDate);
            const from = new Date(date.getTime() - ((i + 1) * sevendays));
            const to = new Date(date.getTime() - (i * sevendays));
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 99);
            return {
                label: ddmm,
                date: labelDate,
                data: data
                    .filter(d => checkIfDateInRange(d, from, to))
                    .reduce(mapData(type, los), defaultMaps),
            };
        })
        .filter((d) => checkWeekend(new Date(d.date)));
};

const monthMap = (data: DataProps[], type: `all` | `above` | `below` | `meets`, los: boolean) => {
    const date = new Date();
    const day = 604800000;
    return Array(5)
        .fill(1)
        .map((_, i) => {
            const labelDate = new Date(date.getTime() - (i * day));
            const ddmm = formatToDDMM(labelDate);
            const from = new Date(date.getTime() - ((i + 1) * day));
            const to = new Date(date.getTime() - (i * day));
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 99);
            return {
                label: ddmm,
                data: data.filter(d => checkIfDateInRange(d, from, to))
                    .reduce(mapData(type, los), defaultMaps),
            };
        });
};

const yearMap = (data: DataProps[], type: `all` | `above` | `below` | `meets`, los: boolean) => {
    const today = new Date();
    const day = 604800000;
    return Array(12)
        .fill(1)
        .map((_, i) => {
            const label = new Date(today.getFullYear(), today.getMonth() - i, today.getDate());
            const ddMMM = formatToDDMMM(label);
            const from = new Date(today.getFullYear(), today.getMonth() - i - 1, today.getDate());
            const to = new Date(today.getFullYear(), today.getMonth() - i, today.getDate());
            to.setHours(23, 59, 59, 999);
            return {
                label: ddMMM,
                data: data.filter(d => checkIfDateInRange(d, from, to))
                    .reduce(mapData(type, los), defaultMaps),
            };
        });
};

export default function aggregateData (data: DataProps[], type: `all` | `above` | `below` | `meets`, los: boolean, filter: `week` | `month` | `year`) {
    if(filter === `month`) {
        return monthMap(data, type, los);
    } else if(filter === `year`) {
        return yearMap(data, type, los);
    } else {
        return weekMap(data, type, los);
    }
}
