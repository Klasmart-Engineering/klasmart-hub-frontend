import WidgetDashboardWelcomeMessage from "./WidgetDashboardWelcomeMessage";
import {
    alpha,
    Box,
    Container,
    Theme,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    backdrop: {
        zIndex: theme.zIndex.drawer - 1,
        color: theme.palette.common.white,
    },
    pageHeader: {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
}));

interface Props {
}

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
                    <WidgetDashboardWelcomeMessage />
                </Box>
            </Container>
        </Box>

    );
}
