import StudentNextClass from "../Widgets/Student/NextClass/NextClass";
import { WidgetView } from "./defaultWidgets";
import LastUpdatedMessage from "./LastUpdatedMessage";
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
import React from "react";

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

interface Props {
    view: WidgetView;
}

export default function WidgetDashboardWelcomeBanner (props: Props) {
    const { view } = props;
    const classes = useStyles();

    return (
        <Box
            className={clsx(classes.root)}
            paddingY={5}
        >
            <Container
                maxWidth="xl">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center">
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
                            {(() => {
                                if (view !== WidgetView.STUDENT) return (<LastUpdatedMessage/>);
                                return (<LastUpdatedMessage mockDate={true}/>);
                            })()}
                        </Typography>
                    </Box>

                </Box>
                {
                    view === WidgetView.STUDENT &&
                    <Box paddingY={2}>
                        <StudentNextClass />
                    </Box>
                }
            </Container>
        </Box>

    );
}
