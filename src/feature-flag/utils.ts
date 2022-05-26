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
    } as FeatureFlags;
};
