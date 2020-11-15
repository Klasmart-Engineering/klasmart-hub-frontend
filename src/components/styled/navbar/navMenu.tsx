import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { TransitionProps } from "@material-ui/core/transitions";
import Typography from "@material-ui/core/Typography";
import AllInboxTwoToneIcon from "@material-ui/icons/AllInboxTwoTone";
import AppsIcon from "@material-ui/icons/Apps";
import BusinessTwoToneIcon from "@material-ui/icons/BusinessTwoTone";
import ContactSupportTwoToneIcon from "@material-ui/icons/ContactSupportTwoTone";
import CreditCardTwoToneIcon from "@material-ui/icons/CreditCardTwoTone";
import GroupTwoToneIcon from "@material-ui/icons/GroupTwoTone";
import HomeIcon from "@material-ui/icons/Home";
import LockTwoToneIcon from "@material-ui/icons/LockTwoTone";
import PersonOutlineTwoToneIcon from "@material-ui/icons/PersonOutlineTwoTone";
import PhonelinkTwoToneIcon from "@material-ui/icons/PhonelinkTwoTone";
import SchoolTwoToneIcon from "@material-ui/icons/SchoolTwoTone";
import SecurityTwoToneIcon from "@material-ui/icons/SecurityTwoTone";
import TableChartTwoToneIcon from "@material-ui/icons/TableChartTwoTone";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DialogAppBar from "../../../components/styled/dialogAppBar";
import { State } from "../../../store/store";
import { MenuItem } from "../../../types/objectTypes";
import { history } from "../../../utils/history";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: "relative",
        },
        menuButton: {
            maxWidth: "90%",
            padding: theme.spacing(2),
            [theme.breakpoints.down("sm")]: {
                maxWidth: "100%",
            },
        },
        menuContainer: {
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 2),
            },
        },
        menuGrid: {
            padding: theme.spacing(1),
            textAlign: "center",
        },
        title: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(1),
        },
    }),
);

interface MenuItemProps {
    content: MenuItem;
}

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function MenuButton(props: MenuItemProps) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            <Button fullWidth className={classes.menuButton} onClick={handleClick}>
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item>
                        {props.content.logo}
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">
                            {props.content.title}
                        </Typography>
                        <Typography variant="caption" style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                            {props.content.description}
                        </Typography>
                    </Grid>
                </Grid>
            </Button>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info">
                    This is currently planned for a future release!
                </Alert>
            </Snackbar>
        </>
    );
}

const Motion = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Grow style={{ transformOrigin: "0 0 0" }} ref={ref} {...props} />;
});

export default function NavMenu() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const MENU_ITEMS: MenuItem[] = [
        {
            description: "View learning outcomes and student statistics",
            link: "/admin/report",
            logo: <TableChartTwoToneIcon style={{ color: "#f7a219", fontSize: 48 }} />,
            title: "Analytics and Reports",
        },
        {
            description: "Approve, manage, and view your content library",
            link: "/library",
            logo: <AllInboxTwoToneIcon style={{ color: "#1f94e8", fontSize: 48 }} />,
            title: "Content Library",
        },
        {
            description: "Add or manage roles",
            link: "/admin/roles",
            logo: <GroupTwoToneIcon style={{ color: "#27bed6", fontSize: 48 }} />,
            title: "Roles",
        },
        {
            description: "Update personalization and manage your organization",
            link: "/admin/allOrganization",
            logo: <BusinessTwoToneIcon style={{ color: "#0E78D5", fontSize: 48 }} />,
            title: "Organization Profile",
        },
        {
            description: "Manage schools and resources",
            link: "/admin/school",
            logo: <SchoolTwoToneIcon style={{ color: "#0E78D5", fontSize: 48 }} />,
            title: "Schools and Resources",
        },
        {
            description: "Manage users and their permissions",
            link: "/admin/user",
            logo: <PersonOutlineTwoToneIcon style={{ color: "#0E78D5", fontSize: 48 }} />,
            title: "Users",
        },
        {
            description: "Manage billing and subscriptions",
            link: "#",
            logo: <CreditCardTwoToneIcon style={{ color: "gray" /* "#b0bec5" */, fontSize: 48 }} />,
            title: "Billing",
        },
        {
            description: "Manage data usage and set data usage settings",
            link: "#",
            logo: <LockTwoToneIcon style={{ color: "gray" /* "#816961" */, fontSize: 48 }} />,
            title: "Data Security and Migration",
        },
        {
            description: "Organization-owned devices and app licenses",
            link: "#",
            logo: <PhonelinkTwoToneIcon style={{ color: "gray" /* theme.palette.type === "dark" ? "#fefefe" : "#263238" */, fontSize: 48 }} />,
            title: "Devices, Apps and Licenses",
        },
        {
            description: "Configure security settings",
            link: "#",
            logo: <SecurityTwoToneIcon style={{ color: "gray" /* "#8396a0" */, fontSize: 48 }} />,
            title: "Security",
        },
        {
            description: "Get onboarding, training, and troubleshooting support",
            link: "#",
            logo: <ContactSupportTwoToneIcon style={{ color: "gray" /* "#3baf77" */, fontSize: 48 }} />,
            title: "Support",
        },
    ];

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton
                edge="start"
                onClick={handleClickOpen}
                color="inherit"
                aria-label="menu"

            >
                <AppsIcon />
            </IconButton>
            { window.location.hash !== "#/" ?
                <IconButton
                    aria-label="home"
                    color="inherit"
                    edge="end"
                    onClick={() => { history.push("/"); }}
                    style={{ marginRight: theme.spacing(2) }}
                >
                    <HomeIcon />
                </IconButton> : null
            }
            <Dialog
                aria-labelledby="nav-menu-title"
                aria-describedby="nav-menu-description"
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Motion}
            >
                <DialogAppBar
                    handleClose={handleClose}
                    subtitleID={"navMenu_adminConsoleLabel"}
                />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="stretch"
                    className={classes.menuContainer}
                >
                    {
                        MENU_ITEMS.map((menuItem) => {
                            return (
                                <Grid
                                    key={`menuItem-${menuItem.title}`}
                                    item
                                    xs={6} sm={4} md={3} lg={2}
                                    style={{ textAlign: "center" }}
                                    className={classes.menuGrid}
                                >
                                    <Link
                                        to={menuItem.link}
                                        onClick={menuItem.link !== "#" ? () => setOpen(false) : undefined}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <MenuButton content={menuItem} />
                                    </Link>
                                </Grid>
                            );
                        })
                    }
                </Grid>
            </Dialog>
        </>
    );
}
