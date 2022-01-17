import { PendingAssignmentInfoFormatted } from "@/components/Dashboard/models/data.model";
import { classTypeIdentities } from "@/config/classTypes";
import { PendingAssignmentsResponse } from "@kidsloop/reports-api-client";

enum ClassType {
    LIVE = `live`,
    CLASS= `class`,
    HOMEWORK = `homework`,
    STUDY = `study`
}

export default function pendingAssesmentsDataFormatter (data: PendingAssignmentsResponse): PendingAssignmentInfoFormatted[] {
    const pendingCountMap: {
        live: number;
        class: number;
        homework: number;
        study: number;
    } = {
        [ClassType.LIVE]: data?.info?.filter((item)=>item.class_type === ClassType.LIVE).reduce((sum:number, item) => {return sum + item.count; }, 0) || 0,
        [ClassType.CLASS]: data?.info?.filter((item)=>item.class_type === ClassType.CLASS).reduce((sum:number, item) => {return sum + item.count; }, 0) || 0,
        [ClassType.HOMEWORK]: data?.info?.filter((item)=>item.class_type === ClassType.HOMEWORK).reduce((sum:number, item) => {return sum + item.count; }, 0) || 0,
        [ClassType.STUDY]: data?.info?.filter((item)=>item.class_type === ClassType.STUDY).reduce((sum:number, item) => {return sum + item.count; }, 0) || 0,
    };

    const formattedData: PendingAssignmentInfoFormatted[]= [
        {
            ...classTypeIdentities.live,
            classType: ClassType.LIVE,
            count: pendingCountMap[ClassType.LIVE],
        },
        {
            ...classTypeIdentities.class,
            classType: ClassType.CLASS,
            count: pendingCountMap[ClassType.CLASS],
        },
        {
            ...classTypeIdentities.homefun,
            classType: ClassType.HOMEWORK,
            count: pendingCountMap[ClassType.HOMEWORK],
        },
        {
            ...classTypeIdentities.study,
            classType: ClassType.STUDY,
            count: pendingCountMap[ClassType.STUDY],
        },
    ];

    return formattedData;
}
