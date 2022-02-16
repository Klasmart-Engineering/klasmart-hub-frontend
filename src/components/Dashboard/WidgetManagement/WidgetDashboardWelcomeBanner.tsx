import StudentNextClass from "../Widgets/Student/NextClass/NextClass";
import LastUpdatedMessage from "./LastUpdatedMessage";
import WidgetContext from "./widgetCustomisation/widgetContext";
import WidgetDashboardWelcomeMessage from "./WidgetDashboardWelcomeMessage";
import {
    alpha,
    Box,
    Container,
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import React,
{ useContext } from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
        transition: `.5s background-color`,
    },
    rootEditing: {
        backgroundColor: alpha(theme.palette.common.white, 0),
    },
    customizeTitle: {
        color: theme.palette.common.white,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer - 1,
        color: theme.palette.common.white,
    },
    flexAndSpacing: {
        display: `flex`,
        '& > *': {
            marginRight: theme.spacing(3),
        },
    },
    whiteButton: {
        color: theme.palette.common.white,
        borderColor: theme.palette.common.white,
    },
    welcomeTitle: {
        marginBottom: theme.spacing(1),
    },
    lastUpdatedText:{
        fontWeight: `bold`,
        color: theme.palette.grey[500],
        "& span":{
            fontWeight: `normal`,
        },
    },
}));

interface Props {}

export default function WidgetDashboardWelcomeBanner (props: Props) {
    const classes = useStyles();
    const {
        editing,
        layouts,
        widgets,
        saveWidgets,
        resetWidgets,
        cancelEditing,
        editWidgets,
    } = useContext(WidgetContext);

    return (
        <Box
            className={clsx(classes.root, {
                [classes.rootEditing] : editing,
            })}
            paddingY={5}
        >
            <Container
                maxWidth="xl">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center">
                    { !editing ?
                        <Box>
                            <Typography
                                variant="h4"
                                className={classes.welcomeTitle}
                            >
                                <WidgetDashboardWelcomeMessage />
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                className={classes.lastUpdatedText}
                            >
                                <LastUpdatedMessage/>
                            </Typography>
                        </Box>
                        :
                        <Box className={classes.flexAndSpacing}>

                            {/* <Typography
                                variant="h4"
                                className={classes.customizeTitle}
                            >
                              Customize
                            </Typography>
                            <PillButton
                                variant="contained"
                                color="primary"
                                aria-label="customize widgets"
                                startIcon={
                                    <LibraryAddIcon
                                        size="1rem"
                                        color="white" />
                                }
                                onClick={() => { cancelEditing(); }}
                            >
                                Add Widget
                            </PillButton> */}
                        </Box>
                    }
                    {/* <Box>
                        { !editing ?
                            <PillButton
                                variant="contained"
                                color="primary"
                                aria-label="customize widgets"
                                startIcon={
                                    <EditIcon
                                        size="1rem"
                                        color="white" />
                                }
                                onClick={() => { editWidgets(); }}
                            >
                                Customize
                            </PillButton>
                            :
                            <Box className={classes.flexAndSpacing}>
                                <Box paddingRight={3}>
                                    <Button
                                        className={classes.whiteButton}
                                        startIcon={
                                            <RefreshIcon
                                                size="1rem"
                                                color="white" />
                                        }
                                        onClick={() => { resetWidgets(); }}
                                    >Reset to default</Button>
                                </Box>
                                <Button
                                    className={classes.whiteButton}
                                    variant="outlined"
                                    onClick={() => { cancelEditing(); }}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { saveWidgets(widgets, layouts); }}>Save</Button>
                            </Box>
                        }
                    </Box> */}
                </Box>
                {
                    //todo: include this in student-focused dashboard
                    // <Box paddingY={2}>
                    //     <StudentNextClass />
                    // </Box>
                }
            </Container>
        </Box>

    );
}
