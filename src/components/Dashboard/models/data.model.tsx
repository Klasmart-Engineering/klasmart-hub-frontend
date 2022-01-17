import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";

export interface ClassAttendanceRateGroupDataFormatted {
    label: string; // label for data
    color: string; // color for segment
    value?: number; // value of data
    count?: number; // count ONLY GRP1
}

export interface ContentTeacherFormatted {
    draft: number;
    approved: number;
    pending: number;
    rejected: number;
    total: number;
}
export interface PendingAssignmentInfoFormatted {
    color: string;
    intlKey: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    classType: string;
    count: number;
}
