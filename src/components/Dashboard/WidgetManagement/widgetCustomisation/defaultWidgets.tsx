import AttendanceRateWidget from "../../Widgets/AttendanceRate/AttendanceRate";
import ContentStatusWidget from "../../Widgets/ContentStatus/ContentStatus";
import NextClassWidget from "../../Widgets/NextClass/NextClass";
import PendingAssessmentsWidget from "../../Widgets/PendingAssessments/PendingAssessments";
import TeacherLoadWidget from "../../Widgets/TeacherLoadWidget/TeacherLoadWidget";
import TodaysScheduleWidget from "../../Widgets/TodaysSchedule/TodaysSchedule";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import React,
{ ReactElement } from "react";

export type Widgets = { [P: string]: ReactElement }

export type Layout = {i: WidgetType; x: number; y: number; h: number; w: number}

export type Layouts = { [P: string]: Layout[] }

export const defaultWidgetMap: Widgets = {
    [WidgetType.SCHEDULE]: <TodaysScheduleWidget />,
    [WidgetType.NEXTCLASS]: <NextClassWidget />,
    [WidgetType.ATTENDANCERATE]: <AttendanceRateWidget />,
    [WidgetType.PENDINGASSESSMENTS]: <PendingAssessmentsWidget />,
    [WidgetType.TEACHERLOAD]: <TeacherLoadWidget />,
    [WidgetType.CONTENTSTATUS]: <ContentStatusWidget />,
};

export const defaultLgLayout = [
    /* eslint-disable */
    { i: WidgetType.SCHEDULE,           x: 0, y: 0, h: 2, w: 12 },
    { i: WidgetType.NEXTCLASS,          x: 0, y: 1, h: 3, w: 4 },
    { i: WidgetType.ATTENDANCERATE,     x: 4, y: 1, h: 3, w: 4 },
    { i: WidgetType.PENDINGASSESSMENTS, x: 8, y: 1, h: 3, w: 4 },
    { i: WidgetType.TEACHERLOAD,        x: 0, y: 2, h: 3, w: 4 },
    { i: WidgetType.CONTENTSTATUS,      x: 4, y: 2, h: 3, w: 4 },
    /* eslint-enable */
];

export const defaultMdLayout = [
    /* eslint-disable */
    { i: WidgetType.SCHEDULE,           x: 0, y: 0, h: 2, w: 12 },
    { i: WidgetType.NEXTCLASS,          x: 0, y: 1, h: 3, w: 6 },
    { i: WidgetType.ATTENDANCERATE,     x: 6, y: 1, h: 3, w: 6 },
    { i: WidgetType.PENDINGASSESSMENTS, x: 0, y: 2, h: 3, w: 6 },
    { i: WidgetType.TEACHERLOAD,        x: 6, y: 2, h: 3, w: 6 },
    { i: WidgetType.CONTENTSTATUS,      x: 0, y: 3, h: 3, w: 6 },
    /* eslint-enable */
];

export const defaultSmLayout = [
    /* eslint-disable */
    { i: WidgetType.SCHEDULE,           x: 0, y: 4, h: 3, w: 12 },
    { i: WidgetType.NEXTCLASS,          x: 0, y: 0, h: 4, w: 12 },
    { i: WidgetType.ATTENDANCERATE,     x: 0, y: 8, h: 3, w: 12 },
    { i: WidgetType.PENDINGASSESSMENTS, x: 0, y: 12, h: 3, w: 12 },
    { i: WidgetType.TEACHERLOAD,        x: 0, y: 16, h: 3, w: 12 },
    { i: WidgetType.CONTENTSTATUS,      x: 0, y: 20, h: 3, w: 12 },
    /* eslint-enable */
];
