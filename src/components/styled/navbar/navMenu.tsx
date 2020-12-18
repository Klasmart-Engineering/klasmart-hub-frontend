import { Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";
import Typography from "@material-ui/core/Typography";
import AppsIcon from "@material-ui/icons/Apps";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import DialogAppBar from "../../../components/styled/dialogAppBar";
import { MenuItem } from "../../../types/objectTypes";

import { AllInbox as InboxIcon } from "@styled-icons/material-twotone/AllInbox";
import { Business as BusinessIcon } from "@styled-icons/material-twotone/Business";
import { CalendarToday as CalendarIcon } from "@styled-icons/material-twotone/CalendarToday";
import { ContactSupport as SupportIcon } from "@styled-icons/material-twotone/ContactSupport";
import { CreditCard as CardIcon } from "@styled-icons/material-twotone/CreditCard";
import { Group as GroupIcon } from "@styled-icons/material-twotone/Group";
import { Lock as LockIcon } from "@styled-icons/material-twotone/Lock";
import { PersonOutline as PersonIcon } from "@styled-icons/material-twotone/PersonOutline";
import { Phonelink as PhoneIcon } from "@styled-icons/material-twotone/Phonelink";
import { School as SchoolIcon } from "@styled-icons/material-twotone/School";
import { Security as SecurityIcon } from "@styled-icons/material-twotone/Security";
import { StackedLineChart as AssessmentIcon } from "@styled-icons/material-twotone/StackedLineChart";
import { TableChart as TableIcon } from "@styled-icons/material-twotone/TableChart";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuContainer: {
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 2),
            },
        },
        menuButton: {
            minHeight: 64,
            padding: theme.spacing(2),
        },
        menuLink: {
            textDecoration: "none",
            textAlign: "center",
            display: "block",
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
            <Button
                fullWidth
                className={classes.menuButton}
                onClick={handleClick}
            >
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
                        <Typography
                            variant="caption"
                            style={{ color: "rgba(0, 0, 0, 0.6)" }}
                        >
                            {props.content.description}
                        </Typography>
                    </Grid>
                </Grid>
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity="info"
                >
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

interface Props {
    className: string;
}

export default function NavMenu(props: Props) {
    const {
        className,
    } = props;
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const MENU_ITEMS: MenuItem[] = [
        {
            id: "navMenu_analyticsAndReports",
            description: <FormattedMessage id="navMenu_analyticsAndReportsDescription" />,
            link: "/report",
            logo: <TableIcon size="48px" style={{ color: "#f7a219", fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_analyticsAndReportsTitle" />,
        },
        {
            id: "navMenu_assessments",
            description: <FormattedMessage id="navMenu_assessmentsDescription" />,
            link: "/assessments/assessment-list",
            logo: <AssessmentIcon size="48px" style={{ color: "#98CE00", fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_assessmentsTitle" />,
        },
        {
            id: "navMenu_contentLibrary",
            description: <FormattedMessage id="navMenu_contentLibraryDescription" />,
            link: "/library",
            logo: <InboxIcon size="48px" style={{ color: "#1f94e8", fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_contentLibraryTitle" />,
        },
        {
            id: "navMenu_groups",
            description: <FormattedMessage id="navMenu_groupsDescription" />,
            link: "/admin/roles",
            logo: <GroupIcon size="48px"style={{ color: "#27bed6", fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_groupsTitle" />,
        },
        {
            id: "navMenu_organization",
            description: <FormattedMessage id="navMenu_organizationDescription" />,
            link: "/admin/allOrganization",
            logo: <BusinessIcon size="48px" style={{ color: "#0E78D5", fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_organizationTitle" />,
        },
        {
            id: "navMenu_schedule",
            description: <FormattedMessage id="navMenu_scheduleDescription" />,
            link: "/schedule",
            logo: <CalendarIcon size="48px" style={{ color: "#09BC8A", fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_scheduleTitle" />,
        },
        {
            id: "navMenu_schools",
            description: <FormattedMessage id="navMenu_schoolsDescription" />,
            link: "/admin/school",
            logo: <SchoolIcon size="48px" style={{ color: "#0E78D5", fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_schoolsTitle" />,
        },
        {
            id: "navMenu_users",
            description: <FormattedMessage id="navMenu_usersDescription" />,
            link: "/admin/user",
            logo: <PersonIcon size="48px" style={{ color: "#0E78D5", fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_usersTitle" />,
        },
        {
            id: "navMenu_billing",
            description: <FormattedMessage id="navMenu_billingDescription" />,
            link: "#",
            logo: <CardIcon size="48px" style={{ color: "gray" /* "#b0bec5" */, fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_billingTitle" />,
        },
        {
            id: "navMenu_dataSecurity",
            description: <FormattedMessage id="navMenu_dataSecurityDescription" />,
            link: "#",
            logo: <LockIcon size="48px" style={{ color: "gray" /* "#816961" */, fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_dataSecurityTitle" />,
        },
        {
            id: "navMenu_devices",
            description: <FormattedMessage id="navMenu_devicesDescription" />,
            link: "#",
            logo: <PhoneIcon size="48px" style={{ color: "gray" /* theme.palette.type === "dark" ? "#fefefe" : "#263248" */, fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_devicesTitle" />,
        },
        {
            id: "navMenu_security",
            description: <FormattedMessage id="navMenu_securityDescription" />,
            link: "#",
            logo: <SecurityIcon size="48px" style={{ color: "gray" /* "#8396a0" */, fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_securityTitle" />,
        },
        {
            id: "navMenu_support",
            description: <FormattedMessage id="navMenu_supportDescription" />,
            link: "#",
            logo: <SupportIcon size="48px" style={{ color: "gray" /* "#3baf77" */, fontSize: 48 }} />,
            title: <FormattedMessage id="navMenu_supportTitle" />,
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
            <Box
                display="flex"
                flex="0"
                alignItems="center"
                alignContent="center"
            >
                <IconButton
                    edge="start"
                    onClick={handleClickOpen}
                    color="inherit"
                    aria-label="menu"
                    className={className}
                >
                    <AppsIcon />
                </IconButton>
            </Box>
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
                    justify="flex-start"
                    alignItems="stretch"
                    spacing={2}
                    className={classes.menuContainer}
                >
                    {MENU_ITEMS.map((menuItem) =>
                        <Grid
                            key={`menuItem-${menuItem.id}`}
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            lg={2}
                        >
                            <Link
                                to={menuItem.link}
                                onClick={menuItem.link !== "#" ? () => setOpen(false) : undefined}
                                className={classes.menuLink}
                            >
                                <MenuButton content={menuItem} />
                            </Link>
                        </Grid>,
                    )}
                </Grid>
            </Dialog>
        </>
    );
}
