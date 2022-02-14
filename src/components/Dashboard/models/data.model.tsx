import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ReactElement } from "react";

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
    intlKey: string | ReactElement;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    classType: string;
    count: number;
}

export interface ClassAttendanceLegendLabels {
    high: string;
    medium: string;
    low: string;
}
