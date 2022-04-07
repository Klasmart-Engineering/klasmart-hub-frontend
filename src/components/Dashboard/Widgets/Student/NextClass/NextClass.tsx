import { useGetClassNodeRoster } from "@/api/classRoster";
import { useRestAPI } from "@/api/restapi";
import NextClassThumb from "@/assets/img/mock/next_class_thumb.png";
import { WidgetType } from "@/components/Dashboard/models/widget.model";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import { getLiveEndpoint } from "@/config";
import { THEME_COLOR_CLASS_TYPE_LIVE } from "@/config/index";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { SchedulePayload } from "@/types/objectTypes";
import { usePostSchedulesTimeViewList } from "@kl-engineering/cms-api-client";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import LiveTvIcon from '@material-ui/icons/LiveTv';
import {
    Box,
    Chip,
    darken,
    Divider,
    Fab,
    Grid,
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import clsx from "clsx";
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedDate,
    FormattedMessage,
    FormattedRelativeTime,
    useIntl,
} from "react-intl";
import FormattedDuration from "react-intl-formatted-duration";
import { ReactResizeDetectorDimensions } from "react-resize-detector/build/ResizeDetector";

export interface StyleProps {
    isVerticalMode: boolean;
    smallTextInHorizontal: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(((theme: Theme) => createStyles({
    root: {
        backgroundColor: THEME_COLOR_CLASS_TYPE_LIVE,
        borderRadius: `30px 10px 30px 30px`,
        padding: theme.spacing(2),
    },
    imageContainer: {
        position: `relative`,
        maxHeight: ({ isVerticalMode }) => isVerticalMode ? `220px` : `initial`,
        maxWidth: ({ isVerticalMode }) => isVerticalMode ? `initial` : `300px`,
        borderRadius: `25px 10px 25px 25px`,
        overflow: `hidden`,
    },
    image: {
        width: `100%`,
        height: `100%`,
        objectFit: `cover`,
    },
    content: {
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `space-between`,
        height: `100%`,
        padding: ({ isVerticalMode }) => isVerticalMode ? theme.spacing(2, 0, 0) : theme.spacing(0, 2),
        color: theme.palette.common.white,
    },
    darkChip: {
        background: `rgba(0, 0, 0, 0.3)`,
        color: `#fff`,
    },
    titleIcon: {
        fontSize: `2.5em`,
        marginRight: theme.spacing(2),
    },
    divider: {
        background: theme.palette.grey[400],
        opacity: .7,
        width: `100%`,
    },
    classDetails: {
        display: `flex`,
        flexDirection: ({ isVerticalMode }) => isVerticalMode ? `column` : `row`,
        justifyContent: `space-between`,
        alignItems: ({ isVerticalMode }) => isVerticalMode ? `flex-start` : `flex-end`,
        width: `100%`,
    },
    teacherList: {
        padding: ({ isVerticalMode }) => isVerticalMode ? theme.spacing(2, 0) : theme.spacing(2, 0, 0),
    },
    teacher: {
        "& .singleTeacher": {
            paddingRight: 10,
            marginRight: 10,
            marginTop: 5,
        },
        "&:last-of-type .singleTeacher": {
            borderRight: 0,
            paddingRight: 0,
            marginRight: 0,
            marginBottom: 0,
        },
    },
    avatar: {
        color: `white`,
        marginRight: theme.spacing(1),
    },
    liveButtonContainer: {
        display: `flex`,
        width: `100%`,
        height: `auto`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    liveButton: {
        fontWeight: `bold`,
        padding: `2.2em`,
    },
    liveButtonInContainer: {
        fontSize: ({ smallTextInHorizontal }) => smallTextInHorizontal ? `1.4em` : `1.8em`,
        color: THEME_COLOR_CLASS_TYPE_LIVE,
        background: theme.palette.common.white,
        "&:hover": {
            backgroundColor: darken(theme.palette.common.white, 0.1),
        },
    },
    liveButtonImageOverlay: {
        position: `absolute`,
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        fontSize: `1.25em`,
        padding: `2.8em`,
        background: THEME_COLOR_CLASS_TYPE_LIVE,
        color: theme.palette.common.white,
        "&:hover": {
            backgroundColor: darken(THEME_COLOR_CLASS_TYPE_LIVE, 0.1),
        },
    },
    liveButtonLabel: {
        fontSize: `0.8em`,
        lineHeight: `1.1em`,
        wordBreak: `keep-all`,
    },
    noClass: {
        color: theme.palette.common.white,
    },
})));

const VERTICAL_MODE_BREAKPOINT = 600;
const LARGE_TEXT_BREAKPOINT = 900;
const now = new Date();
const timeZoneOffset = now.getTimezoneOffset() * 60 * -1; // to make seconds
const maxDays = 14;
interface Props extends ReactResizeDetectorDimensions {}

function StudentNextClass (props: Props) {
    const { width } = props;
    const isVerticalMode = width ? width < VERTICAL_MODE_BREAKPOINT : false;
    const smallTextInHorizontal = width ? !isVerticalMode && width < LARGE_TEXT_BREAKPOINT : false;
    const intl = useIntl();
    const classes = useStyles({
        isVerticalMode,
        smallTextInHorizontal,
    });
    const restApi = useRestAPI();
    const [ liveToken, setLiveToken ] = useState(``);
    const [ nextClass, setNextClass ] = useState<SchedulePayload>();
    const [ maxTeachers, _ ] = useState(3);
    const [ timeBeforeClass, setTimeBeforeClass ] = useState(Number.MAX_SAFE_INTEGER);
    const [ schedule, setSchedule ] = useState<SchedulePayload[]>([]);
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;

    const secondsBeforeClassCanStart = 900;
    const unixStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
    const unixEndOfDateRange = new Date(now.getFullYear(), now.getMonth(), now.getDate() + maxDays, 23, 59, 59).getTime();

    const {
        data: schedulesData,
        error: isError,
        refetch,
        isLoading,
    } = usePostSchedulesTimeViewList({
        org_id: organizationId,
        view_type: `full_view`,
        time_at: 0,
        // any time is ok together with view_type=`full_view`,
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

    const variables = {
        id: nextClass?.class_id ?? ``,
        count: maxTeachers,
        orderBy: `familyName`,
        order: `ASC`,
        direction: `FORWARD`,
        showStudents: false,
        showTeachers: true,
    };

    const { data: rosterData } = useGetClassNodeRoster({
        fetchPolicy: `network-only`,
        variables,
        skip: !nextClass?.class_id,
    });

    function goLive () {
        const liveLink = `${getLiveEndpoint()}?token=${liveToken}`;
        window.open(liveLink);
    }

    useEffect(() => {
        const scheduledClass = schedule
            ?.filter((event: any) => event.status !== `Closed`)
            .filter((event: any) => event.class_type === `OnlineClass`)
            .filter((event: any) => event.end_at > (now.getTime() / 1000));

        if (!scheduledClass) return;
        setNextClass(scheduledClass[0]);
    }, [ schedule ]);

    useEffect(() => {
        if (!nextClass) return;
        setTimeBeforeClass(nextClass?.start_at - new Date().getTime() / 1000);
    }, [ nextClass ]);

    useEffect(() => {
        if (!schedulesData?.data.length) { setSchedule([]); return; }
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
        })();
    }, [ timeBeforeClass ]);

    return (
        <WidgetWrapper
            noBackground={!isError}
            label={
                intl.formatMessage({
                    id: `home.nextClass.containerTitleLabel`,
                })
            }
            loading={isLoading}
            error={isError}
            reload={refetch}
            link={{
                url: `schedule`,
                label: intl.formatMessage({
                    id: `home.nextClass.containerUrlLabel`,
                }),
            }}
            editable={false}
            id={WidgetType.STUDENTNEXTCLASS}
        >
            <Box className={classes.root}>
                {(nextClass) ?
                    <Grid
                        container
                        alignItems="stretch"
                    >
                        <Grid
                            item
                            xs={isVerticalMode ? 12 : 3}
                            className={classes.imageContainer}
                        >
                            <img
                                className={classes.image}
                                src={NextClassThumb}
                            />
                            {
                                isVerticalMode &&
                        <Fab
                            color="primary"
                            className={clsx(classes.liveButton, classes.liveButtonImageOverlay)}
                            onClick={() => goLive()}
                        >
                            <span className={classes.liveButtonLabel}><FormattedMessage id="home.nextClass.goLive" /></span>
                        </Fab>
                            }
                        </Grid>

                        <Grid
                            item
                            xs
                            className={classes.contentContainer}
                        >
                            <div className={classes.content}>
                                <div>
                                    <Chip
                                        className={classes.darkChip}
                                        label={intl.formatMessage({
                                            id: `home.nextClass.title`,
                                        })}
                                    />
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        p={1}
                                    >
                                        <Box
                                            paddingTop={.25}
                                            paddingRight={1}
                                        >
                                            <LiveTvIcon fontSize={smallTextInHorizontal ? `medium` : `large`} />
                                        </Box>
                                        <Typography
                                            variant={smallTextInHorizontal ? `h6` : `h5`}
                                            className={classes.title}
                                        >
                                            {nextClass?.title}
                                        </Typography>
                                    </Box>
                                </div>
                                <Divider className={classes.divider} />
                                <Box>
                                    {rosterData?.classNode.teachersConnection?.totalCount !== 0 &&
                                <Box
                                    className={classes.classDetails}
                                >
                                    <div className={classes.teacherList}>
                                        <Chip
                                            className={classes.darkChip}
                                            label={
                                                intl.formatMessage({
                                                    id: `home.nextClass.teachersTitle`,
                                                }, {
                                                    count: rosterData?.classNode.teachersConnection?.totalCount || 0,
                                                })
                                            }
                                        />
                                        <Box paddingTop={1}>
                                            <Grid
                                                container
                                            >
                                                {rosterData?.classNode?.teachersConnection?.edges.map(({ node }: any, i) => (
                                                    <Grid
                                                        key={`teacher-${i}`}
                                                        item
                                                        className={classes.teacher}
                                                    >
                                                        <Box
                                                            display="flex"
                                                            flexDirection="row"
                                                            alignItems="center"
                                                            className="singleTeacher"
                                                        >
                                                            <UserAvatar
                                                                name={`${node?.givenName} ${node?.familyName}`}
                                                                className={classes.avatar}
                                                                size={smallTextInHorizontal ? `small` : `medium`}
                                                            />
                                                            <Typography variant={smallTextInHorizontal ? `body2` : `body1`}>{node?.givenName}</Typography>
                                                        </Box>
                                                    </Grid>
                                                ))
                                                }
                                            </Grid>
                                        </Box>
                                    </div>
                                    {nextClass ?
                                        <div>
                                            {timeBeforeClass < 0 ? (
                                                <FormattedMessage id="home.nextClass.alreadyStarted" />
                                            ) : (
                                                timeBeforeClass < secondsBeforeClassCanStart && (
                                                    <FormattedMessage id="home.nextClass.startsSoon" />
                                                )
                                            )}
                                            <Typography
                                                noWrap
                                                variant={smallTextInHorizontal ? `body2` : `body1`}
                                            >
                                                <FormattedDate
                                                    value={(nextClass?.start_at || 0) * 1000}
                                                    day="2-digit"
                                                    month="long"
                                                    weekday="long"
                                                />
                                            </Typography>
                                            <Typography
                                                noWrap
                                                variant={smallTextInHorizontal ? `body2` : `body1`}
                                            >
                                                <FormattedDate
                                                    hour12
                                                    value={(nextClass?.start_at || 0) * 1000}
                                                    hour="2-digit"
                                                    minute="2-digit"
                                                />
                                                <FormattedDuration
                                                    seconds={(nextClass?.end_at || 0) - (nextClass?.start_at || 0)}
                                                    format=" - {hours} {minutes}"
                                                />
                                            </Typography>
                                        </div> : <></>}
                                </Box>}
                                </Box>
                            </div>
                        </Grid>
                        {!isVerticalMode &&
                    <Grid
                        item
                        xs={2}
                        className={classes.liveButtonContainer}
                    >
                        <Fab
                            color="primary"
                            className={clsx(classes.liveButton, classes.liveButtonInContainer)}
                            disabled={liveToken === ``}
                            onClick={() => goLive()}
                        >
                            <span className={classes.liveButtonLabel}>
                                {timeBeforeClass < secondsBeforeClassCanStart ?
                                    <FormattedMessage id="home.nextClass.goLive" /> :
                                    <Typography>
                                        <FormattedRelativeTime
                                            value={timeBeforeClass}
                                            updateIntervalInSeconds={1}
                                        />
                                    </Typography>
                                }
                            </span>
                        </Fab>
                    </Grid>}
                    </Grid>
                    : (schedulesData &&
                    <Typography className={classes.noClass}>
                        <FormattedMessage id="home.nextClass.noClass" />
                    </Typography>
                    )}
            </Box>
        </WidgetWrapper>
    );
}

export default StudentNextClass;
