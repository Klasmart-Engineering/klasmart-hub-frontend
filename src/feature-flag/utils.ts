import { useFlags } from "launchdarkly-react-client-sdk";

export type FeatureFlags = {
    studentWidgetAdaptiveLearning: boolean;
    studentWidgetAdaptiveLearningJourney: boolean;
    teacherStudentProgressReport: boolean;
}

const defaultFlags: FeatureFlags = {
    studentWidgetAdaptiveLearning: false,
    studentWidgetAdaptiveLearningJourney: false,
    teacherStudentProgressReport: false,
};

export const useFeatureFlags = () => {
    const flags = useFlags() as FeatureFlags;
    return {
        ...defaultFlags,
        ...flags,
    } as FeatureFlags;
};
