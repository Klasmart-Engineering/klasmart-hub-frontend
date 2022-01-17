
import {
    THEME_COLOR_CLASS_TYPE_CLASS,
    THEME_COLOR_CLASS_TYPE_LIVE,
    THEME_COLOR_CLASS_TYPE_STUDY,
    THEME_COLOR_CLASS_TYPE_TASK,
} from "@/config/index";
import { ScheduleClassType } from '@kidsloop/cms-api-client';
import { SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import LocalLibraryOutlinedIcon from '@material-ui/icons/LocalLibraryOutlined';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';

type ClassType = "live" | "study" | "homefun" | "class" | "task";

interface ClassTypeIdentity {
    intlKey: string;
    color: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    aliases?: (string|ScheduleClassType)[];
}

const classTypeIdentities : Record<string | ClassType, ClassTypeIdentity> = {
    live : {
        intlKey: `Live`,
        color: THEME_COLOR_CLASS_TYPE_LIVE,
        icon: LiveTvIcon,
        aliases: [ `onlineclass` ],
    },
    study : {
        intlKey: `Study`,
        color: THEME_COLOR_CLASS_TYPE_STUDY,
        icon: LocalLibraryOutlinedIcon,
    },
    homefun : {
        intlKey: `Home Fun`,
        color: THEME_COLOR_CLASS_TYPE_STUDY,
        icon: LocalLibraryOutlinedIcon,
        aliases: [ `homework` ],
    },
    task : {
        intlKey: `Task`,
        color: THEME_COLOR_CLASS_TYPE_TASK,
        icon: AssignmentOutlinedIcon,
    },
    class : {
        intlKey: `Class`,
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
