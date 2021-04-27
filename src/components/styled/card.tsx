import { Paper } from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paperContainer: {
            borderRadius: 12,
            border: `1px solid ${theme.palette.grey[300]}`,
            height: `100%`,
            boxShadow:
                theme.palette.type === `dark`
                    ? `0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)`
                    : `0px 4px 8px 0px rgba(0, 0, 0, 0.1)`,
        },
    }));

export default function Card ({ children }: { children: React.ReactNode }) {
    const classes = useStyles();

    return <Paper className={classes.paperContainer}>{children}</Paper>;
}
