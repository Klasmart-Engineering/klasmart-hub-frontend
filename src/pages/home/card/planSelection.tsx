import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useReactiveVar } from "@apollo/client/react";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Share as ShareIcon } from "@styled-icons/material/Share";
import jwtDecode from "jwt-decode";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { useRestAPI } from "../../../api/restapi";
import { currentMembershipVar } from "../../../cache";
import InviteButton from "../../../components/invite";
import StyledFAB from "../../../components/styled/fabButton";
import { getCNEndpoint } from "../../../config";
import { LivePreviewJWT, PublishedContentItem } from "../../../types/objectTypes";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        infoCard: {
            borderRadius: 12,
            padding: theme.spacing(0, 2),
        },
        liveButton: {
            backgroundColor: "#ff6961",
            color: "white",
            marginLeft: theme.spacing(1),
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

export default function PlanSelection() {
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
        <Grid item xs={12}>
            <Card elevation={4} className={classes.infoCard}>
                <CardContent>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Grid item style={{ flex: 1 }}>
                            <LessonPlanSelect lessonPlans={lessonPlans} lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
                        </Grid>
                        <Grid item>
                            <StyledFAB
                                disabled={liveToken === ""}
                                extendedOnly
                                flat
                                className={classes.liveButton}
                                onClick={() => goLive()}
                                size="medium"
                            >
                                <FormattedMessage id="live_liveButton" />
                            </StyledFAB>
                            { shareLink !== "" &&
                                        <StyledFAB
                                            flat
                                            style={{ marginLeft: theme.spacing(1), minWidth: 0 }}
                                            size="small"
                                            onClick={() => setOpenShareLink(!openShareLink)}
                                        >
                                            <ShareIcon size="1rem" />
                                        </StyledFAB>
                            }
                        </Grid>
                    </Grid>
                    <Collapse in={openShareLink}>
                        <InviteButton url={`https://live.kidsloop.net/class-live/?roomId=${shareLink}`} />
                    </Collapse>
                </CardContent>
            </Card>
        </Grid>
    );
}

function LessonPlanSelect({ lessonPlans, lessonPlan, setLessonPlan }: {
    lessonPlans?: PublishedContentItem[],
    lessonPlan?: PublishedContentItem | null,
    setLessonPlan: React.Dispatch<React.SetStateAction<PublishedContentItem | null>>,
}) {
    const [inputValue, setInputValue] = useState("");

    return (
        <Autocomplete
            id="lesson-plan-select"
            disabled={!lessonPlans}
            options={lessonPlans as PublishedContentItem[]}
            fullWidth
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
