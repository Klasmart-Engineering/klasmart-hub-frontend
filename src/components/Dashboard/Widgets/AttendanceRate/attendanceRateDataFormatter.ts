
import { ClassAttendanceRateGroupDataFormatted } from "@/components/Dashboard/models/data.model";
import { ClassAttendanceRateGroupResponse } from "@kidsloop/reports-api-client";
import { Theme } from "@material-ui/core";

export default function attendanceRateDataFormatter (data: ClassAttendanceRateGroupResponse, theme: Theme): ClassAttendanceRateGroupDataFormatted[] {
    const formattedData: ClassAttendanceRateGroupDataFormatted[] = [
        {
            label: `High attendance`,
            color: theme.palette.info.main,
            value: 0,
        },
        {
            label: `Medium attendance`,
            color: theme.palette.warning.main,
            value: 0,
        },
        {
            label: `Low attendance`,
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
