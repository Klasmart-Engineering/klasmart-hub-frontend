import { ReactElement } from "react";

export interface Widget {
    id: string;
    type: ReactElement;
    dimensions?: { w: number; h: number };
}

export enum WidgetType {
    SCHEDULE = `0`,
    NEXTCLASS = `1`,
    ATTENDANCERATE = `2`,
    PENDINGASSESSMENTS = `3`,
    TEACHERLOAD = `4`,
    CONTENTSTATUS = `5`,
}
