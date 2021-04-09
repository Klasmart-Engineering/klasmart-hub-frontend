import NavigationMenuList from "./NavigationMenuList";
import OrganizationMenuList from "./OrganizationMenuList";
import OrganizationSwitcher from "./OrganizationSwitcher";
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
    const [ openDrawer, setOpenDrawer ] = useState<boolean | undefined>(open);
    const [ showOrganizations, setShowOrganizations ] = useState(false);
    const width = useWidth();

    const handleClose = () => {
        const open = openDrawer === false ? true : false;
        setOpenDrawer(open);
        onClose(open);
    };

    useEffect(() => {
        setOpenDrawer(open);
    }, [ open ]);

    const drawer = (
        <>
            <OrganizationSwitcher
                showOrganizations={showOrganizations}
                onShowOrganizationsChange={setShowOrganizations}
            />
            <div
                className={classes.menuContainer}
                onClick={() => {
                    if (![ `xs`, `sm` ].includes(width)) return;
                    onClose(false);
                }}>
                {showOrganizations
                    ? <OrganizationMenuList onOrganizationChange={() => setShowOrganizations(false)} />
                    : <NavigationMenuList/>
                }
            </div>
        </>
    );

    return (
        <nav
            className={clsx(classes.drawer, {
                [classes.drawerShift]: openDrawer !== false,
            })}
        >
            {[ `xs`, `sm` ].includes(width)
                ? <Drawer
                    variant="temporary"
                    anchor={theme.direction === `rtl` ? `right` : `left`}
                    open={openDrawer !== false}
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
                    open={openDrawer !== false}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="persistent"
                >
                    {drawer}
                </Drawer>
            }
        </nav>
    );
}
