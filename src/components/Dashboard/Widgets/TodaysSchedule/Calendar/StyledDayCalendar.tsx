/* eslint-disable @typescript-eslint/naming-convention */

import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    styled,
    Theme,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { Calendar } from "react-big-calendar";

interface Props {
    theme: Theme;
}

const SIZE_OF_HORIZONTAL_CALENDAR_SCALE = 5000;
const SIZE_OF_VERTICAL_CALENDAR_SCALE = 2000;

const StyledDayCalendar = styled(Calendar)((props: Props) => {
    const { theme } = props;
    return ({
        '&': {
            '& .rbc-time-header': {
                background: blue[100],
            },
            '& .rbc-today': {
                background: `none`,
            },
            '& .rbc-time-view': {
                border: `none`,
            },
            '& .rbc-time-content': {
                overflow: `visible`,
            },
            '& .rbc-current-time-indicator': {
                display: `none`,
            },
            '& .rbc-event, .rbc-day-slot .rbc-background-event': {
                border: `none`,
                background: `none`,
                minWidth: 0,
                minHeight: 0,
                padding: 0,
                '& .rbc-event-label': {
                    display: `none`,
                },
            },
            '& .rbc-time-marker': {
                position: `absolute`,
                display: `flex`,
                zIndex: 1,
                transition: `1s all`,
                '& .rbc-time-marker__line': {
                    position: `relative`,
                    background: theme.palette.info.main,
                    flex: 1,
                },
                '& path': {
                    fill: theme.palette.info.main,
                },
            },
            '& .rbc-label': {
                color: `rgba(0, 0, 0, 0.7)`,
            },
            '& .rbc-time-content .rbc-event': {
                opacity: 1,
                transition: `opacity .5s ease, min-width .5s ease, min-height .5s ease`,
                borderRadius: `0!important`,
            },
            '&.rbc-calendar--event-focused .rbc-time-content .rbc-event': {
                opacity: .15,
            },
            '& .rbc-time-content .rbc-event:hover, & .rbc-time-content .rbc-event:focus, & .rbc-time-content .rbc-event:focus-within': {
                opacity: `1!important`,
            },
        },
        '&.rbc-calendar--no-all-day-events': {
            '& .rbc-time-header': {
                display: `none`,
            },
        },
        '&.rbc-calendar--vertical': {
            '& .rbc-time-column': {
                minHeight: SIZE_OF_VERTICAL_CALENDAR_SCALE,
            },
            '& .rbc-time-content': {
                overflowY: `scroll`,
                overflowX: `hidden`,
                padding: `0 0 0 1em`,
            },
            '& .rbc-time-content > * + * > *': {
                borderLeft: `none`,
            },
            '& .rbc-time-marker': {
                flexDirection: `row`,
                alignItems: `center`,
                width: `100%`,
                height: 1,
                '& .rbc-time-marker__icon': {
                    transform: `rotate(270deg)`,
                },
                '& .rbc-time-marker__line': {
                    left: 4,
                    height: 2,
                },
            },
            '& .rbc-day-slot .rbc-events-container': {
                marginRight: 0,
            },
            '& .rbc-time-header.rbc-overflowing': {
                marginRight: `0!important`,
                '& .rbc-time-header-content': {
                    borderLeft: 0,
                    paddingLeft: theme.spacing(1),
                },
            },
            '& .rbc-event': {
                '& p': {
                    whiteSpace: `normal`,
                },
                '&.rbc-event-continues-earlier .rbc-custom-label': {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                },
                '&.rbc-event-continues-later .rbc-custom-label': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                },
            },
            '& .rbc-time-content .rbc-event:hover, & .rbc-time-content .rbc-event:focus, & .rbc-time-content .rbc-event:focus-within': {
                minHeight: theme.spacing(10),
            },
        },
        '&.rbc-calendar--horizontal': {
            '& .rbc-time-header': {
                flexDirection: `column`,
                marginRight: `0!important`,
                paddingTop: `1em`,
                '& .rbc-time-header-gutter': {
                    height: 20,
                    width: `auto!important`,
                    minWidth: `auto!important`,
                    maxWidth: `auto!important`,
                },
                '& .rbc-overflowing': {
                    borderRight: `none`,
                },
                '& .rbc-time-header-content': {
                    marginTop: 4,
                },
            },
            '& .rbc-day-slot': {
                minHeight: `auto`,
                flex: 1,
                '& .rbc-event-content': {
                    minHeight: `auto`,
                },
                '& .rbc-events-container': {
                    marginRight: 0,
                    marginTop: 5,
                },
                '& .rbc-time-slot': {
                    borderTop: `none`,
                },
            },
            '& .rbc-time-gutter': {
                minHeight: 20,
                '& .rbc-timeslot-group': {
                    minHeight: 20,
                    borderBottom: `none`,
                    borderLeft: `1px solid ${theme.palette.grey[`A100`]}`,
                    position: `relative`,
                },
            },
            '& .rbc-timeslot-group': {
                borderBottom: `none`,
            },
            '& .rbc-time-header-content': {
                borderLeft: `none`,
            },
            '& .rbc-time-content': {
                flexDirection: `column`,
                borderTop: `none`,
                overflowX: `scroll`,
                overflowY: `hidden`,
                borderRight: `1px solid ${theme.palette.grey[`A100`]}`,
                padding: `1em 0 0 0`,
            },
            '& .rbc-time-column': {
                flexDirection: `row`,
                minWidth: SIZE_OF_HORIZONTAL_CALENDAR_SCALE,
            },
            '& .rbc-time-view': {
                flexDirection: `row`,
            },
            '& .rbc-time-marker': {
                flexDirection: `column`,
                alignItems: `center`,
                height: `100%`,
                width: 1,
                '& .rbc-time-marker__line': {
                    top: 4,
                    width: 2,
                },
            },
            '& .rbc-event': {
                '&.rbc-event-continues-earlier .rbc-custom-label': {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                },
                '&.rbc-event-continues-later .rbc-custom-label': {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                },
            },
            '& .rbc-time-content .rbc-event:hover, & .rbc-time-content .rbc-event:focus, & .rbc-time-content .rbc-event:focus-within': {
                minWidth: theme.spacing(20),
            },
        },
    });}, {
    name: `rbc-calendar`,
});

export default StyledDayCalendar;
