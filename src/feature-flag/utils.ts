import { useFlags } from "launchdarkly-react-client-sdk";

export type FeatureFlags = {
      studentWidgetAdaptiveLearning: boolean;
      studentWidgetAdaptiveLearningJourney: boolean;
}

export const useFeatureFlags = () => {
    const flags = useFlags();
    return flags as FeatureFlags;
};