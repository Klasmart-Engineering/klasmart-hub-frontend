import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme, useTheme, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import StyledFAB from "../../../components/styled/fabButton";
import CenterAlignChildren from "../../../components/centerAlignChildren";

import KidsloopLogoAlt from "../../../assets/img/kidsloop_icon.svg";

interface LessonPlanData {
    id: string;
    title: string;
    data?: any;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        classInfoContainer: {
            background: `url(${KidsloopLogoAlt}) no-repeat`,
            backgroundColor: "#e0edf7",
            backgroundPosition: "center right",
            backgroundPositionX: "120%",
            backgroundSize: "75%",
            borderRadius: 12,
            color: "#193d6f",
            height: "100%",
            minHeight: 440,
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                backgroundPosition: "bottom right",
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
        select: {
            display: "block",
        },
    }),
);

export default function LiveCard() {
    const classes = useStyles();
    const theme = useTheme();

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

    function goLive() {
        const liveLink = `https://live.kidsloop.net/class-live/?token=${liveToken}`;
        window.open(liveLink);
    }

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="flex-start"
            wrap="nowrap"
            className={classes.classInfoContainer}
        >
            <Grid item>
                <Grid container item spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4">
                            <FormattedMessage id={"live_welcome"} />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <CenterAlignChildren>
                            <Typography variant="h6" style={{ paddingRight: theme.spacing(2) }}>
                                <FormattedMessage id={"live_lessonPlanLabel"} />:
                            </Typography>
                            <LessonPlanSelect lessonPlans={lessonPlans} lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
                        </CenterAlignChildren>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <CenterAlignChildren>
                    <StyledFAB
                        disabled={liveToken === ""}
                        extendedOnly
                        flat
                        className={classes.liveButton}
                        onClick={() => goLive()}>
                        <FormattedMessage id="live_liveButton" />
                    </StyledFAB>
                </CenterAlignChildren>
            </Grid>
        </Grid>
    );
}

interface ClassInfo {
    classId: string;
    className: string;
}

const StyledMenu = withStyles({})((props: MenuProps) => (
    <Menu
        elevation={4}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

function LessonPlanSelect({ lessonPlans, lessonPlan, setLessonPlan }: {
    lessonPlans: LessonPlanData[],
    lessonPlan: LessonPlanData,
    setLessonPlan: React.Dispatch<React.SetStateAction<LessonPlanData>>,
}) {
    const classes = useStyles();

    const [lessonPlanMenuElement, setLessonPlanMenuElement] = useState<null | HTMLElement>(null);

    return (
        <>
            <Tooltip title={<FormattedMessage id="live_lessonPlanSelect" />} enterDelay={300}>
                <Button
                    color="inherit"
                    aria-owns={lessonPlanMenuElement ? "lesson-plan-select-menu" : undefined}
                    aria-haspopup="true"
                    data-ga-event-category="AppBar"
                    data-ga-event-action="lesson-plan-select"
                    onClick={(e) => setLessonPlanMenuElement(e.currentTarget)}
                >
                    <span className={classes.select}>
                        {lessonPlan.title === ""
                            ? <FormattedMessage id="live_lessonPlanSelect" />
                            : lessonPlan.title
                        }
                    </span>
                    <ExpandMoreIcon fontSize="small" />
                </Button>
            </Tooltip>
            <StyledMenu
                id="lesson-plan-select-menu"
                anchorEl={lessonPlanMenuElement}
                keepMounted
                open={Boolean(lessonPlanMenuElement)}
                onClose={() => setLessonPlanMenuElement(null)}
            >
                {
                    lessonPlans.map((lp) => (
                        <MenuItem
                            key={lp.id}
                            selected={lessonPlan.id === lp.id}
                            onClick={() => setLessonPlan(lp)}
                        >
                            {lp.title}
                        </MenuItem>
                    ))
                }
            </StyledMenu>
        </>
    );
}
