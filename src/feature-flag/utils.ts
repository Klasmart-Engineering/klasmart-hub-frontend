export interface FeatureFlags {
    studentWidgetAdaptiveLearning: boolean;
    studentWidgetAdaptiveLearningJourney: boolean;
    teacherStudentProgressReport: boolean;
}

export const useFeatureFlags = () => {
    return {
        studentWidgetAdaptiveLearningJourney: process.env.STUDENT_WIDGET_ADAPTIVE_LEARNING_JOURNEY === `true`,
        studentWidgetAdaptiveLearning: process.env.STUDENT_WIDGET_ADAPTIVE_LEARNING === `true`,
        teacherStudentProgressReport: process.env.TEACHER_STUDENT_PROGRESS_REPORT === `true`,
    } as FeatureFlags;
};
