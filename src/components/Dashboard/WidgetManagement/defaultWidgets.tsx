import AttendanceRateWidget from "../Widgets/AttendanceRate/AttendanceRate";
import ContentStatusWidget from "../Widgets/ContentStatus/ContentStatus";
import NextClassWidget from "../Widgets/NextClass/NextClass";
import PendingAssessmentsWidget from "../Widgets/PendingAssessments/PendingAssessments";
import AchievementWidget from "../Widgets/student/Achievement/AchievementWidget";
import CompletionWidget from "../Widgets/student/Completion/CompletionWidget";
import StudentAttendanceWidget from "../Widgets/student/StudentAttendance/StudentAttendance";
import TreacherFeedbackWidget from "../Widgets/student/TeacherFeedback/TeacherFeedbackWidget";
import TeacherLoadWidget from "../Widgets/TeacherLoadWidget/TeacherLoadWidget";
import TodaysScheduleWidget from "../Widgets/TodaysSchedule/TodaysSchedule";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import React,
{ ReactElement } from "react";

export type Widgets = { [P: string]: ReactElement }

export type Layout = {i: WidgetType; x: number; y: number; h: number; w: number}

export type Layouts = { [P: string]: Layout[] }

export enum WidgetView {
    TEACHER = `teacher`,
    STUDENT = `student`,
    DEFAULT = `default`
}

export const defaultTeacherWidgetMap: Widgets = {
    [WidgetType.SCHEDULE]: <TodaysScheduleWidget />,
    [WidgetType.NEXTCLASS]: <NextClassWidget />,
    [WidgetType.ATTENDANCERATE]: <AttendanceRateWidget />,
    [WidgetType.PENDINGASSESSMENTS]: <PendingAssessmentsWidget />,
    [WidgetType.TEACHERLOAD]: <TeacherLoadWidget />,
    [WidgetType.CONTENTSTATUS]: <ContentStatusWidget />,
};

export const defaultTeacherLgLayout: Layout[] = [
    /* eslint-disable */
    { i: WidgetType.SCHEDULE,           x: 0, y: 0, h: 2, w: 12 },
    { i: WidgetType.NEXTCLASS,          x: 0, y: 1, h: 3, w: 4 },
    { i: WidgetType.ATTENDANCERATE,     x: 4, y: 1, h: 3, w: 4 },
    { i: WidgetType.PENDINGASSESSMENTS, x: 8, y: 1, h: 3, w: 4 },
    { i: WidgetType.TEACHERLOAD,        x: 0, y: 2, h: 3, w: 4 },
    { i: WidgetType.CONTENTSTATUS,      x: 4, y: 2, h: 3, w: 4 },
    /* eslint-enable */
];

export const defaultTeacherMdLayout: Layout[] = [
    /* eslint-disable */
    { i: WidgetType.SCHEDULE,           x: 0, y: 0, h: 2, w: 12 },
    { i: WidgetType.NEXTCLASS,          x: 0, y: 1, h: 3, w: 6 },
    { i: WidgetType.ATTENDANCERATE,     x: 6, y: 1, h: 3, w: 6 },
    { i: WidgetType.PENDINGASSESSMENTS, x: 0, y: 2, h: 3, w: 6 },
    { i: WidgetType.TEACHERLOAD,        x: 6, y: 2, h: 3, w: 6 },
    { i: WidgetType.CONTENTSTATUS,      x: 0, y: 3, h: 3, w: 6 },
    /* eslint-enable */
];

export const defaultTeacherSmLayout: Layout[] = [
    /* eslint-disable */
    { i: WidgetType.SCHEDULE,           x: 0, y: 4, h: 3, w: 12 },
    { i: WidgetType.NEXTCLASS,          x: 0, y: 0, h: 4, w: 12 },
    { i: WidgetType.ATTENDANCERATE,     x: 0, y: 8, h: 3, w: 12 },
    { i: WidgetType.PENDINGASSESSMENTS, x: 0, y: 12, h: 3, w: 12 },
    { i: WidgetType.TEACHERLOAD,        x: 0, y: 16, h: 3, w: 12 },
    { i: WidgetType.CONTENTSTATUS,      x: 0, y: 20, h: 3, w: 12 },
    /* eslint-enable */
];

const teacherLayout: Layouts = {
    lg: defaultTeacherLgLayout,
    md: defaultTeacherMdLayout,
    sm: defaultTeacherSmLayout,
};

export const defaultStudentWidgetMap: Widgets = {
    [WidgetType.FEEDBACK]: <TreacherFeedbackWidget />,
    [WidgetType.STUDENTATTENDANCE]: <StudentAttendanceWidget />,
    [WidgetType.ACHIEVEMENT]: <AchievementWidget />,
    [WidgetType.COMPLETION]: <CompletionWidget />,
};

export const defaultStudentLgLayout: Layout[] = [
    /* eslint-disable */
    { i: WidgetType.FEEDBACK,             x: 0, y: 1, h: 3, w: 4 },
    { i: WidgetType.STUDENTATTENDANCE,    x: 4, y: 1, h: 3, w: 4 },
    { i: WidgetType.ACHIEVEMENT,          x: 8, y: 1, h: 3, w: 4 },
    { i: WidgetType.COMPLETION,           x: 0, y: 1, h: 3, w: 4 },
    /* eslint-enable */
];

export const defaultStudentMdLayout: Layout[] = [
    /* eslint-disable */
    { i: WidgetType.FEEDBACK,             x: 0, y: 0, h: 3, w: 6 },
    { i: WidgetType.STUDENTATTENDANCE,    x: 6, y: 4, h: 3, w: 6 },
    { i: WidgetType.ACHIEVEMENT,          x: 6, y: 0, h: 3, w: 6 },
    { i: WidgetType.COMPLETION,           x: 0, y: 4, h: 3, w: 6 },
    /* eslint-enable */
];

export const defaultStudentSmLayout: Layout[] = [
    /* eslint-disable */
    { i: WidgetType.FEEDBACK,             x: 0, y: 0, h: 3, w: 12 },
    { i: WidgetType.STUDENTATTENDANCE,    x: 0, y: 4, h: 3, w: 12 },
    { i: WidgetType.ACHIEVEMENT,          x: 0, y: 8, h: 3, w: 12 },
    { i: WidgetType.COMPLETION,           x: 0, y: 12, h: 3, w: 12 },
    /* eslint-enable */
];

const studentLayout: Layouts = {
    lg: defaultStudentLgLayout,
    md: defaultStudentMdLayout,
    sm: defaultStudentSmLayout,
};

export default function getLayouts (view: WidgetView) {
    switch(view) {
    case WidgetView.STUDENT:
        return {
            layouts: studentLayout,
            widgets: defaultStudentWidgetMap,
        };
    case WidgetView.TEACHER:
        return {
            layouts: teacherLayout,
            widgets: defaultTeacherWidgetMap,
        };
    default:
        return {
            layouts: teacherLayout,
            widgets: defaultTeacherWidgetMap,
        };
    }
}
