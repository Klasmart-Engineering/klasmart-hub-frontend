import Toolbar from "./components/Core/AppBar/Toolbar";
import SideNavigationDrawer from "./components/Core/SideNavigation/Drawer";
import Router from "./router";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import { useWidth } from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: `flex`,
        overflowY: `auto`,
    },
    content: {
        flex: 1,
    },
    navMainContainer: {
        display: `flex`,
        flex: 1,
        flexDirection: `column`,
        width: `calc(100vw - 256px)`,
        height: `100vh`,
    },
}));

export const MOBILE_WIDTHS = [ `xs`, `sm` ];

interface Props {
}

export default function Layout (props: Props) {
    const classes = useStyles();
    const [ navigationDrawerOpen, setNavigationDrawerOpen ] = useState<boolean>();
    const width = useWidth();
    const [ windowWidth, setWindowWidth ] = useState(width);

    const handleMenuButtonClick = () => {
        setNavigationDrawerOpen((open) => open === undefined ? MOBILE_WIDTHS.includes(width) : !open);
    };

    useEffect(() => {
        if (MOBILE_WIDTHS.includes(width) === MOBILE_WIDTHS.includes(windowWidth)) {
            setWindowWidth(width);
            return;
        }
        setWindowWidth(width);
        setNavigationDrawerOpen(!MOBILE_WIDTHS.includes(width));
    }, [ width ]);

    return (
        <div className={classes.root}>
            <SideNavigationDrawer
                open={navigationDrawerOpen}
                onClose={setNavigationDrawerOpen}
            />
            <div className={classes.navMainContainer}>
                <Toolbar
                    sideNavigationDrawerOpen={navigationDrawerOpen}
                    onMenuButtonClick={handleMenuButtonClick}
                />
                <main className={classes.content}>
                    <Router />
                </main>
            </div>
        </div>
    );
}
