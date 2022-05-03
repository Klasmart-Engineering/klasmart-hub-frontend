import { useGetClassNodeRoster } from "@/api/classRoster";
import { useRestAPI } from "@/api/restapi";
import StyledFAB from "@/components/styled/fabButton";
import { getLiveEndpoint } from "@/config";
import { useCurrentOrganization } from "@/state/organizationMemberships";
import { SchedulePayload } from "@/types/objectTypes";
import {
    Box,
    Grid,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { UserAvatar } from "@kl-engineering/kidsloop-px";
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
        backgroundColor: theme.palette.error.main,
        color: `white`,
        marginLeft: theme.spacing(1),
    },
    warningText: {
        color: theme.palette.error.main,
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

interface Props {
    schedule?: SchedulePayload[];
}

export default function NextClass (props: Props) {
    const { schedule } = props;
    const classes = useStyles();
    const theme = useTheme();
    const restApi = useRestAPI();
    const [ liveToken, setLiveToken ] = useState(``);
    const currentOrganization = useCurrentOrganization();
    const [ nextClass, setNextClass ] = useState<SchedulePayload>();
    const [ timeBeforeClass, setTimeBeforeClass ] = useState(Number.MAX_SAFE_INTEGER);
    const [ maxTeachers, _ ] = useState(3);
    const organizationId = currentOrganization?.id ?? ``;
    const now = new Date().getTime() / 1000;
    const secondsBeforeClassCanStart = 900;

    const { data: rosterData } = useGetClassNodeRoster({
        variables: {
            id: nextClass?.class_id ?? ``,
            count: maxTeachers,
            orderBy: `familyName`,
            order: `ASC`,
            direction: `FORWARD`,
            showStudents: false,
            showTeachers: true,
        },
        skip: !nextClass?.class_id,
    });

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
        if (!nextClass) return;
        setTimeBeforeClass(nextClass?.start_at - new Date().getTime() / 1000);
    }, [ nextClass ]);

    useEffect(() => {
        if (timeBeforeClass < secondsBeforeClassCanStart && nextClass) {
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
                            justifyContent="space-between">
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

                    {rosterData?.classNode.teachersConnection?.totalCount !== 0 && (
                        <Grid
                            item
                            xs={12}
                            lg={6}
                            className={classes.nextClassGridDetails}>
                            <Box>
                                <Typography className={classes.nextClassCardTitle2}>
                                    <FormattedMessage
                                        id="home.nextClass.teachersTitle"
                                        values={{
                                            count: rosterData?.classNode.teachersConnection?.totalCount ?? 0,
                                        }}
                                    />
                                </Typography>
                                <Grid container>
                                    {rosterData?.classNode.teachersConnection?.edges.map((edge, i) => {
                                        return (
                                            <Grid
                                                key={edge.node.id}
                                                item
                                                className={classes.teacher}>
                                                {rosterData?.classNode.teachersConnection && rosterData?.classNode.teachersConnection?.totalCount <= maxTeachers &&
                                                    <Box
                                                        display="flex"
                                                        flexDirection="row"
                                                        alignItems="center"
                                                        className="singleTeacher"
                                                    >
                                                        <UserAvatar
                                                            name={`${edge.node.givenName} ${edge.node.familyName}`}
                                                            className={classes.avatar}
                                                            size="small"
                                                        />
                                                        <span>{edge.node.givenName} {edge.node.familyName}</span>
                                                    </Box>}
                                                {rosterData?.classNode.teachersConnection && rosterData?.classNode.teachersConnection?.totalCount > maxTeachers &&
                                                        <Box
                                                            display="flex"
                                                            flexDirection="row"
                                                            alignItems="center"
                                                        >
                                                            <UserAvatar
                                                                name={`${edge.node.givenName} ${edge.node.familyName}`}
                                                                className={classes.avatar}
                                                            />
                                                            {i === maxTeachers - 1 &&  <span> + {rosterData?.classNode.teachersConnection?.totalCount - maxTeachers}</span>}
                                                        </Box>
                                                }
                                            </Grid>
                                        );
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
