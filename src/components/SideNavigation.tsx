import {
    createStyles,
    Divider,
    Drawer,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    useTheme,
} from "@material-ui/core";
import {
    Inbox,
    Mail,
} from "@material-ui/icons";
import React,
{ useState } from "react";

export const DRAWER_WIDTH = 320;

const useStyles = makeStyles((theme) => createStyles({
    root: {
        display: `flex`,
    },
    drawer: {
        [theme.breakpoints.up(`sm`)]: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: DRAWER_WIDTH,
    },
}));

interface Props {

}

export default function SideNavigation (props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const [ open, setOpen ] = useState<boolean>();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const drawer = (
        <div>
            <Divider />
            <List>
                {[
                    `Inbox`,
                    `Starred`,
                    `Send email`,
                    `Drafts`,
                ].map((text, index) => (
                    <ListItem
                        key={text}
                        button>
                        <ListItemIcon>{index % 2 === 0 ? <Inbox /> : <Mail />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {[
                    `All mail`,
                    `Trash`,
                    `Spam`,
                ].map((text, index) => (
                    <ListItem
                        key={text}
                        button>
                        <ListItemIcon>{index % 2 === 0 ? <Inbox /> : <Mail />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <nav
            className={classes.drawer}
            aria-label="mailbox folders"
        >
            <Hidden
                smUp
                implementation="css"
            >
                <Drawer
                    variant="temporary"
                    anchor={theme.direction === `rtl` ? `right` : `left`}
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    onClose={handleDrawerToggle}
                >
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden
                xsDown
                implementation="css"
            >
                <Drawer
                    open
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="persistent"
                >
                    {drawer}
                </Drawer>
            </Hidden>
        </nav>
    );
}
