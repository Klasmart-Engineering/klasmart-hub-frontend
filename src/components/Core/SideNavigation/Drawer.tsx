import NavigationMenuList from "./NavigationMenuList";
import OrganizationMenuList from "./OrganizationMenuList";
import OrganizationSwitcher from "./OrganizationSwitcher";
import { MOBILE_WIDTHS } from "@/layout";
import {
    createStyles,
    Drawer,
    makeStyles,
    useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import { useWidth } from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";

const DRAWER_WIDTH = 256;

const useStyles = makeStyles((theme) => createStyles({
    drawer: {
        width: DRAWER_WIDTH,
        flexShrink: 0,
        flex: 0,
        transition: theme.transitions.create([ `flex` ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    drawerPaper: {
        width: DRAWER_WIDTH,
    },
    drawerShift: {
        [theme.breakpoints.up(`md`)]: {
            flex: `0 0 ${DRAWER_WIDTH}px`,
            transition: theme.transitions.create([ `flex` ], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    },
    menuContainer: {
        display: `flex`,
        flex: 0,
        flexDirection: `column`,
    },
}));

interface Props {
    open: boolean | undefined;
    onClose: (open: boolean) => void;
}

export default function SideNavigationDrawer (props: Props) {
    const { open, onClose } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [ drawerOpen, setDrawerOpen ] = useState(open);
    const [ showOrganizations, setShowOrganizations ] = useState(false);
    const width = useWidth();

    const anchor = theme.direction === `rtl` ? `right` : `left`;

    const handleClose = () => {
        const open = !drawerOpen;
        setDrawerOpen(open);
        onClose(open);
    };

    const drawer = (
        <>
            <OrganizationSwitcher
                showOrganizations={showOrganizations}
                onShowOrganizationsChange={setShowOrganizations}
            />
            <div
                className={classes.menuContainer}
                onClick={() => {
                    if (!MOBILE_WIDTHS.includes(width)) return;
                    onClose(false);
                }}>
                {showOrganizations
                    ? <OrganizationMenuList onOrganizationChange={() => setShowOrganizations(false)} />
                    : <NavigationMenuList/>
                }
            </div>
        </>
    );

    useEffect(() => {
        setDrawerOpen(open);
    }, [ open ]);

    return (
        <nav
            className={clsx(classes.drawer, {
                [classes.drawerShift]: drawerOpen,
            })}
        >
            {MOBILE_WIDTHS.includes(width)
                ? <Drawer
                    variant="temporary"
                    open={drawerOpen}
                    anchor={anchor}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    onClose={handleClose}
                >
                    {drawer}
                </Drawer>
                : <Drawer
                    variant="persistent"
                    open={drawerOpen}
                    anchor={anchor}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    {drawer}
                </Drawer>
            }
        </nav>
    );
}
