
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { useReactiveVar } from "@apollo/client/react";
import { Grid, Link, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useEffect } from "react";
import { useState } from "react";
import { useRestAPI } from "../../../api/restapi";
import { currentMembershipVar, userIdVar } from "../../../cache";
import StyledButton from "../../../components/styled/button";
import { AssessmentItem } from "../../../types/objectTypes";
import { history } from "../../../utils/history";
import { assessmentPayload } from "./payload";

const payload = assessmentPayload.items;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            "backgroundColor": "#fff",
            "color": "black",
            "&:hover": {
                color: "white",
            },
        },
        viewScheduleLink: {
            "maxWidth": 0,
            "transition": "max-width 1s,opacity 1s,transform 750ms,-webkit-transform 750ms,-moz-transform 750ms,-o-transform 750ms",
            "whiteSpace": "nowrap",
            cursor: "pointer",
            "&:hover": {
                maxWidth: "auto",
            },
        },
    }),
);

export default function AssessmentInfo() {
    const classes = useStyles();
    const restApi = useRestAPI();

    const [assessments, setAssessments] = useState<AssessmentItem[] | undefined>(payload);

    const currentOrganization = useReactiveVar(currentMembershipVar);

    async function getAssessmentsList() {
        try {
            const response = await restApi.assessments(currentOrganization.organization_id, 1, 50);
            console.log(response);
            setAssessments(response);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (currentOrganization.organization_id !== "") {
            getAssessmentsList();
        }
    }, [currentOrganization]);

    const inProgress = assessments?.filter((assessment) => assessment.status === "in_progress");

    return (
        <>
            <Grid item xs={12}>
                { inProgress && inProgress.length !== 0 ?
                    <>
                        <Typography variant="body2">
                            You have { inProgress.length } assessments that require your attention.
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            <Link href="#" onClick={(e: React.MouseEvent) => { history.push("/assessments/assessment-list"); e.preventDefault(); }}>View Assessments &gt;</Link>
                        </Typography>
                    </> :
                    <Typography variant="body2" gutterBottom>
                        You have no new updates!
                    </Typography>
                }
            </Grid>
            <Grid item xs={12}>
                <Grid container direction="column" alignContent="stretch">
                    { inProgress && inProgress.length !== 0 &&
                        <Grid item style={{ maxHeight: 460, overflowY: "auto" }}>
                            { inProgress.map((item) =>
                                <Grid item key={item.id} style={{ paddingBottom: 4 }}>
                                    <Alert color="warning" style={{ padding: "0 8px" }}>
                                        { item.title }
                                    </Alert>
                                </Grid>,
                            ) }
                        </Grid>
                    }
                </Grid>
            </Grid>
        </>
    );
}
