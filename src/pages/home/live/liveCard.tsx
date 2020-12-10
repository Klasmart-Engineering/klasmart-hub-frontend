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
import { useRestAPI } from "../../../api/restapi";

import CenterAlignChildren from "../../../components/centerAlignChildren";
import StyledFAB from "../../../components/styled/fabButton";

import { useReactiveVar } from "@apollo/client/react";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import KidsloopLogoAlt from "../../../assets/img/kidsloop_icon.svg";
import { currentMembershipVar } from "../../../cache";
import StyledTextField from "../../../components/styled/textfield";
import { PublishedContentItem } from "../../../types/objectTypes";
import { publishedContentPayload } from "../summary/payload";

const payload = publishedContentPayload.list;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        classInfoContainer: {
            background: `url(${KidsloopLogoAlt}) no-repeat`,
            // backgroundColor: "#e0edf7",
            backgroundPosition: "bottom right",
            backgroundPositionX: "120%",
            backgroundSize: "75%",
            borderRadius: 12,
            color: "#193d6f",
            height: "100%",
            minHeight: 440,
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
        select: {
            display: "block",
        },
    }),
);

export default function LiveCard() {
    const classes = useStyles();
    const theme = useTheme();
    const restApi = useRestAPI();

    const [lessonPlan, setLessonPlan] = useState<PublishedContentItem | undefined>(undefined);
    const [lessonPlans, setLessonPlans] = useState<PublishedContentItem[] | undefined>(payload);
    const [liveToken, setLiveToken] = useState("");

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
        const response = await fetch(`v1/contents/${lessonPlanId}/live/token`, {
            headers,
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
        if (!lessonPlan) { return; }
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
                    {/* <Grid item xs={12}>
                        <Typography variant="h6" style={{ paddingRight: theme.spacing(2) }}>
                            <FormattedMessage id={"live_lessonPlanLabel"} />:
                        </Typography>
                    </Grid> */}
                    <Grid item xs={12}>
                        <LessonPlanSelect lessonPlans={lessonPlans} lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
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
    lessonPlans?: PublishedContentItem[],
    lessonPlan?: PublishedContentItem,
    setLessonPlan: React.Dispatch<React.SetStateAction<PublishedContentItem>>,
}) {
    const classes = useStyles();

    return (
        <>
            <Autocomplete
                id="country-select-demo"
                style={{ width: "100%" }}
                options={lessonPlans as PublishedContentItem[]}
                classes={{
                    // option: classes.option,
                }}
                autoHighlight
                getOptionLabel={(option) => option.name}
                renderOption={(option) => (
                    <React.Fragment>
                        {option.name}
                    </React.Fragment>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select a Lesson Plan"
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                    />
                )}
            />
            {/* <Tooltip title={<FormattedMessage id="live_lessonPlanSelect" />} enterDelay={300}>
                <Button
                    color="inherit"
                    aria-owns={lessonPlanMenuElement ? "lesson-plan-select-menu" : undefined}
                    aria-haspopup="true"
                    data-ga-event-category="AppBar"
                    data-ga-event-action="lesson-plan-select"
                    fullWidth
                    onClick={(e) => setLessonPlanMenuElement(e.currentTarget)}
                >
                    <span className={classes.select}>
                        {!lessonPlan || lessonPlan?.name === ""
                            ? <FormattedMessage id="live_lessonPlanSelect" />
                            : lessonPlan?.name
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
                    lessonPlans?.map((lp) => (
                        <MenuItem
                            key={lp.id}
                            selected={lessonPlan?.id === lp.id}
                            onClick={() => setLessonPlan(lp)}
                        >
                            {lp.name}
                        </MenuItem>
                    ))
                }
            </StyledMenu> */}
        </>
    );
}
