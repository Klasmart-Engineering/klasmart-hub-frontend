import { v4 as uuid } from "uuid";
const classId = uuid().substr(0, 5);

import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, useTheme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import CenterAlignChildren from "../../../components/centerAlignChildren";
import StyledFAB from "../../../components/styled/fabButton";

import Hidden from "@material-ui/core/Hidden";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ZooLogo from "../../../assets/img/logo_badanamu_zoo.png";
import ZooBannerMobile from "../../../assets/img/zoo_banner_mobile.png";
import ZooBannerWeb from "../../../assets/img/zoo_banner_web.png";
import StyledButtonGroup from "../../../components/styled/buttonGroup";

const DEMO_LESSON_PLANS = [
    {
        id: "demo-lesson-plan01", title: "Badanamu Zoo: Snow Leopard",
    },
];

const DEMO_LESSON_MATERIALS = [
    { name: "Introduction", url: "/h5p/play/5ed99fe36aad833ac89a4803" },
    { name: "Sticker Activity", url: "/h5p/play/5ed0b64a611e18398f7380fb" },
    { name: "Hotspot Cat Family 1", url: "/h5p/play/5ecf6f43611e18398f7380f0" },
    { name: "Hotspot Cat Family 2", url: "/h5p/play/5ed0a79d611e18398f7380f7" },
    { name: "Snow Leopard Camouflage 1", url: "/h5p/play/5ecf71d2611e18398f7380f2" },
    { name: "Snow Leopard Camouflage 2", url: "/h5p/play/5ed0a79d611e18398f7380f7" },
    { name: "Snow Leopard Camouflage 3", url: "/h5p/play/5ed0a7d6611e18398f7380f8" },
    { name: "Snow Leopard Camouflage 4", url: "/h5p/play/5ed0a7f8611e18398f7380f9" },
    { name: "Snow Leopard Camouflage 5", url: "/h5p/play/5ed0a823611e18398f7380fa" },
    { name: "Matching", url: "/h5p/play/5ecf4e4b611e18398f7380ef" },
    { name: "Quiz", url: "/h5p/play/5ed07656611e18398f7380f6" },
];

interface LessonPlanData {
    id: string;
    title: string;
    data?: any;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        contentInfo: {
            borderRadius: 12,
            color: "white",
            height: 350,
            paddingBottom: theme.spacing(3),
            paddingLeft:  theme.spacing(5),
            paddingTop: theme.spacing(3),
            zIndex: 10,
            [theme.breakpoints.down("md")]: {
                backgroundImage: "linear-gradient(to bottom, #030D1C, rgba(3, 13, 28, 0.8), transparent)",
                color: "white",
                height: 600,
                padding: theme.spacing(5),
            },
            [theme.breakpoints.down("xs")]: {
                height: 600,
            },
        },
        headerView: {
            background: "#030D1C",
            borderRadius: 12,
            height: 350,
            [theme.breakpoints.down("md")]: {
                background: `linear-gradient( rgba(3, 13, 28, 0.4), rgba(3, 13, 28, 0.4) ), url(${ZooBannerMobile})`,
                backgroundPosition: "center 60%",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "100%",
                minHeight: 600,
            },
        },
        headerWebBackground: {
            backgroundImage: `url(${ZooBannerWeb})`,
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            borderRadius: 12,
            boxShadow: "inset 20px 0px 2em 1em #030D1C",
        },
        liveButton: {
            backgroundColor: "#ff6961",
            color: "white",
            marginRight: theme.spacing(2),
        },
        liveTextWrapper: {
            backgroundColor: "#ff6961",
            borderRadius: 20,
            color: "white",
            fontSize: "0.6em",
            padding: theme.spacing(0.25, 0.75),
        },
        select: {
            display: "block",
        },
    }),
);

export default function ContentCard() {
    const classes = useStyles();
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

    const [userType, setUserType] = useState("teacher");
    const [className, setClassName] = useState(classId);
    const [userName, setUserName] = useState("");
    const [lessonPlan, setLessonPlan] = useState<LessonPlanData>({ id: "", title: "" });
    const [lessonPlans, setLessonPlans] = useState<LessonPlanData[]>([]);
    const [liveToken, setLiveToken] = useState("");

    async function fetchPublishedLessonPlans() {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const response = await fetch("/v1/contents?publish_status=published", {
            headers,
            method: "GET",
        });
        if (response.status === 200) { return response.json(); }
    }

    async function getLiveToken(lessonPlanId: string) {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const response = await fetch(`v1/contents/${lessonPlanId}/live/token`, {
            headers,
            method: "GET",
        });
        if (response.status === 200) { return response.json(); }
    }

    useEffect(() => {
        let prepared = true;
        (async () => {
            const json = await fetchPublishedLessonPlans();
            if (prepared) {
                if (json && json.list) {
                    const publishedLP = json.list.filter((lp: any) => lp.publish_status == "published" && lp.content_type_name == "Plan");
                    const lpList = publishedLP.map((lp: any) => {
                        return { id: lp.id, title: lp.name, data: lp.data };
                    });
                    console.log("publishedLP: ", publishedLP);
                    setLessonPlans(lpList);
                } else {
                    setLessonPlans([{ id: "", title: "Lesson plan does not exist yet" }]);
                }
            }
        })();
        return () => { prepared = false; };
    }, []);

    useEffect(() => {
        if (lessonPlan.id === "") { return; }
        let prepared = true;
        (async () => {
            const json = await getLiveToken(lessonPlan.id);
            // console.log("liveToken: ", json);
            if (prepared) {
                if (json && json.token) {
                    setLiveToken(json.token);
                } else {
                    setLiveToken("");
                }
            }
        })();
        return () => { prepared = false; };
    }, [lessonPlan]);

    useEffect(() => {
        if (userType === "student") { setClassName(""); }
        if (userType === "teacher") { setClassName(classId); }
    }, [userType]);

    function goLive() {
        const liveLink = `https://live.kidsloop.net/class-live/?token=${liveToken}`;

        window.open(liveLink);
    }

    return (
        <Grid
            container
            className={classes.headerView}
            direction="row"
            justify="space-between"
            alignItems={ isMdDown ? "flex-start" : "center" }
        >
            <Grid item xs={12} lg={4} className={classes.contentInfo}>
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                    wrap="nowrap"
                    style={{ minHeight: "100%" }}
                    spacing={2}
                >
                    <Grid item>
                        <CenterAlignChildren>
                            <img src={ZooLogo} style={{ marginRight: theme.spacing(1), maxHeight: "5vw" }}/>
                            <Typography variant="h5">
                                    Snow Leopard
                            </Typography>
                        </CenterAlignChildren>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">
                                In collaboration with The Zoological Society of East Anglia, join an interactive virtual world of animal fun and learning through live and self-paced classes.
                        </Typography>
                    </Grid>
                    <Grid item>
                        <StyledButtonGroup ariaLabel="content mode buttons" options={["Go Live", "Classroom Mode"]} />
                    </Grid>
                </Grid>
            </Grid>
            <Hidden mdDown>
                <Grid item xs={12} lg={8} className={classes.headerWebBackground}>
                    <div style={{ height: 350, width: "100%" }} />
                </Grid>
            </Hidden>
        </Grid>
    );
}
