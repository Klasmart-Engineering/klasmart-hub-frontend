import Toolbar from "./components/Core/AppBar/Toolbar";
import SideNavigationDrawer,
{ DRAWER_WIDTH } from "./components/Core/SideNavigation/Drawer";
import Router from "./router";
import { useRect } from "./utils/useRect";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import clsx from "clsx";
import React,
{ useState } from "react";
import { withOrientationChange } from "react-device-detect";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: `flex`,
    },
    content: {
        flexGrow: 1,
    },
    navMainContainer: {
        display: `flex`,
        flex: 1,
        flexDirection: `column`,
        width: `calc(100vw - 256px)`,
        height: `100vh`,
    },
}));

interface Props {
}

const ref = React.createRef<HTMLDivElement>();
const Layout = (props: Props) => {
    const classes = useStyles();
    const rect = useRect(ref);
    const [ navigationDrawerOpen, setNavigationDrawerOpen ] = useState<boolean>();

    return (
        <div className={classes.root}>
            <SideNavigationDrawer
                open={navigationDrawerOpen}
                onClose={setNavigationDrawerOpen}
            />
            <div className={classes.navMainContainer}>
                <Toolbar
                    sideNavigationDrawerOpen={navigationDrawerOpen}
                    onMenuButtonClick={() => setNavigationDrawerOpen((open) => open === false ? true : false)}
                />
                <main
                    ref={ref}
                    className={classes.content}
                >
                    <Router rect={rect} />
                </main>
            </div>
        </div>
    );
};

export default withOrientationChange(Layout);
