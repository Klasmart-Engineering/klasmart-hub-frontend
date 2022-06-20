import Toolbar from "../AppBar/Toolbar";
import CompositeProfileSwitcher from "./CompositeProfileSwitcher";
import NavigationMenuList from "./NavigationMenuList";
import { MOBILE_WIDTHS } from "@/layout/Base/Base";
import {
    useIsMobileScreen,
    useIsMobileTabletScreen,
    useIsTabletScreen,
} from "@/layout/utils";
import {
    isSideNavigationDrawerMiniVariantState,
    sideNavigationDrawerOpenState,
} from "@/store/site";
import {
    useGlobalState,
    useGlobalStateValue,
} from "@kl-engineering/frontend-state";
import { useWidth } from "@kl-engineering/kidsloop-px";
import {
    Box,
    Drawer,
    Stack,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";

export const DRAWER_WIDTH_FULL = 200;
export const DRAWER_WIDTH_MINI = 64;

const useStyles = makeStyles((theme) => createStyles({
    drawerContainer: {
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: DRAWER_WIDTH_FULL,
        display: `flex`,
        transition: theme.transitions.create([ `flex-basis` ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    drawerContainerMini: {
        flexBasis: DRAWER_WIDTH_MINI,
    },
    drawerContainerMobile: {
        flexBasis: 0,
    },
    drawer: {
        width: DRAWER_WIDTH_FULL,
        transition: theme.transitions.create([ `width` ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    drawerMini: {
        width: DRAWER_WIDTH_MINI,
    },
    menuContainer: {
        display: `flex`,
        flex: 0,
        flexDirection: `column`,
    },
}));

interface Props {
}

export default function SideNavigationDrawer (props: Props) {
    const classes = useStyles();
    const width = useWidth();
    const [ drawerOpen, setDrawerOpen ] = useGlobalState(sideNavigationDrawerOpenState);
    const isSideNavigationDrawerMiniVariant = useGlobalStateValue(isSideNavigationDrawerMiniVariantState);
    const isSmallScreen = useIsMobileTabletScreen();
    const isMobileScreen = useIsMobileScreen();
    const isTabletScreen = useIsTabletScreen();

    const handleClose = () => {
        setDrawerOpen((open) => !open);
    };

    return (
        <nav
            className={clsx(classes.drawerContainer, {
                [classes.drawerContainerMini]: !isSmallScreen && isSideNavigationDrawerMiniVariant,
                [classes.drawerContainerMobile]: isSmallScreen,
            })}
        >
            {MOBILE_WIDTHS.includes(width) && (
                <Drawer
                    className={classes.drawer}
                    variant="temporary"
                    open={drawerOpen}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    PaperProps={{
                        sx: {
                            position: `static`,
                        },
                    }}
                    onClose={handleClose}
                >
                    <Toolbar isMiniVariant />
                    <Stack
                        direction="column"
                        height="100%"
                    >
                        <CompositeProfileSwitcher />
                        <Box flex="1">
                            <NavigationMenuList />
                        </Box>
                    </Stack>
                </Drawer>
            )}
            {!isMobileScreen && (
                <Drawer
                    className={clsx(classes.drawer, {
                        [classes.drawerMini]: isSideNavigationDrawerMiniVariant || isTabletScreen,
                    })}
                    variant="permanent"
                    open={drawerOpen}
                    PaperProps={{
                        sx: {
                            position: `static`,
                            overflowX: `hidden`,
                        },
                    }}
                >
                    <Stack
                        direction="column"
                        height="100%"
                    >
                        <CompositeProfileSwitcher isMiniVariant={isSideNavigationDrawerMiniVariant || isTabletScreen} />
                        <Box flex="1">
                            <NavigationMenuList isMiniVariant={isSideNavigationDrawerMiniVariant || isTabletScreen} />
                        </Box>
                    </Stack>
                </Drawer>
            )}
        </nav>
    );
}
