import { ReactElement } from "react";

export interface Widget {
    id: string;
    type: ReactElement;
    dimensions?: { w: number; h: number };
}

export enum WidgetType {
    // TEACHER
    SCHEDULE = `101`,
    NEXTCLASS = `102`,
    ATTENDANCERATE = `103`,
    PENDINGASSESSMENTS = `104`,
    TEACHERLOAD = `105`,
    CONTENTSTATUS = `106`,
    //STUDENT
    STUDENTATTENDANCE = `201`,
    ACHIEVEMENT = `202`,
    COMPLETION = `203`,
    FEEDBACK = `204`,
    STUDENTSCHEDULE = `205`,
    LEARNINGOUTCOME = `206`,
    ADAPTIVELEARNING = `207`,
    STUDENTNEXTCLASS = `208`,
    ADAPTIVELEARNINGJOURNEY = `209`
}
