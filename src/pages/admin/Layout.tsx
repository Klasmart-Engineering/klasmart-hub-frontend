import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
        padding: 24,
    },
}));

export default function Layout (props: { children: React.ReactNode }) {
    const classes = useStyles();

    return <div className={classes.root}>
        {props.children}
    </div>;
}
