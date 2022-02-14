import { Data } from "./typings";
import {
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from "react";

type Props = {
    data: Data[];
    format: "desktop" | "mobile";
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: `flex`,
            flexDirection: `column`,
            justifyContent: `space-evenly`,
        },
        rootDesktop: {
            flexDirection: `column`,
        },
        rootMobile: {
            flexDirection: `row`,
        },
        container: {
            display: `flex`,
            alignItems: `left`,
            width: `100%`,
            flexDirection: `column`,
        },
        title: {
            color: theme.palette.grey[700],
            marginRight: 10,
        },
        titleDesktop: {
            fontSize: `1em`,
            textAlign: `left`,
        },
        titleMobile: {
            fontSize: `0.8em`,
            textAlign: `center`,
        },
        percentage: {
            fontWeight: 400,
        },
        percentageDesktop: {
            fontSize: `2em`,
            textAlign: `left`,
        },
        percentageMobile: {
            fontSize: `1.8em`,
            textAlign: `center`,
        },
    }));

export default function Legend (props: Props) {
    const classes = useStyles();
    const { data, format } = props;

    return (
        <div
            className={`${classes.root} ${format === `desktop` ? classes.rootDesktop : classes.rootMobile}`}>
            {data && data.map(item => {
                return (
                    <div
                        key={item.label}
                        className={classes.container}>
                        <Typography className={`${classes.title} ${format === `desktop` ? classes.titleDesktop : classes.titleMobile}`}>
                            {item.label}
                        </Typography>
                        <Typography
                            className={`${classes.percentage} ${format === `desktop` ? classes.percentageDesktop : classes.percentageMobile}`}
                            style={{
                                color: item.color,
                            }}>
                            {Math.floor(item.value! *100)}%
                        </Typography>
                    </div>
                );
            })}
        </div>
    );
}
