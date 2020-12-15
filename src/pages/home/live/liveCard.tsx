import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
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
import Collapse from "@material-ui/core/Collapse";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Share as ShareIcon } from "@styled-icons/material/Share";
import jwtDecode from "jwt-decode";
import KidsloopLogoAlt from "../../../assets/img/kidsloop_icon.svg";
import { currentMembershipVar } from "../../../cache";
import InviteButton from "../../../components/invite";
import { getCNEndpoint } from "../../../config";
import { LivePreviewJWT, PublishedContentItem } from "../../../types/objectTypes";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        classInfoContainer: {
            // background: `url(${KidsloopLogoAlt}) no-repeat`,
            // backgroundColor: "#e0edf7",
            backgroundPosition: "bottom right",
            backgroundPositionX: "120%",
            backgroundSize: "75%",
            borderRadius: 12,
            color: "#193d6f",
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
            spacing={2}
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
                    { shareLink !== "" &&
                        <StyledFAB
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
    lessonPlan?: PublishedContentItem | null,
    setLessonPlan: React.Dispatch<React.SetStateAction<PublishedContentItem | null>>,
}) {
    const [inputValue, setInputValue] = useState("");

    return (
        <>
            <Autocomplete
                id="lesson-plan-select"
                disabled={!lessonPlans}
                style={{ width: "100%" }}
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
        </>
    );
}
