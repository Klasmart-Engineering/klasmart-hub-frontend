
import {
    ClassAttendanceLegendLabels,
    ClassAttendanceRateGroupDataFormatted,
} from "@/components/Dashboard/models/data.model";
import { ClassAttendanceRateGroupResponse } from "@kl-engineering/reports-api-client";
import { Theme } from "@mui/material";

export default function attendanceRateDataFormatter (data: ClassAttendanceRateGroupResponse, theme: Theme, dataLabels: ClassAttendanceLegendLabels): ClassAttendanceRateGroupDataFormatted[] {
    const formattedData: ClassAttendanceRateGroupDataFormatted[] = [
        {
            label: dataLabels.high,
            color: theme.palette.info.main,
            value: 0,
        },
        {
            label: dataLabels.medium,
            color: theme.palette.warning.main,
            value: 0,
        },
        {
            label: dataLabels.low,
            color: theme.palette.error.light,
            value: 0,
            count: 0,
        },
    ];

    for (const property in data.info) {
        switch (property) {
        case `grp1`:
            formattedData[2].value = data.info[property];
            break;
        case `grp2`:
            formattedData[1].value = data.info[property];
            break;
        case `grp3`:
            formattedData[0].value = data.info[property];
            break;
        case `grp1count`:
            formattedData[2].count = data.info[property];
            break;
        default:
            break;
        }
    }
    return formattedData;
}
