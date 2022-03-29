
import {
    THEME_COLOR_CLASS_TYPE_CLASS,
    THEME_COLOR_CLASS_TYPE_LIVE,
    THEME_COLOR_CLASS_TYPE_STUDY,
    THEME_COLOR_CLASS_TYPE_TASK,
} from "@/config/index";
import { ScheduleClassType } from '@kl-engineering/cms-api-client';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import LocalLibraryOutlinedIcon from "@mui/icons-material/LocalLibraryOutlined";
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React,
{ ReactElement } from "react";
import { FormattedMessage } from "react-intl";

export enum ClassType {
    LIVE = `live`,
    STUDY = `study`,
    HOMEFUN = `homefun`,
    CLASS = `class`,
    TASK = `task`,
}
interface ClassTypeIdentity {
    intlKey: string | ReactElement;
    color: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    aliases?: (string|ScheduleClassType)[];
}

const classTypeIdentities : Record<string | ClassType, ClassTypeIdentity> = {
    live : {
        intlKey: <FormattedMessage id="class.type.live" />,
        color: THEME_COLOR_CLASS_TYPE_LIVE,
        icon: LiveTvIcon,
        aliases: [ `onlineclass` ],
    },
    study : {
        intlKey: <FormattedMessage id="class.type.study" />,
        color: THEME_COLOR_CLASS_TYPE_STUDY,
        icon: LocalLibraryOutlinedIcon,
    },
    homefun : {
        intlKey: <FormattedMessage id="class.type.homeFun" />,
        color: THEME_COLOR_CLASS_TYPE_STUDY,
        icon: LocalLibraryOutlinedIcon,
        aliases: [ `homework` ],
    },
    task : {
        intlKey: <FormattedMessage id="class.type.task" />,
        color: THEME_COLOR_CLASS_TYPE_TASK,
        icon: AssignmentOutlinedIcon,
    },
    class : {
        intlKey: <FormattedMessage id="class.type.class" />,
        color: THEME_COLOR_CLASS_TYPE_CLASS,
        icon: SchoolOutlinedIcon,
        aliases: [ `offlineclass` ],
    },
};

/* Retrieves branding information for a type of class, passing a keyword it will search the object directly for it, if not it will loop through known aliases
* If an alias does not match, it returns the live class identity by default */
const retrieveClassTypeIdentity = (classType : ClassType | ScheduleClassType) : ClassTypeIdentity | null => {
    const lowerClassType = classType.toLowerCase();
    if (classTypeIdentities[lowerClassType]) return classTypeIdentities[lowerClassType];
    const aliasClassTypeIdentity = Object.values(classTypeIdentities).find((value) => value?.aliases?.includes(lowerClassType));
    if (!aliasClassTypeIdentity) return null;
    return aliasClassTypeIdentity;
};

const retrieveClassTypeIdentityOrDefault = (classType : ClassType | ScheduleClassType) : ClassTypeIdentity => {
    return retrieveClassTypeIdentity(classType) ?? classTypeIdentities.live;
};

export {
    classTypeIdentities,
    retrieveClassTypeIdentity,
    retrieveClassTypeIdentityOrDefault,
};
