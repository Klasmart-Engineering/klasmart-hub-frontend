import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import KidsloopLogo from "../../assets/img/kidsloop.svg";
import LanguageSelect from "../../components/languageSelect";
import Lightswitch from "../../components/lightswitch";
import StyledFAB from "../../components/styled/fabButton";

const useStyles = makeStyles((theme) => createStyles(
    {
        card: {
            display: "flex",
            alignItems: "center",
            padding: "48px 40px !important",
        },
        pageWrapper: {
            display: "flex",
            flexGrow: 1,
        },
    },
));

export function Invited() {
    const classes = useStyles();
    const [success, setSuccess] = useState(false);
    const [inFlight, setInFlight] = useState(false);
    const organization = "Calm Island"; // TODO: remove placeholder

    return (
        <Grid
            container
            direction="column"
            justify="space-around"
            alignItems="center"
            className={ classes.pageWrapper }
        >
            <Container maxWidth="xs">
                <Card>
                    <CardContent className={classes.card}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <img alt="KidsLoop Logo" src={KidsloopLogo} height="50px" />
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <Typography variant="h3">
                                    { success ?
                                        <CheckCircleIcon fontSize="inherit" color="primary" /> :
                                        <CancelIcon fontSize="inherit" color="secondary" />
                                    }
                                </Typography>
                                <Typography variant="h5">
                                    { inFlight ?
                                        <CircularProgress /> :
                                        <FormattedMessage
                                            id={`invited_${success ? "success" : "failed"}Prompt`}
                                            values={{ organization }}
                                        />
                                    }
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <Typography variant="body2" gutterBottom>
                                    { success ?
                                        "Redirecting you back to login!" :
                                        "Please contact the organization that invited you to receive a new invitation."
                                    }
                                </Typography>
                                <Typography variant="body2">
                                    Or, continue your sign-up process and get your invite at a later time.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <StyledFAB
                                    disabled={inFlight}
                                    size="medium"
                                >
                                    {
                                        inFlight ?
                                            <CircularProgress size={25} /> :
                                            <FormattedMessage id="button_continueSignUp" />
                                    }
                                </StyledFAB>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Grid>
    );
}
