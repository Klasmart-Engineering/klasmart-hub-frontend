import SideNavigation from "./components/SideNavigation";
import NavBar from "./components/styled/navbar/navbar";
import Router from "./router";
import Grid from "@material-ui/core/Grid";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import * as React from "react";
import { withOrientationChange } from "react-device-detect";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: `flex`,
    },
    content: {
        flexGrow: 1,
    },
}));

const Layout = (props: any) => {
    const classes = useStyles();

    console.log(`classes`, classes);

    return (
        <div className={classes.root}>
            <NavBar />
            <SideNavigation />
            <main className={classes.content}>
                <Router />
            </main>
        </div>
    );
};

export default withOrientationChange(Layout);
