import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { scaleUtc } from "@visx/scale";
import {
    Event,
    EventWrapperProps,
} from "react-big-calendar";

type ScheduleOrientationMode = `horizontal` | `vertical`;

interface DailyCalendarEvent extends Event {
    icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    backgroundColor?: string;
    subtitle?: string;
}

interface DailyCalendarEventWrapperProps extends EventWrapperProps {
    event: DailyCalendarEvent;
}

/**
 *  The react-big-calendar calculates percentages for events itself when it comes to translating this to horizontal,
 *  we flip their height, width, top and left positions to get the same event sizes on a different axis.
 *  We also save the initial proportions to data attributes to ensure we never lose the initial proportions if things shift
 * **/
const modeTransform = (calendarEl: HTMLDivElement, mode: ScheduleOrientationMode) => {
    if(calendarEl){
        const allCalendarEvents = calendarEl.querySelectorAll(`.rbc-day-slot .rbc-event`);
        allCalendarEvents.forEach((el: HTMLElement) => {
            if(!el.hasAttribute(`data-i-top`)) {
                saveInitialPositions(el);
            }

            const top = el.getAttribute(`data-i-top`) ?? `0px`,
                left = el.getAttribute(`data-i-left`) ?? `0px`,
                height = el.getAttribute(`data-i-height`) ?? `0px`,
                width = el.getAttribute(`data-i-width`) ?? `0px`;

            switch (mode) {
            case `horizontal`:
                el.style.left = top;
                el.style.top = left;
                el.style.height = `auto`;
                el.style.width = height;
                el.style.marginTop = left === `0%` ? `0px` : `${calculateHorizontalOverlap(left)}px`;
                return;
            case `vertical`:
                el.style.left = left;
                el.style.top = top;
                el.style.height = height;
                el.style.width = width;
                el.style.marginTop = `0px`;
                return;
            }
        });
    }
};

const saveInitialPositions = (el: HTMLElement) => {
    const {
        height: height,
        width: width,
        top: top,
        left: left,
    } = el.style;

    el.setAttribute(`data-i-height`, height);
    el.setAttribute(`data-i-width`, width);
    el.setAttribute(`data-i-top`, top);
    el.setAttribute(`data-i-left`, left);
};

// Horizontally we will overlap times to ensure decent spacing we need to determine how many events are stacked via the top value and move it up in equal amounts
const calculateHorizontalOverlap = (top: string): number => {
    const eventHeightAllowance = 30;
    const percentage = parseInt(top) / 100;
    return -eventHeightAllowance*percentage;
};

const updateTimeMarkerPosition = (calendarEl: HTMLDivElement, mode: ScheduleOrientationMode, min: Date, max: Date) => {
    const timeMarkerEl = calendarEl.querySelector<HTMLElement>(`.rbc-time-marker`),
        calendarContentEl = calendarEl.querySelector<HTMLElement>(`.rbc-day-slot`);

    if(timeMarkerEl && calendarContentEl) {
        const containerSize = mode === `horizontal` ? calendarContentEl.offsetWidth : calendarContentEl.offsetHeight;
        const position = calculateMarkerPosition(containerSize, min, max);
        const xPos = mode === `horizontal` ? position : 0;
        const yPos = mode === `horizontal` ? 0: position;

        timeMarkerEl.style.left= `${xPos}px`;
        timeMarkerEl.style.top = `${yPos}px`;
    }
};

const calculateMarkerPosition = (containerSize: number, min: Date, max: Date): number => {
    const domain = [ min, max ];
    const now = new Date();

    const Scale = scaleUtc({
        domain,
        range: [ 0, containerSize ],
    });

    const getPos = (d: Date) => Scale(d) ?? 0;

    return getPos(now);
};

const insertTimeMarker = (calendarEl: HTMLDivElement, mode: ScheduleOrientationMode, min: Date, max: Date) => {
    const calendarContentEl = calendarEl.querySelector<HTMLElement>(`.rbc-time-content`);

    if(calendarContentEl) {
        const html = `
        <div class="rbc-time-marker">
        <svg
        class="rbc-time-marker__icon"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="10"
        viewBox="0 0 21 15"
        fill="none">
            <path
                d="M12.454 13.5304C11.4531 14.7845 9.54687 14.7845 8.54602 13.5304L1.18251 4.30417C-0.124279 2.66679 1.04157 0.244687 3.13649 0.244687L17.8635 0.244686C19.9584 0.244686 21.1243 2.66679 19.8175 4.30416L12.454 13.5304Z"
                fill="#0168ff"/>
        </svg>
        <div class="rbc-time-marker__line"></div>
        </div>
    `;

        calendarContentEl.insertAdjacentHTML(`afterbegin`, html);
        updateTimeMarkerPosition(calendarEl, mode, min, max);
    }
};

const scrollScheduleToTimeMarker = (calendarEl: HTMLDivElement, mode: ScheduleOrientationMode) => {
    const calendarContentEl = calendarEl.querySelector<HTMLElement>(`.rbc-time-content`);
    const timeMarkerEl = calendarEl.querySelector<HTMLElement>(`.rbc-time-marker`);

    if(calendarContentEl && timeMarkerEl) {
        const containerSize = mode === `horizontal` ? calendarContentEl.offsetWidth : calendarContentEl.offsetHeight;

        // we half the size of the container to help us keep the time in the middle
        const halfContainerSize = containerSize/2;
        const xPos = mode === `horizontal` ? timeMarkerEl.offsetLeft - halfContainerSize : 0;
        const yPos = mode === `horizontal` ? 0: timeMarkerEl.offsetTop - halfContainerSize;

        calendarContentEl.scroll({
            left: xPos,
            top: yPos,
        });
    }
};

// react-big-calendar does nto allow us to add text as an option, here we inject it manually
const insertAllDayLabel = (calendarEl: HTMLDivElement, allDayLabel: string) => {
    const allDayGutter = calendarEl.querySelector(`.rbc-time-header-gutter`);
    if(allDayGutter){
        allDayGutter.innerHTML = `<span class="rbc-label">${ allDayLabel }</span>`;
    }
};

export {
    DailyCalendarEvent,
    DailyCalendarEventWrapperProps,
    insertAllDayLabel,
    insertTimeMarker,
    modeTransform,
    ScheduleOrientationMode as ScheduleViewMode,
    scrollScheduleToTimeMarker,
    updateTimeMarkerPosition,
};
