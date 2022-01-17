import { Data } from "./typings";
import {
    Theme,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import React from "react";

type Props = {
    data: Data[];
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: `flex`,
            flexDirection: `column`,
            justifyContent: `space-evenly`,
            paddingLeft: 50,
        },
        container: {
            display: `flex`,
            flexDirection: `column`,
            alignItems: `left`,
            width: `100%`,
        },
        title: {
            color: theme.palette.grey[700],
            fontSize: 12,
            marginRight: 10,
        },

        percentage: {
            fontSize: 32,
            fontWeight: 400,
        },
    }));

export default function Legend (props: Props) {
    const classes = useStyles();
    const { data } = props;

    return (
        <div className={classes.root}>
            {data && data.map(item => {
                return (
                    <div
                        key={item.label}
                        className={classes.container}>
                        <Typography className={classes.title}>
                            {item.label}
                        </Typography>
                        <Typography
                            className={classes.percentage}
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
