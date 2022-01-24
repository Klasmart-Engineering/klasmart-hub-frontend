import {
    ClassUser,
    useGetClassRoster,
} from "@/api/classRoster";
import { useRestAPI } from "@/api/restapi";
import scheduleSvg from "@/assets/img/schedule.svg";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import StyledFAB from "@/components/styled/fabButton";
import { getLiveEndpoint } from "@/config";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Status } from "@/types/graphQL";
import {
    LivePreviewJWT,
    SchedulePayload,
} from "@/types/objectTypes";
import { usePostSchedulesTimeViewList } from "@kidsloop/cms-api-client";
import {
    Box,
    createStyles,
    darken,
    Divider,
    Fab,
    Grid,
    makeStyles,
    Tooltip,
    Typography,
    useTheme,
} from "@material-ui/core";
import VideoCallIcon from '@material-ui/icons/VideoCall';
import jwtDecode from "jwt-decode";
import { UserAvatar } from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedDate,
    FormattedMessage,
    FormattedRelativeTime,
    FormattedTime,
} from "react-intl";
import FormattedDuration from "react-intl-formatted-duration";

const useStyles = makeStyles((theme) => createStyles({
    noClass: {
        display: `flex`,
        flexDirection: `column`,
        height: `100%`,
        alignItems: `center`,
        "& img": {
            height: `73%`,
        },
    },
    teachersTitle: {
        fontSize: `1em`,
        paddingBottom: `0.5em`,
    },
    nextClassTimeWrapper: {
        display: `flex`,
        flexDirection: `row`,
        padding: `1em 0 0 0`,
        alignItems: `flex-start`,
    },
    nextClassTime: {
        display: `flex`,
        flexDirection: `column`,
        alignItems: `start`,
    },
    nextClassCardTitleIntro:{
        color: theme.palette.grey[600],
    },
    nextClassIcon:{
        fill: theme.palette.getContrastText(theme.palette.text.primary),
        backgroundColor: theme.palette.primary.main,
        borderRadius: `100%`,
        padding: `0.1em`,
        marginRight: `0.3em`,
    },
    nextClassCard: {
        padding: `0 1em 1em 1em`,
        height: `100%`,
    },
    nextClassCardTitle: {
        display: `flex`,
        alignItems: `center`,
        fontSize: `1.5em`,
        color: theme.palette.primary.main,
        marginTop: 5,
        lineHeight: `1.2`,
        marginBottom: theme.spacing(2),
    },
    nextClassGridDetails: {
        [theme.breakpoints.down(`md`)]: {
            borderTop: `1px solid ${theme.palette.grey[300]}`,
            paddingTop: theme.spacing(3),
            marginTop: theme.spacing(3),
        },
        [theme.breakpoints.up(`lg`)]: {
            borderLeft: `1px solid ${theme.palette.grey[300]}`,
            paddingLeft: theme.spacing(4),
            marginLeft: theme.spacing(4),
        },
    },
    liveButton: {
        padding: `2.5rem`,
        color: theme.palette.common.white,
        "&:hover": {
            backgroundColor: darken(theme.palette.primary.main, 0.2),
        },
    },
    warningText: {
        color: theme.palette.error.main,
        fontWeight: `bold`,
        paddingTop: `0.5em`,
    },
    teacher: {
        "& .singleTeacher": {
            borderRight: `1px solid ${theme.palette.grey[300]}`,
            paddingRight: 10,
            marginRight: 10,
            marginBottom: 10,
        },
        "&:last-of-type .singleTeacher": {
            borderRight: 0,
            paddingRight: 0,
            marginRight: 0,
            marginBottom: 0,
        },
    },
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        color: `white`,
        marginRight: theme.spacing(1),
        fontSize: 10,
    },
}));

const now = new Date();
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1; // to make seconds
const maxDays = 14;

export default function NextClass () {
    const [ schedule, setSchedule ] = useState<SchedulePayload[]>([]);
    const classes = useStyles();
    const theme = useTheme();
    const restApi = useRestAPI();
    const [ liveToken, setLiveToken ] = useState(``);
    const [ shareLink, setShareLink ] = useState(``);
    const [ nextClass, setNextClass ] = useState<SchedulePayload>();
    const [ nextClassRoster, setNextClassRoster ] = useState<{
        students: ClassUser[];
        teachers: ClassUser[];
    }>();
    const [ timeBeforeClass, setTimeBeforeClass ] = useState(Number.MAX_SAFE_INTEGER);

    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.organization_id ?? ``;

    const secondsBeforeClassCanStart = 900;

    const unixStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
    const unixEndOfDateRange = new Date(now.getFullYear(), now.getMonth(), now.getDate() + maxDays, 23, 59, 59).getTime();

    const {
        data: schedulesData,
        isFetching: isSchedulesFetching,
        error: isScheduleError,
        refetch,
    } = usePostSchedulesTimeViewList({
        org_id: organizationId,
        view_type: `full_view`,
        time_at: 0, // any time is ok together with view_type=`full_view`,
        start_at_ge: (unixStartOfDay / 1000),
        end_at_le: (unixEndOfDateRange / 1000),
        time_zone_offset: timeZoneOffset,
        order_by: `start_at`,
        time_boundary: `union`,
    }, {
        queryOptions: {
            enabled: !!organizationId,
        },
    });

    const { data: dataClassRoster } = useGetClassRoster({
        variables: {
            class_id: nextClass?.class_id ?? ``,
            organization_id: organizationId,
        },
        skip: !nextClass?.class_id || !organizationId,
    });

    function goLive () {
        const liveLink = `${getLiveEndpoint()}?token=${liveToken}`;
        window.open(liveLink);
    }

    useEffect(() => {
        const scheduledClass = schedule
            ?.filter((event) => event.status !== `Closed`)
            .filter((event) => event.class_type === `OnlineClass`)
            .filter((event) => event.end_at > (now.getTime() / 1000));

        if (!scheduledClass) return;
        setNextClass(scheduledClass[0]);
    }, [ schedule ]);

    useEffect(() => {
        if (!dataClassRoster?.class) return;
        const eligibleStudents = dataClassRoster.class.students.filter((user) => user?.membership?.status === Status.ACTIVE);
        const eligibleTeachers = dataClassRoster.class.teachers.filter((user) => user?.membership?.status === Status.ACTIVE);
        setNextClassRoster({
            students: eligibleStudents,
            teachers: eligibleTeachers,
        });
    }, [ dataClassRoster ]);

    useEffect(() => {
        if (!nextClass) return;
        setTimeBeforeClass(nextClass?.start_at - new Date().getTime() / 1000);
    }, [ nextClass ]);

    useEffect(() => {
        if (!schedulesData?.data.length) { setSchedule([]); return;}

        schedulesData.data.sort((a, b) => {
            const startDiff = a.start_at - b.start_at;
            if (startDiff === 0) return a.title.localeCompare(b.title);
            return startDiff;
        });

        setSchedule([ ...schedulesData.data ]);
    }, [ schedulesData ]);

    useEffect(() => {
        if (timeBeforeClass > secondsBeforeClassCanStart || !nextClass) return;
        (async () => {
            const json = await restApi.getLiveTokenByClassId({
                classId: nextClass.id,
                organizationId,
            });
            if (!json || !json.token) {
                setLiveToken(``);
                return;
            }
            setLiveToken(json.token);

            const token: LivePreviewJWT = jwtDecode(json.token);
            setShareLink(token?.roomid);
        })();
    }, [ timeBeforeClass ]);

    return (
        <WidgetWrapper
            label="Next Class"
            loading={isSchedulesFetching}
            error={isScheduleError}
            noData={false}
            reload={refetch}
            link={{
                url: `schedule`,
                label: `View all classes`,
            }}
        >
            <Box className={classes.nextClassCard}>
                {nextClass ? (
                    <Grid container>
                        <Grid
                            item
                            xs={12}>
                            <Typography
                                className={classes.nextClassCardTitleIntro}
                                variant="caption">
                                <FormattedMessage id="nextClass_title" />
                            </Typography>
                            <Typography className={classes.nextClassCardTitle}>
                                <VideoCallIcon className={classes.nextClassIcon} />
                                {nextClass?.title}
                            </Typography>
                            <Divider />

                            <Typography className={classes.warningText} >
                                {timeBeforeClass < 0 ? (
                                    <FormattedMessage id="nextClass_alreadyStarted" />
                                ) : (
                                    timeBeforeClass < secondsBeforeClassCanStart && (
                                        <FormattedMessage id="nextClass_startsSoon" />
                                    )
                                )}
                                {timeBeforeClass < secondsBeforeClassCanStart && (
                                    <>
                                        {` `}
                                    (
                                        <FormattedRelativeTime
                                            value={timeBeforeClass}
                                            updateIntervalInSeconds={1}
                                        />
                                    )
                                    </>
                                )}
                            </Typography>

                            <Grid
                                container
                                alignItems="center"
                                justify="space-between"
                                className={classes.nextClassTimeWrapper}>
                                <Grid item>
                                    <div className={classes.nextClassTime}>
                                        <Typography variant="caption">
                                            <FormattedDate
                                                value={nextClass?.start_at * 1000}
                                                month="long"
                                                weekday="long"
                                                day="2-digit"
                                            />
                                        </Typography>
                                        <Typography variant="caption">
                                            <FormattedTime
                                                value={nextClass?.start_at * 1000}
                                                hour="2-digit"
                                                minute="2-digit"
                                            />
                                            <FormattedDuration
                                                seconds={nextClass?.end_at - nextClass?.start_at}
                                                format=" - {hours} {minutes}"
                                            />
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid
                                    item
                                    style={{
                                        marginLeft: theme.spacing(4),
                                    }}
                                >
                                    <Fab
                                        color="primary"
                                        className={classes.liveButton}
                                        disabled={liveToken === ``}
                                        onClick={() => goLive()}
                                    >
                                        {timeBeforeClass < secondsBeforeClassCanStart ? (
                                            <Typography>
                                                <FormattedMessage id="live_liveButton" />
                                            </Typography>

                                        ) : (
                                            <Typography>
                                                <FormattedRelativeTime
                                                    value={timeBeforeClass}
                                                    updateIntervalInSeconds={1}
                                                /></Typography>

                                        )}
                                    </Fab>
                                </Grid>
                            </Grid>
                        </Grid>

                        {nextClassRoster && nextClassRoster.teachers.length !== 0 && (
                            <Grid
                                item
                                xs={12}>
                                <Box>
                                    <Typography className={classes.teachersTitle}>
                                        <FormattedMessage
                                            id="nextClass_teachersTitle"
                                            values={{
                                                count: nextClassRoster?.teachers.length,
                                            }}
                                        />
                                    </Typography>
                                    <Grid container>
                                        {nextClassRoster?.teachers.map((user, i) => {
                                            const maxTeachers = 2;

                                            if (nextClassRoster?.teachers.length <= maxTeachers) {
                                                return (
                                                    <Grid
                                                        key={user.user_id}
                                                        item
                                                        className={classes.teacher}>
                                                        <Box
                                                            display="flex"
                                                            flexDirection="row"
                                                            alignItems="center"
                                                            className="singleTeacher"
                                                        >
                                                            <UserAvatar
                                                                name={`${user.given_name} ${user.family_name}`}
                                                                className={classes.avatar}
                                                                size="small"
                                                            />
                                                            <span>{user.given_name} {user.family_name}</span>
                                                        </Box>
                                                    </Grid>
                                                );
                                            } else {
                                                if (i <= maxTeachers || i === (nextClassRoster?.teachers.length - 1)) {
                                                    const maxTeachersList = [ ...nextClassRoster?.teachers ].slice(-Math.abs(nextClassRoster?.teachers.length - maxTeachers));
                                                    return (
                                                        <Grid
                                                            key={user.user_id}
                                                            item
                                                            className={classes.teacher}>
                                                            <Box>
                                                                {i < maxTeachers && (
                                                                    <div style={{
                                                                        display: `flex`,
                                                                        flexDirection: `row`,
                                                                        paddingRight: `1em`,
                                                                        paddingBottom: `1em`,
                                                                    }}>
                                                                        <UserAvatar
                                                                            name={`${user.given_name} ${user.family_name}`}
                                                                            className={classes.avatar}
                                                                        />
                                                                        <Typography variant="caption">
                                                                            {user.given_name}
                                                                        </Typography>
                                                                    </div>

                                                                )}
                                                                {i === nextClassRoster?.teachers.length - 1 && (
                                                                    <Tooltip title={maxTeachersList.map((user) => `${user.given_name} ${user.family_name}`).join(`, `)}>
                                                                        <span> + {maxTeachersList.length}</span>
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                        </Grid>
                                                    );
                                                }
                                            }
                                        })}
                                    </Grid>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                ) : (
                    <div className={classes.noClass}>
                        <img
                            src={scheduleSvg}
                            alt=""/>
                        <Typography color="primary">
                            <FormattedMessage id="nextClass_noClass" />
                        </Typography>
                    </div>
                )}
            </Box>
        </WidgetWrapper>
    );
}
