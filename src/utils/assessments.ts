import { ScheduleServerType } from "@/api/restapi";

export type ScheduleClientType = `class` | `live` | `study` | `home_fun_study`

export const mapAssessmentScheduleServerToClientType = (type: ScheduleServerType): ScheduleClientType => {
    switch (type) {
    case `OfflineClass`: return `class`;
    case `OnlineClass`: return `live`;
    case `Homework`: return `study`;
    case `IsHomeFun`: return `home_fun_study`;
    }
};
