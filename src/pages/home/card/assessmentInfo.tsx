
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { useReactiveVar } from "@apollo/client/react";
import { Grid, Typography } from "@material-ui/core";
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
            { inProgress && inProgress.length !== 0 ?
                <>
                    <Typography variant="body2" gutterBottom>
                        You have { inProgress.length } assessments that require your attention.
                    </Typography>
                    { inProgress.slice(0, 4).map((item) =>
                        <Grid item key={item.id} style={{ paddingBottom: 4 }}>
                            <Alert color="warning" style={{ padding: "0 8px" }}>
                                { item.title }
                            </Alert>
                        </Grid>,
                    ) }
                    <Grid item style={{ paddingBottom: 4 }}>
                        <StyledButton
                            extendedOnly
                            className={classes.button}
                            size="small"
                            fullWidth
                            onClick={() => history.push("/assessments/assessment-list")}
                        >
                            See More
                        </StyledButton>
                    </Grid>
                </> :
                <Typography variant="body2" gutterBottom>
                    You have no new updates!
                </Typography>
            }
        </>
    );
}
