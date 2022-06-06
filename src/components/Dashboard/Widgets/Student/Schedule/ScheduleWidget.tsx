import scheduleSvg from "@/assets/img/schedule.svg";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import ScheduleItem from "@/components/Dashboard/Widgets/Student/Schedule/ScheduleItem";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { SchedulePayload } from "@/types/objectTypes";
import { usePostSchedulesTimeViewList } from "@kl-engineering/cms-api-client";
import {
    Box,
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedDate,
    FormattedMessage,
    useIntl,
} from "react-intl";

const now = new Date();

const useStyles = makeStyles((theme: Theme) => createStyles({
    dayTitle: {
        color: theme.palette.grey[700],
    },
    scrollContainer: {
        height: `100%`,
        overflowY: `auto`,
    },
    noClass: {
        display: `flex`,
        flexDirection: `column`,
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
        "& img": {
            height: `50%`,
        },
    },
}));

export default function ScheduleWidget () {
    const [ schedule, setSchedule ] = useState<SchedulePayload[]>([]);
    const intl = useIntl();
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;
    const now = new Date();
    const yesterday = new Date().setDate(new Date().getDate() - 1) / 1000;
    const todayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
    const twoWeeksFromTodayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 23, 59).getTime() / 1000;
    const timeZoneOffset = now.getTimezoneOffset() * 60 * -1; // to make seconds
    const {
        data: schedulesData,
        isFetching: isSchedulesFetching,
        isError,
        refetch,
    } = usePostSchedulesTimeViewList({
        org_id: organizationId,
        view_type: `full_view`,
        time_at: 0, // any time is ok together with view_type=`full_view`,
        start_at_ge: todayTimestamp,
        end_at_le: twoWeeksFromTodayTimestamp,
        time_zone_offset: timeZoneOffset,
        order_by: `start_at`,
        time_boundary: `union`,
    }, {
        queryOptions: {
            enabled: !!organizationId,
        },
    });

    useEffect(() => {
        if (!currentOrganization || !schedulesData?.data.length) return;
        schedulesData.data.sort((a, b) => {
            const startDiff = a.start_at - b.start_at;
            if (startDiff === 0) return a.title.localeCompare(b.title);
            return startDiff;
        });
        setSchedule([ ...schedulesData.data ]);
    }, [ currentOrganization, schedulesData ]);

    const scheduledClass = schedule
        ?.map((e) => ({
            ...e,
            start_at_date: new Date(((e.start_at + 1 + timeZoneOffset) * 1000)).toISOString().split(`T`)[0],
        }))
        .filter((event) => event.status !== `Closed`)
        .filter((event) => event.start_at > yesterday);
     const daysWithClass = schedule
        ?.map((e) => ({
            ...e,
            start_at_date: new Date(((e.start_at + 1 + timeZoneOffset) * 1000)).toISOString().split(`T`)[0],
        }))
        .filter((event) => event.status !== `Closed`)
        .filter((event) => event.start_at > yesterday)
        .reduce((global: string[], current) => {
            return global.includes(current.start_at_date)
                ? global
                : global.concat(current.start_at_date);
        }, []);
    return (
        <WidgetWrapper
            loading={isSchedulesFetching}
            error={isError}
            noData={false}
            reload={refetch}
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

            <div className={classes.scrollContainer}>
                { scheduledClass?.length > 0 ? (
                    <>
                        {daysWithClass?.map((dayWithClass) => {

                            return (
                                <Box
                                    key={dayWithClass}
                                    paddingBottom={1}
                                >
                                    <Box paddingLeft={2}>
                                        <Typography className={classes.dayTitle}>
                                            <DateLabel
                                                date={
                                                    dayWithClass
                                                }
                                                now={now}
                                            />
                                        </Typography>
                                    </Box>
                                    <Box>
                                        {
                                            scheduledClass.filter((classItem) => classItem.start_at_date === dayWithClass)
                                                .map((item, index) => {
                                                    const start = item.start_at * 1000;
                                                    const end = item.end_at * 1000;
                                                    const timeNow = now.getTime();
                                                    const isActive = timeNow>= start && timeNow <= end;

                                                    return (
                                                        <Box
                                                            key={`class-${ item.id }-${index}`}
                                                            paddingTop={1}
                                                        >
                                                            <ScheduleItem
                                                                active={isActive}
                                                                item={item}
                                                            />
                                                        </Box>
                                                    );
                                                })
                                        }
                                    </Box>
                                </Box>
                            );
                        })
                        }
                    </>
                ) : (
                    <div className={classes.noClass}>
                        <img
                            src={scheduleSvg}
                            alt=""
                        />
                        <Typography color="primary">
                            <FormattedMessage id="home.common.noData.schedule.title" />
                        </Typography>
                    </div>
                )}
            </div>
        </WidgetWrapper>
    );
}

type DateLabelProps = {
    date: string;
    now: Date;
}

// eslint-disable-next-line react/no-multi-comp
function DateLabel (props: DateLabelProps) {
    const { date, now } = props;

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
