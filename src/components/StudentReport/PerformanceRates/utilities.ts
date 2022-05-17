
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
