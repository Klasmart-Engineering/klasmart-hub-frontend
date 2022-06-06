import { useFlags } from "launchdarkly-react-client-sdk";

const defaultFlags = {
    studentWidgetAdaptiveLearning: false,
    studentWidgetAdaptiveLearningJourney: false,
    teacherStudentProgressReport: false,
} as const;

export type FeatureFlags = typeof defaultFlags;

export const useFeatureFlags = () => {
    const flags = useFlags() as FeatureFlags;
    return {
        ...defaultFlags,
        ...flags,
        studentWidgetAdaptiveLearningJourney: process.env.STUDENT_WIDGET_ADAPTIVE_LEARNING_JOURNEY === `true`,
        studentWidgetAdaptiveLearning: process.env.STUDENT_WIDGET_ADAPTIVE_LEARNING === `true`,
        teacherStudentProgressReport: process.env.TEACHER_STUDENT_PROGRESS_REPORT === `true`,
    } as FeatureFlags;
};
