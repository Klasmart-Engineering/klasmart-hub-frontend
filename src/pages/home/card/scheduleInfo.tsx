import React, { useState } from "react";
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from "react-intl";

import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";

import Link from "@material-ui/core/Link";
import KidsloopLogo from "../../../assets/img/kidsloop_icon.svg";
import CenterAlignChildren from "../../../components/centerAlignChildren";
import { history } from "../../../utils/history";
import { SchedulePayload } from "@/types/objectTypes";

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
            height: "100%",
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 2),
            },
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
    }),
);

export default function ScheduleInfo({ schedule }: { schedule?: SchedulePayload[] }) {
    const classes = useStyles();
    const intl = useIntl();

    const scheduledClass = schedule?.filter((event) => event.status !== "Closed");

    const [time, setTime] = useState(Date.now());

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
                                        <FormattedMessage id="scheduleInfo_live"></FormattedMessage>
                                    </Typography>
                                </CenterAlignChildren>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        {scheduledClass && scheduledClass.length !== 0 ?
                            <>
                                <Typography variant="body2">
                                    <FormattedMessage
                                        id="scheduleInfo_scheduleClassesLabel"
                                        values={{ scheduledClassAmount: scheduledClass.length }}
                                    ></FormattedMessage> <FormattedDate value={time} month="long" />.
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    <Link href="#" onClick={(e: React.MouseEvent) => { history.push("/schedule"); e.preventDefault(); }}>
                                        <FormattedMessage id="scheduleInfo_seeScheduleLabel"></FormattedMessage> &gt;
                                    </Link>
                                </Typography>
                            </> :
                            <Typography variant="body2" gutterBottom>
                                <FormattedMessage id="scheduleInfo_noClasses"></FormattedMessage>
                            </Typography>
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container direction="column" alignContent="stretch">
                            {scheduledClass && scheduledClass.length !== 0 &&
                                <Grid item style={{ maxHeight: 460, overflowY: "auto" }}>
                                    {scheduledClass.map((item) =>
                                        <Grid item key={item.id} style={{ paddingBottom: 4 }}>
                                            <Alert color="info" style={{ padding: "0 8px" }}>
                                                <FormattedTime value={item.start_at * 1000} hour="2-digit" minute="2-digit" />{" • "}
                                                <FormattedDate value={item.start_at * 1000} month="short" day="numeric" weekday="short" /> - {item.title}
                                            </Alert>
                                        </Grid>,
                                    )}
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
