import React, { useEffect, useState } from "react";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";

import { useReactiveVar } from "@apollo/client/react";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Share as ShareIcon } from "@styled-icons/material/Share";
import jwtDecode from "jwt-decode";

import Link from "@material-ui/core/Link";
import { useRestAPI } from "../../../api/restapi";
import KidsloopLogo from "../../../assets/img/kidsloop_icon.svg";
import { currentMembershipVar } from "../../../cache";
import CenterAlignChildren from "../../../components/centerAlignChildren";
import InviteButton from "../../../components/invite";
import StyledButton from "../../../components/styled/button";
import StyledFAB from "../../../components/styled/fabButton";
import { getCNEndpoint } from "../../../config";
import { LivePreviewJWT, PublishedContentItem, SchedulePayload } from "../../../types/objectTypes";
import { history } from "../../../utils/history";
import { schedulePayload } from "./payload";

const payload = schedulePayload;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            "backgroundColor": "#fff",
            "color": "black",
            "&:hover": {
                color: "white",
            },
        },
        classInfoContainer: {
            // background: `url(${KidsloopLogoAlt}) no-repeat`,
            // backgroundColor: "#e0edf7",
            backgroundPosition: "bottom right",
            backgroundPositionX: "120%",
            backgroundSize: "75%",
            borderRadius: 12,
            color: "#193d6f",
            height: "100%",
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                height: `min(${window.innerHeight - 20}px,56vw)`,
                padding: theme.spacing(2, 2),
            },
            [theme.breakpoints.down("xs")]: {
                height: `min(${window.innerHeight - 20}px,72vw)`,
            },
        },
        liveButton: {
            backgroundColor: "#ff6961",
            color: "white",
            marginRight: theme.spacing(2),

        },
        liveText: {
            backgroundColor: "#eda6c5",
            borderRadius: 12,
            color: "white",
            fontWeight: 600,
            padding: theme.spacing(0, 1),
        },
        select: {
            display: "block",
        },
        logo: {
            marginBottom: theme.spacing(0.5),
        },
    }),
);

export default function PlanSelection({ schedule }: { schedule?: SchedulePayload[] }) {
    if (!schedule) {
        schedule = payload;
    }

    const classes = useStyles();
    const theme = useTheme();
    const restApi = useRestAPI();

    const scheduledClass = schedule?.filter((event) => event.status !== "Closed");

    const [time, setTime] = useState(Date.now());
    const [lessonPlan, setLessonPlan] = useState<PublishedContentItem | null>(null);
    const [lessonPlans, setLessonPlans] = useState<PublishedContentItem[] | undefined>(undefined);
    const [liveToken, setLiveToken] = useState("");
    const [shareLink, setShareLink] = useState("");
    const [openShareLink, setOpenShareLink] = useState(false);

    const currentOrganization = useReactiveVar(currentMembershipVar);

    async function getPublishedLessonPlans() {
        try {
            const response = await restApi.publishedContent(currentOrganization.organization_id);
            console.log(response);
            setLessonPlans(response);
        } catch (e) {
            console.error(e);
        }
    }

    async function getLiveToken(lessonPlanId: string) {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const response = await fetch(`${getCNEndpoint()}v1/contents/${lessonPlanId}/live/token?org_id=${currentOrganization.organization_id}`, {
            headers,
            credentials: "include",
            method: "GET",
        });
        if (response.status === 200) { return response.json(); }
    }

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        return () => { clearInterval(interval); };
    }, []);

    useEffect(() => {
        if (currentOrganization.organization_id !== "") {
            getPublishedLessonPlans();
        }
    }, [currentOrganization]);

    useEffect(() => {
        if (!lessonPlan) {
            setLiveToken("");
            setShareLink("");
            return;
        }
        if (lessonPlan.id === "") { return; }
        let prepared = true;
        (async () => {
            const json = await getLiveToken(lessonPlan.id);
            if (prepared) {
                if (json && json.token) {
                    setLiveToken(json.token);

                    const token: LivePreviewJWT = jwtDecode(json.token);
                    console.log(token);
                    setShareLink(token?.roomid);
                } else {
                    setLiveToken("");
                }
            }
        })();
        return () => { prepared = false; };
    }, [lessonPlan]);

    function goLive() {
        const liveLink = `https://live.kidsloop.net/class-live/?token=${liveToken}`;
        window.open(liveLink);
    }

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="stretch"
            wrap="nowrap"
            className={classes.classInfoContainer}
        >
            <Grid item>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container direction="row" alignItems="center">
                            <Grid item style={{ marginBottom: theme.spacing(1), marginRight: theme.spacing(1) }}>
                                <CenterAlignChildren verticalCenter>
                                    <img alt="kidsloop logo" className={classes.logo} src={KidsloopLogo} width={38} />
                                    <Typography id="kidsloop live" className={classes.liveText} variant="caption">
                                            Live
                                    </Typography>
                                </CenterAlignChildren>
                            </Grid>
                            <Grid item>
                                <CenterAlignChildren>
                                    <Typography variant="h4">
                                        <FormattedTime value={time} hour="2-digit" minute="2-digit" />{" • "}
                                        <FormattedDate value={time} month="short" day="numeric" weekday="short" />
                                    </Typography>
                                </CenterAlignChildren>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container direction="column" alignContent="stretch">
                    { scheduledClass && scheduledClass.length !== 0 ?
                        <>
                            <Typography variant="body2">
                                You have { scheduledClass.length } scheduled classes upcoming in <FormattedDate value={time} month="long" />.
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                <Link href="#" onClick={(e: React.MouseEvent) => { history.push("/schedule"); e.preventDefault(); }}>See Your Schedule &gt;</Link>
                            </Typography>
                            <Grid item style={{ maxHeight: 360, overflowY: "auto" }}>
                                { scheduledClass.map((item) =>
                                    <Grid item key={item.id} style={{ paddingBottom: 4 }}>
                                        <Alert color="info" style={{ padding: "0 8px" }}>
                                            <FormattedTime value={time} hour="2-digit" minute="2-digit" />{" • "}
                                            <FormattedDate value={item.start_at * 1000} month="short" day="numeric" weekday="short" /> - { item.title }
                                        </Alert>
                                    </Grid>,
                                ) }
                            </Grid>
                        </> :
                        <Typography variant="body2" gutterBottom>
                            You don&apos;t have any upcoming classes scheduled!
                        </Typography>
                    }
                </Grid>
            </Grid>
            <Grid item>
                <CenterAlignChildren>
                    <LessonPlanSelect lessonPlans={lessonPlans} lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
                    <StyledFAB
                        disabled={liveToken === ""}
                        extendedOnly
                        className={classes.liveButton}
                        onClick={() => goLive()}
                        size="medium"
                    >
                        <FormattedMessage id="live_liveButton" />
                    </StyledFAB>
                    { shareLink !== "" &&
                            <StyledFAB
                                flat
                                style={{ minWidth: 0 }}
                                size="small"
                                onClick={() => setOpenShareLink(!openShareLink)}
                            >
                                <ShareIcon size="1rem" />
                            </StyledFAB>
                    }
                </CenterAlignChildren>
                <Collapse in={openShareLink}>
                    <InviteButton url={`https://live.kidsloop.net/class-live/?roomId=${shareLink}`} />
                </Collapse>
            </Grid>
        </Grid>
    );
}

function LessonPlanSelect({ lessonPlans, lessonPlan, setLessonPlan }: {
    lessonPlans?: PublishedContentItem[],
    lessonPlan?: PublishedContentItem | null,
    setLessonPlan: React.Dispatch<React.SetStateAction<PublishedContentItem | null>>,
}) {
    const theme = useTheme();
    const [inputValue, setInputValue] = useState("");

    return (
        <Autocomplete
            id="lesson-plan-select"
            disabled={!lessonPlans}
            style={{ flexGrow: 1, marginRight: theme.spacing(1) }}
            options={lessonPlans as PublishedContentItem[]}
            autoHighlight
            getOptionLabel={(option) => option.name}
            renderOption={(option) => (
                <React.Fragment>
                    {option.name}
                </React.Fragment>
            )}
            value={lessonPlan}
            onChange={(event: any, newValue: PublishedContentItem | null) => {
                setLessonPlan(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={lessonPlans ? "Select a Lesson Plan" : "No lesson plans available"}
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                />
            )}
        />
    );
}
