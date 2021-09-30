import PrimaryLogo from "@branding/assets/img/primary_logo.svg";
import {
    Box,
    createStyles,
    Fade,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    kidsloopLogo: {
        width: `250px`,
    },
}));

interface Props {
}

export default function SiteLoading (props: Props) {
    const classes = useStyles();

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <Fade
                in
                timeout={1000}
                style={{
                    transitionDelay: `300ms`,
                }}
            >
                <img
                    src={PrimaryLogo}
                    className={classes.kidsloopLogo}
                />
            </Fade>
        </Box>
    );
}
