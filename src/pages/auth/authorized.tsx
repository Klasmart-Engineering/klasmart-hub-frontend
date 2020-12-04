import React, { useEffect, useState, useContext, useRef } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Lightswitch from "../../components/lightswitch";
import LanguageSelect from "../../components/languageSelect";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import LinearProgress from "@material-ui/core/LinearProgress";
import KidsloopLogo from "../../assets/img/kidsloop.svg";
import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from "react-intl";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
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
    }
));

export function Authorized() {
    const classes = useStyles();
    const [success, setSuccess] = useState(false);
    const [inFlight, setInFlight] = useState(false);

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
                                            id={`auth_${success ? "success" : "failed"}Prompt`}
                                            values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                                        />
                                    }
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <Typography variant="body2" gutterBottom>
                                    { success ? 
                                        "Redirecting you back to your destination!" :
                                        "Redirecting you back to login!"
                                    }
                                </Typography>
                                <Typography variant="body2">
                                    If you are not automatically redirected, click "Continue".
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
                                            <FormattedMessage id="button_continue" />
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