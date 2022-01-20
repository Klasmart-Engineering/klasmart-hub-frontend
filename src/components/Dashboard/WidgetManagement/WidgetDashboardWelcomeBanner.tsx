import LastUpdatedMessage from "./LastUpdatedMessage";
import WidgetDashboardWelcomeMessage from "./WidgetDashboardWelcomeMessage";
import {
    alpha,
    Box,
    Container,
    createStyles,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    backdrop: {
        zIndex: theme.zIndex.drawer - 1,
        color: theme.palette.common.white,
    },
    pageHeader: {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    welcomeTitle: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(4),
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

    return (
        <Box
            className={classes.pageHeader}
            paddingY={2} >
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
                            <LastUpdatedMessage/>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>

    );
}
