import { WidgetType } from "@/components/Dashboard/models/widget.model";
import ClassMockData from "@/components/Dashboard/Widgets/Student/Schedule/mockDataClasses";
import ScheduleItem from "@/components/Dashboard/Widgets/Student/Schedule/ScheduleItem";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import {
    Box,
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import React from "react";
import {
    FormattedDate,
    FormattedMessage,
    useIntl,
} from "react-intl";
import FormattedDuration from "react-intl-formatted-duration";

const now = new Date();

const useStyles = makeStyles((theme:Theme) => createStyles({
    dayTitle: {
        color: theme.palette.grey[700],
    },
    scrollContainer: {
        height: `100%`,
        overflowY: `auto`,
    },
}));

export default function ScheduleWidget () {
    const intl = useIntl();
    const classes = useStyles();

    const scheduledClasses = ClassMockData
        ?.map((e) => ({
            ...e,
            start_at_date: e.startTime.toISOString().split(`T`)[0],
        }));

    const daysWithClass = ClassMockData
        ?.map((e) => ({
            ...e,
            start_at_date: e.startTime.toISOString().split(`T`)[0],
        }))
        .reduce((global: string[], current) => {
            return global.includes(current.start_at_date)
                ? global
                : global.concat(current.start_at_date);
        }, []);

    return (
        <WidgetWrapper
            loading={false}
            error={false}
            noData={false}
            reload={() => {false;}}
            label={
                intl.formatMessage({
                    id: `home.schedule.containerTitleLabel`,
                })
            }
            link={{
                url: `schedule`,
                label: intl.formatMessage({
                    id: `home.schedule.containerUrlLabel`,
                }),
            }}
            id={WidgetType.STUDENTSCHEDULE}
        >

            <div className={ classes.scrollContainer }>
                { ClassMockData ? (
                    <>
                        { daysWithClass?.map((dayWithClass) => {

                            return (
                                <Box
                                    key={dayWithClass}
                                    paddingBottom={1}>
                                    <Box paddingLeft={2}>
                                        <Typography className={ classes.dayTitle }>
                                            <DateLabel date={ dayWithClass } />
                                        </Typography></Box>
                                    <Box>
                                        {
                                            scheduledClasses.filter((classItem) => classItem.start_at_date === dayWithClass)
                                                .map((item) => {
                                                    const start = item.startTime;
                                                    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), (start.getMinutes() + item.duration));
                                                    const isActive = start < now && now < end;

                                                    return (
                                                        <Box
                                                            key={ `class-${ item.id }` }
                                                            paddingTop={1}>
                                                            <ScheduleItem
                                                                active={isActive}
                                                                mockClass={item} />
                                                        </Box>
                                                    );
                                                })
                                        }
                                    </Box>
                                </Box>
                            );})
                        }
                    </>
                ) : (
                    <Typography
                        gutterBottom
                        variant="body2">
                        <FormattedMessage id="scheduleInfo_noClasses" />
                    </Typography>
                )}
            </div>
        </WidgetWrapper>
    );
}

type DateLabelProps = {
    date: string;
}

function DateLabel (props : DateLabelProps) {
    const { date } = props;
    const scheduleDay = new Date(date);

    if (now.getDate() === scheduleDay.getDate())
        return (<FormattedMessage id="date.today" />);

    if ((now.getDate() + 1) === (scheduleDay.getDate()))
        return (<FormattedMessage id="date.tomorrow" />);

    return (
        <FormattedDate
            value={scheduleDay}
            weekday="long"
        />
    );
}
