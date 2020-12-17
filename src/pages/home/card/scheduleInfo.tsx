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

import Button from "@material-ui/core/Button";
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
            "&:hover": {
                color: "white",
            },
            "backgroundColor": "#fff",
            "color": "black",
        },
        classInfoContainer: {
            borderRadius: 12,
            color: "#193d6f",
            height: "100%",
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 2),
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
        logo: {
            marginBottom: theme.spacing(0.5),
        },
        select: {
            display: "block",
        },
    }),
);

export default function ScheduleInfo({ schedule }: { schedule?: SchedulePayload[] }) {
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

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            className={classes.classInfoContainer}
        >
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container direction="row" alignItems="center">
                            <Grid item>
                                <CenterAlignChildren verticalCenter>
                                    <img alt="kidsloop logo" className={classes.logo} src={KidsloopLogo} width={38} />
                                    <Typography id="kidsloop live" className={classes.liveText} variant="caption">
                                            Live
                                    </Typography>
                                </CenterAlignChildren>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        { scheduledClass && scheduledClass.length !== 0 ?
                            <>
                                <Typography variant="body2">
                                    You have { scheduledClass.length } scheduled classes upcoming in <FormattedDate value={time} month="long" />.
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <Link href="#" onClick={(e: React.MouseEvent) => { history.push("/schedule"); e.preventDefault(); }}>See Your Schedule &gt;</Link>
                                </Typography>
                            </> :
                            <Typography variant="body2" gutterBottom>
                                You don&apos;t have any upcoming classes scheduled!
                            </Typography>
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container direction="column" alignContent="stretch">
                            { scheduledClass && scheduledClass.length !== 0 &&
                                <Grid item style={{ maxHeight: 460, overflowY: "auto" }}>
                                    { scheduledClass.map((item) =>
                                        <Grid item key={item.id} style={{ paddingBottom: 4 }}>
                                            <Alert color="info" style={{ padding: "0 8px" }}>
                                                <FormattedTime value={item.start_at * 1000} hour="2-digit" minute="2-digit" />{" • "}
                                                <FormattedDate value={item.start_at * 1000} month="short" day="numeric" weekday="short" /> - { item.title }
                                            </Alert>
                                        </Grid>,
                                    ) }
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
