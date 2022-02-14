import AttendanceRateWidget from "../../Widgets/AttendanceRate/AttendanceRate";
import ContentStatusWidget from "../../Widgets/ContentStatus/ContentStatus";
import NextClassWidget from "../../Widgets/NextClass/NextClass";
import PendingAssessmentsWidget from "../../Widgets/PendingAssessments/PendingAssessments";
import TeacherLoadWidget from "../../Widgets/TeacherLoadWidget/TeacherLoadWidget";
import TodaysScheduleWidget from "../../Widgets/TodaysSchedule/TodaysSchedule";
import {
    Layouts,
    Widgets,
} from "./defaultWidgets";
import { updateWidgetOrders } from "./modifyWidgets";
import { getLocalWidgets } from "./widgetStorage";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import React from "react";

type State = {
    editing: boolean;
    widgets: Widgets;
    layouts: Layouts;
}

const defaultLayout = {
    lg: [
        /* eslint-disable */
        { i: WidgetType.SCHEDULE,           x: 0, y: 0, h: 2, w: 12 },
        { i: WidgetType.NEXTCLASS,          x: 0, y: 1, h: 3, w: 4 },
        { i: WidgetType.ATTENDANCERATE,     x: 4, y: 1, h: 3, w: 4 },
        { i: WidgetType.PENDINGASSESSMENTS, x: 8, y: 1, h: 3, w: 4 },
        { i: WidgetType.TEACHERLOAD,        x: 0, y: 2, h: 3, w: 4 },
        { i: WidgetType.CONTENTSTATUS,      x: 4, y: 2, h: 3, w: 4 },
        /* eslint-enable */
    ],
    md: [
        /* eslint-disable */
        { i: WidgetType.SCHEDULE,           x: 0, y: 0, h: 2, w: 12 },
        { i: WidgetType.NEXTCLASS,          x: 0, y: 1, h: 3, w: 6 },
        { i: WidgetType.ATTENDANCERATE,     x: 6, y: 1, h: 3, w: 6 },
        { i: WidgetType.PENDINGASSESSMENTS, x: 0, y: 2, h: 3, w: 6 },
        { i: WidgetType.TEACHERLOAD,        x: 6, y: 2, h: 3, w: 6 },
        { i: WidgetType.CONTENTSTATUS,      x: 0, y: 3, h: 3, w: 6 },
        /* eslint-enable */
    ],
    sm: [
        /* eslint-disable */
        { i: WidgetType.SCHEDULE,           x: 0, y: 4, h: 3, w: 12 },
        { i: WidgetType.NEXTCLASS,          x: 0, y: 0, h: 4, w: 12 },
        { i: WidgetType.ATTENDANCERATE,     x: 0, y: 8, h: 3, w: 12 },
        { i: WidgetType.PENDINGASSESSMENTS, x: 0, y: 12, h: 3, w: 12 },
        { i: WidgetType.TEACHERLOAD,        x: 0, y: 16, h: 3, w: 12 },
        { i: WidgetType.CONTENTSTATUS,      x: 0, y: 20, h: 3, w: 12 },
        /* eslint-enable */
    ],
};

const defaultWidgets: Widgets = {
    [WidgetType.SCHEDULE]: <TodaysScheduleWidget />,
    [WidgetType.NEXTCLASS]: <NextClassWidget />,
    [WidgetType.ATTENDANCERATE]: <AttendanceRateWidget />,
    [WidgetType.PENDINGASSESSMENTS]: <PendingAssessmentsWidget />,
    [WidgetType.TEACHERLOAD]: <TeacherLoadWidget />,
    [WidgetType.CONTENTSTATUS]: <ContentStatusWidget />,
};

export const initialState: State = {
    editing: false,
    widgets: defaultWidgets,
    layouts: defaultLayout,
};

const localState: State = {
    editing: false,
    widgets: getLocalWidgets(defaultWidgets, defaultLayout).widgets,
    layouts: updateWidgetOrders(getLocalWidgets(defaultWidgets, defaultLayout).layouts.lg),
};

export enum WidgetActions {
    EDIT = `edit`,
    RESET = `reset`,
    SAVE = `save`,
    CANCEL = `cancel`,
    REMOVE = `remove`,
    ADD = `add`,
    LOAD = `load`,
    REORDER = `reorder`
}

type Action = {
    type: WidgetActions;
    payload?: any;
}

export const reducer = (state = initialState, action: Action) => {
    switch(action.type) {
    case WidgetActions.EDIT:
        return {
            ...state,
            editing: true,
        };
    case WidgetActions.RESET:
        return {
            ...initialState,
            layouts: updateWidgetOrders(initialState.layouts.lg),
        };
    case WidgetActions.SAVE:
        return {
            ...state,
            editing: false,
            widgets: action.payload.widgets,
            layouts: action.payload.layouts,
        };
    case WidgetActions.CANCEL:
        return {
            ...localState,
        };
    case WidgetActions.REMOVE:
        return {
            ...state,
            widgets: action.payload.widgets,
            layouts: action.payload.layouts,
        };
    case WidgetActions.ADD:
        return {
            ...state,
            widgets: action.payload.widgets,
            layouts: action.payload.layouts,
        };
    case WidgetActions.LOAD:
        return {
            ...state,
            widgets: action.payload.widgets,
            layouts: action.payload.layouts,
        };
    case WidgetActions.REORDER:
        return {
            ...state,
            layouts: action.payload.layouts,
        };
    default:
        return {
            ...state,
        };
    }
};
