
export const getOverallPerformanceData = (id: string | undefined, timeline: string) => {
    switch (id) {
    case `above`:
    case `ae1`:
    case `ae2`:
    case `ae3`:
        switch (timeline) {
        case `Week`:
            return [
                {
                    date: `2022-04-18`,
                    above: 70,
                    score: {
                        above: 35,
                    },
                },
                {
                    date: `2022-04-19`,
                    above: 60,
                    score: {
                        above: 58,
                    },
                },
                {
                    date: `2022-04-20`,
                    above: 80,
                    score: {
                        above: 65,
                    },
                },
                {
                    date: `2022-04-21`,
                    above: 75,
                    score: {
                        above: 65,
                    },
                },
                {
                    date: `2022-04-22`,
                    above: 80,
                    score: {
                        above: 70,
                    },
                },
            ];
        case `Month`:
            return [
                {
                    date: `2022-04-01`,
                    above: 60,
                    score: {
                        above: 50,
                    },
                },
                {
                    date: `2022-04-08`,
                    above: 68,
                    score: {
                        above: 58,
                    },
                },
                {
                    date: `2022-04-16`,
                    above: 75,
                    score: {
                        above: 65,
                    },
                },
                {
                    date: `2022-04-23`,
                    above: 75,
                    score: {
                        above: 65,
                    },
                },
            ];
        case `Year`:
            return [
                {
                    date: `2021-04-01`,
                    above: 60,
                    score: {
                        above: 50,
                    },
                },
                {
                    date: `2021-05-01`,
                    above: 68,
                    score: {
                        above: 58,
                    },
                },
                {
                    date: `2021-06-01`,
                    above: 75,
                    score: {
                        above: 65,
                    },
                },
                {
                    date: `2021-07-01`,
                    above: 75,
                    score: {
                        above: 65,
                    },
                },
                {
                    date: `2021-08-01`,
                    above: 80,
                    score: {
                        above: 70,
                    },
                },
                {
                    date: `2021-09-01`,
                    above: 60,
                    score: {
                        above: 50,
                    },
                },
                {
                    date: `2021-10-01`,
                    above: 68,
                    score: {
                        above: 58,
                    },
                },
                {
                    date: `2021-11-01`,
                    above: 75,
                    score: {
                        above: 65,
                    },
                },
                {
                    date: `2021-12-01`,
                    above: 75,
                    score: {
                        above: 65,
                    },
                },
                {
                    date: `2022-01-01`,
                    above: 80,
                    score: {
                        above: 70,
                    },
                },
                {
                    date: `2022-02-01`,
                    above: 60,
                    score: {
                        above: 50,
                    },
                },
                {
                    date: `2022-03-01`,
                    above: 68,
                    score: {
                        above: 58,
                    },
                },
            ];
        default:
            return [
                {
                    date: `2022-04-18`,
                    above: 60,
                    score: {
                        above: 50,
                    },
                },
                {
                    date: `2022-04-19`,
                    above: 68,
                    score: {
                        above: 58,
                    },
                },
                {
                    date: `2022-04-20`,
                    above: 75,
                    score: {
                        above: 65,
                    },
                },
                {
                    date: `2022-04-21`,
                    above: 75,
                    score: {
                        above: 65,
                    },
                },
                {
                    date: `2022-04-22`,
                    above: 80,
                    score: {
                        above: 70,
                    },
                },
            ];
            break;
        }

    case `meets`:
    case `me1`:
    case `me2`:
    case `me3`:
        switch (timeline) {
        case `Week`:
            return [
                {
                    date: `2022-04-18`,
                    meets: 46,
                    score: {
                        meets: 40,
                    },
                },
                {
                    date: `2022-04-19`,
                    meets: 50,
                    score: {
                        meets: 38,
                    },
                },
                {
                    date: `2022-04-20`,
                    meets: 40,
                    score: {
                        meets: 45,
                    },
                },
                {
                    date: `2022-04-21`,
                    meets: 53,
                    score: {
                        meets: 45,
                    },
                },
                {
                    date: `2022-04-22`,
                    meets: 55,
                    score: {
                        meets: 50,
                    },
                },
            ];
        case `Month`:
            return [
                {
                    date: `2022-04-01`,
                    meets: 40,
                    score: {
                        meets: 35,
                    },
                },
                {
                    date: `2022-04-08`,
                    meets: 48,
                    score: {
                        meets: 38,
                    },
                },
                {
                    date: `2022-04-16`,
                    meets: 50,
                    score: {
                        meets: 45,
                    },
                },
                {
                    date: `2022-04-23`,
                    meets: 40,
                    score: {
                        meets: 45,
                    },
                },
            ];
        case `Year`:
            return [
                {
                    date: `2021-04-01`,
                    meets: 46,
                    score: {
                        meets: 40,
                    },
                },
                {
                    date: `2021-05-01`,
                    meets: 50,
                    score: {
                        meets: 38,
                    },
                },
                {
                    date: `2021-06-01`,
                    meets: 40,
                    score: {
                        meets: 45,
                    },
                },
                {
                    date: `2021-07-01`,
                    meets: 53,
                    score: {
                        meets: 45,
                    },
                },
                {
                    date: `2021-08-01`,
                    meets: 46,
                    score: {
                        meets: 40,
                    },
                },
                {
                    date: `2021-09-01`,
                    meets: 50,
                    score: {
                        meets: 38,
                    },
                },
                {
                    date: `2021-10-01`,
                    meets: 40,
                    score: {
                        meets: 45,
                    },
                },
                {
                    date: `2021-11-01`,
                    meets: 53,
                    score: {
                        meets: 45,
                    },
                },
                {
                    date: `2021-12-01`,
                    meets: 46,
                    score: {
                        meets: 40,
                    },
                },
                {
                    date: `2022-01-01`,
                    meets: 50,
                    score: {
                        meets: 38,
                    },
                },
                {
                    date: `2022-02-01`,
                    meets: 40,
                    score: {
                        meets: 45,
                    },
                },
                {
                    date: `2022-03-01`,
                    meets: 53,
                    score: {
                        meets: 45,
                    },
                },
            ];
        default:
            return [
                {
                    date: `2022-04-18`,
                    meets: 40,
                    score: {
                        meets: 35,
                    },
                },
                {
                    date: `2022-04-19`,
                    meets: 48,
                    score: {
                        meets: 38,
                    },
                },
                {
                    date: `2022-04-20`,
                    meets: 55,
                    score: {
                        meets: 45,
                    },
                },
                {
                    date: `2022-04-21`,
                    meets: 55,
                    score: {
                        meets: 45,
                    },
                },
                {
                    date: `2022-04-22`,
                    meets: 60,
                    score: {
                        meets: 50,
                    },
                },
            ];
            break;
        }

    case `below`:
    case `be1`:
    case `be2`:
    case `be3`:
        switch (timeline) {
        case `Week`:
            return [
                {
                    date: `2022-04-18`,
                    below: 30,
                    score: {
                        below: 20,
                    },
                },
                {
                    date: `2022-04-19`,
                    below: 30,
                    score: {
                        below: 20,
                    },
                },
                {
                    date: `2022-04-20`,
                    below: 25,
                    score: {
                        below: 15,
                    },
                },
                {
                    date: `2022-04-21`,
                    below: 20,
                    score: {
                        below: 10,
                    },
                },
                {
                    date: `2022-04-22`,
                    below: 23,
                    score: {
                        below: 13,
                    },
                },
            ];
        case `Month`:
            return [
                {
                    date: `2022-04-01`,
                    below: 10,
                    score: {
                        below: 20,
                    },
                },
                {
                    date: `2022-04-08`,
                    below: 30,
                    score: {
                        below: 20,
                    },
                },
                {
                    date: `2022-04-16`,
                    below: 25,
                    score: {
                        below: 15,
                    },
                },
                {
                    date: `2022-04-23`,
                    below: 20,
                    score: {
                        below: 10,
                    },
                },
            ];
        case `Year`:
            return [
                {
                    date: `2021-04-01`,
                    below: 30,
                    score: {
                        below: 20,
                    },
                },
                {
                    date: `2021-05-01`,
                    below: 30,
                    score: {
                        below: 20,
                    },
                },
                {
                    date: `2021-06-01`,
                    below: 25,
                    score: {
                        below: 15,
                    },
                },
                {
                    date: `2021-07-01`,
                    below: 20,
                    score: {
                        below: 10,
                    },
                },
                {
                    date: `2021-08-01`,
                    below: 23,
                    score: {
                        below: 13,
                    },
                },
                {
                    date: `2021-09-01`,
                    below: 30,
                    score: {
                        below: 20,
                    },
                },
                {
                    date: `2021-10-01`,
                    below: 30,
                    score: {
                        below: 20,
                    },
                },
                {
                    date: `2021-11-01`,
                    below: 25,
                    score: {
                        below: 15,
                    },
                },
                {
                    date: `2021-12-01`,
                    below: 20,
                    score: {
                        below: 10,
                    },
                },
                {
                    date: `2022-01-01`,
                    below: 23,
                    score: {
                        below: 13,
                    },
                },
                {
                    date: `2022-02-01`,
                    below: 30,
                    score: {
                        below: 20,
                    },
                },
                {
                    date: `2022-03-01`,
                    below: 30,
                    score: {
                        below: 20,
                    },
                },
            ];
        default:
            return [
                {
                    date: `2022-04-18`,
                    below: 30,
                    score: {
                        below: 20,
                    },
                },
                {
                    date: `2022-04-19`,
                    below: 30,
                    score: {
                        below: 20,
                    },
                },
                {
                    date: `2022-04-20`,
                    below: 25,
                    score: {
                        below: 15,
                    },
                },
                {
                    date: `2022-04-21`,
                    below: 20,
                    score: {
                        below: 10,
                    },
                },
                {
                    date: `2022-04-22`,
                    below: 23,
                    score: {
                        below: 13,
                    },
                },
            ];
            break;
        }
    default:
        switch (timeline) {
        case `Week`:
            return [
                {
                    date: `2022-04-18`,
                    above: 70,
                    meets: 40,
                    below: 10,
                    score: {
                        above: 35,
                        meets: 40,
                        below: 5,
                    },
                },
                {
                    date: `2022-04-19`,
                    above: 60,
                    meets: 48,
                    below: 30,
                    score: {
                        above: 58,
                        meets: 38,
                        below: 20,
                    },
                },
                {
                    date: `2022-04-20`,
                    above: 80,
                    meets: 55,
                    below: 25,
                    score: {
                        above: 65,
                        meets: 45,
                        below: 15,
                    },
                },
                {
                    date: `2022-04-21`,
                    above: 75,
                    meets: 55,
                    below: 20,
                    score: {
                        above: 65,
                        meets: 45,
                        below: 10,
                    },
                },
                {
                    date: `2022-04-22`,
                    above: 80,
                    meets: 60,
                    below: 23,
                    score: {
                        above: 70,
                        meets: 50,
                        below: 13,
                    },
                },
            ];
        case `Month`:
            return [
                {
                    date: `2022-04-01`,
                    above: 60,
                    meets: 40,
                    below: 30,
                    score: {
                        above: 50,
                        meets: 35,
                        below: 20,
                    },
                },
                {
                    date: `2022-04-08`,
                    above: 68,
                    meets: 48,
                    below: 30,
                    score: {
                        above: 58,
                        meets: 38,
                        below: 20,
                    },
                },
                {
                    date: `2022-04-16`,
                    above: 75,
                    meets: 55,
                    below: 25,
                    score: {
                        above: 65,
                        meets: 45,
                        below: 15,
                    },
                },
                {
                    date: `2022-04-23`,
                    above: 75,
                    meets: 55,
                    below: 20,
                    score: {
                        above: 65,
                        meets: 45,
                        below: 10,
                    },
                },
            ];
        case `Year`:
            return [
                {
                    date: `2021-04-01`,
                    above: 60,
                    meets: 40,
                    below: 30,
                    score: {
                        above: 50,
                        meets: 35,
                        below: 20,
                    },
                },
                {
                    date: `2021-05-01`,
                    above: 68,
                    meets: 48,
                    below: 30,
                    score: {
                        above: 58,
                        meets: 38,
                        below: 20,
                    },
                },
                {
                    date: `2021-06-01`,
                    above: 75,
                    meets: 55,
                    below: 25,
                    score: {
                        above: 65,
                        meets: 45,
                        below: 15,
                    },
                },
                {
                    date: `2021-07-01`,
                    above: 75,
                    meets: 55,
                    below: 20,
                    score: {
                        above: 65,
                        meets: 45,
                        below: 10,
                    },
                },
                {
                    date: `2021-08-01`,
                    above: 80,
                    meets: 60,
                    below: 23,
                    score: {
                        above: 70,
                        meets: 50,
                        below: 13,
                    },
                },
                {
                    date: `2021-09-01`,
                    above: 60,
                    meets: 40,
                    below: 30,
                    score: {
                        above: 50,
                        meets: 35,
                        below: 20,
                    },
                },
                {
                    date: `2021-10-01`,
                    above: 68,
                    meets: 48,
                    below: 30,
                    score: {
                        above: 58,
                        meets: 38,
                        below: 20,
                    },
                },
                {
                    date: `2021-11-01`,
                    above: 75,
                    meets: 55,
                    below: 25,
                    score: {
                        above: 65,
                        meets: 45,
                        below: 15,
                    },
                },
                {
                    date: `2021-12-01`,
                    above: 75,
                    meets: 55,
                    below: 20,
                    score: {
                        above: 65,
                        meets: 45,
                        below: 10,
                    },
                },
                {
                    date: `2022-01-01`,
                    above: 80,
                    meets: 60,
                    below: 23,
                    score: {
                        above: 70,
                        meets: 50,
                        below: 13,
                    },
                },
                {
                    date: `2022-02-01`,
                    above: 60,
                    meets: 40,
                    below: 30,
                    score: {
                        above: 50,
                        meets: 35,
                        below: 20,
                    },
                },
                {
                    date: `2022-03-01`,
                    above: 68,
                    meets: 48,
                    below: 30,
                    score: {
                        above: 58,
                        meets: 38,
                        below: 20,
                    },
                },
            ];
        default:
            return [
                {
                    date: `2022-04-18`,
                    above: 60,
                    meets: 40,
                    below: 30,
                    score: {
                        above: 50,
                        meets: 35,
                        below: 20,
                    },
                },
                {
                    date: `2022-04-19`,
                    above: 68,
                    meets: 48,
                    below: 30,
                    score: {
                        above: 58,
                        meets: 38,
                        below: 20,
                    },
                },
                {
                    date: `2022-04-20`,
                    above: 75,
                    meets: 55,
                    below: 25,
                    score: {
                        above: 65,
                        meets: 45,
                        below: 15,
                    },
                },
                {
                    date: `2022-04-21`,
                    above: 75,
                    meets: 55,
                    below: 20,
                    score: {
                        above: 65,
                        meets: 45,
                        below: 10,
                    },
                },
                {
                    date: `2022-04-22`,
                    above: 80,
                    meets: 60,
                    below: 23,
                    score: {
                        above: 70,
                        meets: 50,
                        below: 13,
                    },
                },
            ];
            break;
        }
    }
};

export const skillPerformanceData = [
    {
        date: `2022-04-22`,
        data: [
            {
                category: `Number Sense & Place Value`,
                skills: [
                    {
                        name: `Counting`,
                        achieved: 34,
                        notAchieved: 1,
                        total: 35,
                        score: {
                            achieved: 44,
                            notAchieved: 10,
                            total: 45,
                        },
                    },
                    {
                        name: `Place Value`,
                        achieved: 54,
                        notAchieved: 1,
                        total: 55,
                        score: {
                            achieved: 20,
                            notAchieved: 1,
                            total: 21,
                        },
                    },
                    {
                        name: `Cardinality`,
                        achieved: 56,
                        notAchieved: 20,
                        total: 76,
                        score: {
                            achieved: 34,
                            notAchieved: 1,
                            total: 35,
                        },
                    },
                    {
                        name: `Comparing`,
                        achieved: 74,
                        notAchieved: 1,
                        total: 75,
                        score: {
                            achieved: 43,
                            notAchieved: 1,
                            total: 44,
                        },
                    },
                    {
                        name: `Add and Sub`,
                        achieved: 87,
                        notAchieved: 10,
                        total: 97,
                        score: {
                            achieved: 20,
                            notAchieved: 5,
                            total: 25,
                        },
                    },
                ],
            },
            {
                category: `Measurement & Data`,
                skills: [
                    {
                        name: `Measurement`,
                        achieved: 33,
                        notAchieved: 1,
                        total: 34,
                        score: {
                            achieved: 56,
                            notAchieved: 10,
                            total: 66,
                        },
                    },
                    {
                        name: `Data`,
                        achieved: 77,
                        notAchieved: 1,
                        total: 78,
                        score: {
                            achieved: 30,
                            notAchieved: 1,
                            total: 31,
                        },
                    },
                    {
                        name: `Geometry`,
                        achieved: 78,
                        notAchieved: 2,
                        total: 80,
                        score: {
                            achieved: 40,
                            notAchieved: 5,
                            total: 45,
                        },
                    },
                ],
            },
            {
                category: `Fine Motor Skills`,
                skills: [
                    {
                        name: `Using Tools`,
                        achieved: 65,
                        notAchieved: 1,
                        total: 66,
                        score: {
                            achieved: 44,
                            notAchieved: 1,
                            total: 45,
                        },
                    },
                    {
                        name: `Drawing`,
                        achieved: 43,
                        notAchieved: 1,
                        total: 44,
                        score: {
                            achieved: 77,
                            notAchieved: 7,
                            total: 84,
                        },
                    },
                    {
                        name: `Problem solving`,
                        achieved: 20,
                        notAchieved: 20,
                        total: 40,
                        score: {
                            achieved: 15,
                            notAchieved: 15,
                            total: 30,
                        },
                    },
                    {
                        name: `Self-confidence`,
                        achieved: 90,
                        notAchieved: 1,
                        total: 91,
                        score: {
                            achieved: 54,
                            notAchieved: 1,
                            total: 55,
                        },
                    },
                    {
                        name: `Self-Awareness`,
                        achieved: 65,
                        notAchieved: 1,
                        total: 66,
                        score: {
                            achieved: 23,
                            notAchieved: 1,
                            total: 24,
                        },
                    },
                    {
                        name: `Social Interaction`,
                        achieved: 10,
                        notAchieved: 40,
                        total: 50,
                        score: {
                            achieved: 42,
                            notAchieved: 1,
                            total: 43,
                        },
                    },
                ],
            },
        ],
    },
];

interface SkillData {
    category: string;
    skills: {
        name: string;
        achieved: number;
        notAchieved: number;
        total: number;
        score: {
            achieved: number;
            notAchieved: number;
            total: number;
        };
    }[];
}

export const getSkillSlides = (data: SkillData, setSkillCategories: (category: string) => void) => {
    const skillSets = Math.ceil(data.skills.length / 5);
    return [ ...Array(skillSets) ].map((set, i) => {
        setSkillCategories(data.category);
        return data.skills.splice(0, 5)
            .map(({
                name, achieved, notAchieved, score,
            }) => (
                {
                    performanceScores: {
                        name,
                        achieved,
                        notAchieved,
                    },
                    learningOutcomeScores: {
                        name,
                        achieved: score.achieved,
                        notAchieved: score.notAchieved,
                    },
                }
            ));
    });
};
