import {
    ClassUser,
    useGetClassRosterEligibleUsers,
} from "@/api/classRoster";
import { currentMembershipVar } from "@/cache";
import StyledFAB from "@/components/styled/fabButton";
import {
    getCNEndpoint,
    getLiveEndpoint,
} from "@/config";
import {
    LivePreviewJWT,
    SchedulePayload,
} from "@/types/objectTypes";
import { useReactiveVar } from "@apollo/client/react";
import {
    Avatar,
    Box,
    Grid,
    Tooltip,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import jwtDecode from "jwt-decode";
import {
    UserAvatar,
    utils,
} from "kidsloop-px";
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        nextClassCard: {
            borderRadius: 12,
            backgroundColor: theme.palette.primary.light,
            padding: theme.spacing(3, 4),
        },
        nextClassCardTitle: {
            fontSize: `2em`,
            fontWeight: `bold`,
            color: theme.palette.primary.main,
            marginTop: `5`,
            lineHeight: `1.2`,
            marginBottom: theme.spacing(2),
        },
        nextClassCardTitle2: {
            fontSize: `1em`,
            fontWeight: `bold`,
            textTransform: `uppercase`,
            marginTop: 0,
            marginBottom: 5,
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
            backgroundColor: `#ff6961`,
            color: `white`,
            marginLeft: theme.spacing(1),
        },
        warningText: {
            color: `#ff6961`,
            fontWeight: `bold`,
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

export default function NextClass ({ schedule }: {
    schedule?: SchedulePayload[];
}) {
    const classes = useStyles();
    const theme = useTheme();
    const [ liveToken, setLiveToken ] = useState(``);
    const [ shareLink, setShareLink ] = useState(``);
    const [ openShareLink, setOpenShareLink ] = useState(false);

    const currentOrganization = useReactiveVar(currentMembershipVar);

    const [ nextClass, setNextClass ] = useState<SchedulePayload>();
    const [ nextClassRoster, setNextClassRoster ] = useState<{
        eligibleStudents: ClassUser[];
        eligibleTeachers: ClassUser[];
    }>();
    const [ timeBeforeClass, setTimeBeforeClass ] = useState(Number.MAX_SAFE_VALUE);

    const now = new Date().getTime() / 1000;
    const secondsBeforeClassCanStart = 900;

    const {
        data: dataClassRoster,
        refetch,
        loading,
    } = useGetClassRosterEligibleUsers({
        variables: {
            class_id: nextClass?.class_id ?? ``,
            organization_id: currentOrganization.organization_id,
        },
    });

    async function getLiveToken (classId: string) {
        const headers = new Headers();
        headers.append(`Accept`, `application/json`);
        headers.append(`Content-Type`, `application/json`);
        const response = await fetch(`${getCNEndpoint()}v1/schedules/${classId}/live/token?live_token_type=live&org_id=${currentOrganization.organization_id
        }`, {
            headers,
            credentials: `include`,
            method: `GET`,
        });
        if (response.status === 200) {
            return response.json();
        }
    }

    function goLive () {
        const liveLink = `${getLiveEndpoint()}?token=${liveToken}`;
        window.open(liveLink);
    }

    useEffect(() => {
        const scheduledClass = schedule
            ?.filter((event) => event.status !== `Closed`)
            .filter((event) => event.class_type === `OnlineClass`)
            .filter((event) => event.end_at > now);

        if (!scheduledClass) return;
        setNextClass(scheduledClass[0]);
    }, [ schedule ]);

    useEffect(() => {
        if (!dataClassRoster?.class) return;
        setNextClassRoster(dataClassRoster.class);
    }, [ dataClassRoster ]);

    useEffect(() => {
        if (!nextClass) return;
        setTimeBeforeClass(nextClass?.start_at - new Date().getTime() / 1000);
    }, [ nextClass ]);

    useEffect(() => {
        if (timeBeforeClass < secondsBeforeClassCanStart && nextClass) {
            (async () => {
                const json = await getLiveToken(nextClass.id);
                if (!json || !json.token) {
                    setLiveToken(``);
                    return;
                }
                setLiveToken(json.token);

                const token: LivePreviewJWT = jwtDecode(json.token);
                setShareLink(token?.roomid);
            })();
        }
    }, [ timeBeforeClass ]);

    return (
        <Box className={classes.nextClassCard}>
            {nextClass ? (
                <Grid container>
                    <Grid
                        item
                        xs>
                        <Typography className={classes.nextClassCardTitle2}>
                            <FormattedMessage id="nextClass_title" />
                        </Typography>
                        <Typography className={classes.nextClassCardTitle}>
                            {nextClass?.title}
                        </Typography>

                        <Typography className={classes.warningText}>
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
                            justify="space-between">
                            <Grid item>
                                <Typography style={{
                                    fontWeight: `bold`,
                                }}>
                                    <FormattedDate
                                        value={nextClass?.start_at * 1000}
                                        month="long"
                                        weekday="long"
                                        day="2-digit"
                                    />
                                </Typography>
                                <Typography style={{
                                    fontWeight: `bold`,
                                }}>
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
                            </Grid>
                            <Grid
                                item
                                style={{
                                    marginLeft: theme.spacing(4),
                                }}
                            >
                                <StyledFAB
                                    extendedOnly
                                    flat
                                    className={classes.liveButton}
                                    size="medium"
                                    disabled={liveToken === ``}
                                    onClick={() => goLive()}
                                >
                                    {timeBeforeClass < secondsBeforeClassCanStart ? (
                                        <FormattedMessage id="live_liveButton" />
                                    ) : (
                                        <FormattedRelativeTime
                                            value={timeBeforeClass}
                                            updateIntervalInSeconds={1}
                                        />
                                    )}
                                </StyledFAB>
                            </Grid>
                        </Grid>
                    </Grid>

                    {nextClassRoster && nextClassRoster.eligibleTeachers.length !== 0 && (
                        <Grid
                            item
                            xs={12}
                            lg={6}
                            className={classes.nextClassGridDetails}>
                            <Box>
                                <Typography className={classes.nextClassCardTitle2}>
                                    <FormattedMessage
                                        id="nextClass_teachersTitle"
                                        values={{
                                            count: nextClassRoster?.eligibleTeachers.length,
                                        }}
                                    />
                                </Typography>
                                <Grid container>
                                    {nextClassRoster?.eligibleTeachers.map((teacher, i) => {
                                        const maxTeachers = 4;

                                        if (nextClassRoster?.eligibleTeachers.length < maxTeachers) {
                                            return (
                                                <Grid
                                                    key={teacher.user_id}
                                                    item
                                                    className={classes.teacher}>
                                                    <Box
                                                        display="flex"
                                                        flexDirection="row"
                                                        alignItems="center"
                                                        className="singleTeacher"
                                                    >
                                                        <UserAvatar
                                                            name={teacher.given_name + ` ` + teacher.family_name}
                                                            className={classes.avatar}
                                                            size="small"
                                                        />
                                                        <span>{teacher.given_name + ` ` + teacher.family_name}</span>
                                                    </Box>
                                                </Grid>
                                            );
                                        } else {
                                            if (i < maxTeachers || i === (nextClassRoster?.eligibleTeachers.length - 1)) {
                                                return (
                                                    <Grid
                                                        key={teacher.user_id}
                                                        item
                                                        className={classes.teacher}>
                                                        <Box>
                                                            {i < maxTeachers && (
                                                                <UserAvatar
                                                                    name={teacher.given_name + ` ` + teacher.family_name}
                                                                    className={classes.avatar}
                                                                />
                                                            )}
                                                            {i === nextClassRoster?.eligibleTeachers.length - 1 && (
                                                                <Tooltip title={nextClassRoster?.eligibleTeachers.map((teacher, i) => `${i === 0 ? `` : `, `} ${teacher.given_name + ` ` + teacher.family_name}`)}>
                                                                    <span> + {nextClassRoster?.eligibleTeachers.length - maxTeachers}</span>
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
                <FormattedMessage id="nextClass_noClass" />
            )}
        </Box>
    );
}