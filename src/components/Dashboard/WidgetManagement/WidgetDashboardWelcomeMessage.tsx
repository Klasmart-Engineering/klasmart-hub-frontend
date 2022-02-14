import { useGetMyUser } from "@/api/users";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles(() => createStyles({
    welcomeTitleGivenName: {
        fontWeight: `bold`,
    },
}));

enum TimeOfDayId {
    MORNING = `home.banner.welcome.morning`,
    AFTERNOON = `home.banner.welcome.afternoon`,
    EVENING = `home.banner.welcome.evening`,
    UNKNOWN = `home.banner.welcome.generic`
}

interface Props {}

export default function WidgetDashboardWelcomeMessage (props: Props) {
    const classes = useStyles();
    const { data: userData } = useGetMyUser();
    const givenName = userData?.myUser.node.givenName;

    const getTimeOfDayId = () => {
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, `0`)}:${String(now.getMinutes()).padStart(2, `0`)}`;

        if (time >= `05:00` && time <= `11:59`) return TimeOfDayId.MORNING;
        if (time >= `12:00` && time <= `16:59`) return  TimeOfDayId.AFTERNOON;
        if (time >= `17:00` && time <= `23:59`) return TimeOfDayId.EVENING;
        if (time >= `00:00` && time <= `04:59`) return TimeOfDayId.EVENING;

        return TimeOfDayId.UNKNOWN;
    };

    const timeOfDayId = getTimeOfDayId();

    if (!givenName || timeOfDayId === TimeOfDayId.UNKNOWN) return <FormattedMessage id={TimeOfDayId.UNKNOWN}/>;

    return <FormattedMessage
        id={timeOfDayId}
        values={{
            givenName: (
                <span className={classes.welcomeTitleGivenName}>
                    {givenName}
                </span>
            ),
        }}
    />;
}
