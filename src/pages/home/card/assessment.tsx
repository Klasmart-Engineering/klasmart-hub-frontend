
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { useReactiveVar } from "@apollo/client/react";
import { Grid, IconButton, Link, Tooltip, Typography, useTheme } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Loop as LoopIcon } from "@styled-icons/material/Loop";
import { useEffect } from "react";
import { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { useRestAPI } from "../../../api/restapi";
import { currentMembershipVar } from "../../../cache";
import CenterAlignChildren from "../../../components/centerAlignChildren";
import { AssessmentItem } from "../../../types/objectTypes";
import { history } from "../../../utils/history";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            "backgroundColor": "#fff",
            "color": "black",
            "&:hover": {
                color: "white",
            },
        },
        infoContainer: {
            borderRadius: 12,
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 2),
            },
        },
    }),
);

export default function Assessments() {
    const classes = useStyles();
    const restApi = useRestAPI();
    const theme = useTheme();

    const [assessments, setAssessments] = useState<AssessmentItem[] | undefined>(undefined);
    const [inProgress, setInProgress] = useState<AssessmentItem[] | undefined>(undefined);
    const [total, setTotal] = useState(0);
    const [chart, setChart] = useState(true);

    const currentOrganization = useReactiveVar(currentMembershipVar);

    async function getAssessmentsList() {
        try {
            const response = await restApi.assessments(currentOrganization.organization_id, 1, 1000);
            setAssessments(response);
            setInProgress(response.filter((assessment) => assessment.status === "in_progress"));
            setTotal(response.length);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (currentOrganization.organization_id !== "") {
            getAssessmentsList();
        }
    }, [currentOrganization]);

    return (
        <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="stretch"
            className={classes.infoContainer}
        >
            <Grid container spacing={2}>
                <Grid item>
                    <CenterAlignChildren>
                        <Typography variant="h6" style={{ padding: theme.spacing(1, 0) }}>
                            Assessments
                        </Typography>
                        <Tooltip title={`View as ${ chart ? "list" : "chart"}`} placement="right">
                            <IconButton aria-label="switch view" onClick={() => setChart(!chart)}>
                                <LoopIcon size="1em" />
                            </IconButton>
                        </Tooltip>
                    </CenterAlignChildren>
                </Grid>
                <Grid item xs={12}>
                    { inProgress && inProgress.length !== 0 ?
                        <>
                            <Typography variant="body2">
                                You have { inProgress.length } of {total} assessments that require your attention.
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
                        { assessments && inProgress &&
                            ( chart ?
                                <Grid item style={{ width: "80%", margin: "0 auto" }}>
                                    <PieChart
                                        data={[
                                            { title: "in progress", value: inProgress.length, color: "#94AD6C" },
                                            { title: "completed", value: total - inProgress.length, color: "#6C86AD" },
                                        ]}
                                        lineWidth={20}
                                        paddingAngle={18}
                                        rounded
                                        label={({ dataEntry }) => `${dataEntry.value} ${dataEntry.title}`}
                                        labelStyle={() => ({
                                            fontFamily: "Circular Std, sans-serif",
                                            fontSize: "0.25em",
                                        })}
                                        labelPosition={40}
                                    />
                                </Grid> :
                                <Grid item style={{ maxHeight: 460, overflowY: "auto" }}>
                                    { inProgress.map((item) =>
                                        <Grid item key={item.id} style={{ paddingBottom: 4 }}>
                                            <Alert color="warning" style={{ padding: "0 8px" }}>
                                                { item.title }
                                            </Alert>
                                        </Grid>,
                                    ) }
                                </Grid>
                            )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
