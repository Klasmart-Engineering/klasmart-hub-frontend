
import StyledDayCalendar from "../StyledDayCalendar";
import DailyScheduleEvent from "./DailyCalendarEvent";
import {
    DailyCalendarEvent,
    DailyCalendarEventWrapperProps,
    insertAllDayLabel,
    insertTimeMarker,
    modeTransform,
    ScheduleViewMode,
    scrollScheduleToTimeMarker,
    updateTimeMarkerPosition,
} from "./DailyCalenderHelper";
import { State } from "@/store/store";
import useInterval from "@/utils/useInterval";
import clsx from "clsx";
import moment from "moment";
import React,
{
    useEffect,
    useRef,
    useState,
} from "react";
import {
    DateRange,
    Event,
    Formats,
    momentLocalizer,
    Views,
} from "react-big-calendar";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";

interface Props {
    mode: ScheduleViewMode;
    events: DailyCalendarEvent[];
    date?: Date;
    enableTimeMarker?: boolean;
}

const CALENDAR_UPDATE_TIMEMARKER_TIMER = 10 * 1000;

export default function DailySchedule (props: Props) {

    const {
        date = new Date(),
        mode = `vertical`,
        events = [],
        enableTimeMarker = true,
    } = props;

    const hasNoAllDayEvents = !events.some((event: Event) => event.allDay);

    const languageCode = useSelector((state: State) => state.ui.locale || ``);
    moment.locale(languageCode);
    const localizer = momentLocalizer(moment);
    const intl = useIntl();

    const timeFormats: Formats = {
        timeGutterFormat: `H`,
        eventTimeRangeEndFormat: (range: DateRange) => {
            return intl.formatDateTimeRange(range.start, range.end, {
                month: `long`,
                weekday: `long`,
                day: `numeric`,
                hour: `numeric`,
                minute: `numeric`,
            });
        },
        eventTimeRangeStartFormat: (range: DateRange) => {
            return intl.formatDateTimeRange(range.start, range.end, {
                month: `long`,
                weekday: `long`,
                day: `numeric`,
                hour: `numeric`,
                minute: `numeric`,
            });
        },
    };

    const allDayLabel =intl.formatMessage({
        id: `home.schedule.allDayLabel`,
    });

    const min = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const max = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    const calendarRef = useRef<HTMLDivElement>();
    const [ eventFocused, setEventFocused ] = useState(false);

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl === undefined) return;
        insertAllDayLabel(calendarEl, allDayLabel);

        if(!enableTimeMarker) return;
        const insertMarkerTimer = setTimeout(() => {
            insertTimeMarker(calendarEl, mode, min, max);
            scrollScheduleToTimeMarker(calendarEl, mode);
        }, 500);
        return () => {
            clearTimeout(insertMarkerTimer);
        };
    }, [ allDayLabel ]);

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if(!calendarEl) return;

        modeTransform(calendarEl, mode);

        if(!enableTimeMarker) return;

        updateTimeMarkerPosition(calendarEl, mode, min, max);
        scrollScheduleToTimeMarker(calendarEl, mode);

    }, [ mode, events ]);

    useInterval(() => {
        const calendarEl = calendarRef.current;
        if(!calendarEl) return;
        updateTimeMarkerPosition(calendarEl, mode, min, max);

    }, enableTimeMarker ? CALENDAR_UPDATE_TIMEMARKER_TIMER : null);

    return (
        <div
            ref={calendarRef}
            style={{
                width:`100%`,
                height:`100%`,
            }}
            onMouseLeave={() => eventFocused && setEventFocused(false)}
        >
            <StyledDayCalendar
                className={clsx({
                    [`rbc-calendar--event-focused`]: eventFocused,
                    [`rbc-calendar--no-all-day-events`]: hasNoAllDayEvents,
                    [`rbc-calendar--${mode}`]: true,
                })}
                min={ min }
                max={ max }
                events={events}
                defaultView={ Views.DAY }
                step={30}
                defaultDate={date}
                toolbar={false}
                localizer={localizer}
                formats={timeFormats}
                showMultiDayTimes={true}
                eventPropGetter = {
                    () => {
                        return {
                            className: `rbc-event--${mode}`,
                        };
                    }
                }
                components={{
                    event: ({ event }: DailyCalendarEventWrapperProps) => {
                        return (
                            <DailyScheduleEvent
                                event={event}
                                onMouseEnter={() => event.allDay ? null : setEventFocused(true)}
                                onMouseLeave={() => event.allDay ? null : setEventFocused(false)}
                            />
                        );
                    },
                }}
            />
        </div>
    );
}
