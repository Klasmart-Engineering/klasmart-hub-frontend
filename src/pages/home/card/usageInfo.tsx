import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState } from "react";

import { Divider, Grid, Paper, Typography, useTheme } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { useEffect } from "react";
import { SchedulePayload } from "../../../types/objectTypes";
import { schedulePayload } from "./payload";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        infoCard: {
            borderRadius: 12,
            height: "100%",
            padding: theme.spacing(2),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(1),
            },
        },
    }),
);

interface Data {
    type: string;
    total: number;
    attended: number;
}

export default function UsageInfo({ schedule }: { schedule?: SchedulePayload[] }) {
    const classes = useStyles();
    const theme = useTheme();
    const classType = ["OnlineClass", "OfflineClass", "Homework"];

    const [data, setData] = useState<Data[]>([]);

    useEffect(() => {
        const tmp: Data[] = [];
        classType.forEach((item) => {
            const events = schedule?.filter((event) => event.class_type === item);
            const total = events ? events.length : 0;
            const attended = events ? events.filter((event) => event.status === "Closed").length : 0;

            let type = "";
            switch (item) {
            case "OnlineClass":
                type = "live classes";
                break;
            case "OfflineClass":
                type = "offline classes";
                break;
            case "Homework":
                type = "homework";
                break;
            default:
                type = "classes";
                break;
            }
            tmp.push({type, total, attended});
        });
        setData(tmp);
    }, [schedule]);

    return (
        <>
            { data.map((item) =>
                <Grid key={item.type} item xs={4}>
                    <Card elevation={4} className={classes.infoCard}>
                        <CardContent>
                            <Typography variant="h4">
                                { item.total }
                            </Typography>
                            <Typography variant="caption">
                                { item.type }
                            </Typography>
                            <Divider style={{ margin: theme.spacing(1, 0)}}/>
                            <Typography variant="body2">
                                { item.attended } { item.type === "homework" ? "completed" : "attended" }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>,
            )}
        </>
    );
}
