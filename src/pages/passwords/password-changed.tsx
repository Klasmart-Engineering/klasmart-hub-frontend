import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router";
import StyledButton from "../../components/styled/button";
import BadanamuLogo from "../../assets/img/badanamu_logo.png";
import KidsloopLogo from "../../assets/img/kidsloop.svg";
import { Passwords } from "./passwords";

const useStyles = makeStyles((theme) => createStyles({
    card: {
        display: "flex",
        alignItems: "center",
        padding: "48px 40px !important",
    },
}),
);

export function PasswordChanged() {
    const history = useHistory();
    const classes = useStyles();

    return (
        <Passwords>
            <Grid container justify="center" spacing={4}>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                    <img alt="KidsLoop Logo" src={KidsloopLogo} height="50px" />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5" align="center">
                        <FormattedMessage id="password_changedPrompt" />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <StyledButton
                        fullWidth
                        size="large"
                        onClick={(e) => {
                            history.push("/my-account");
                        }}
                    >
                        <FormattedMessage id="password_changedConfirm" />
                    </StyledButton>
                </Grid>
            </Grid>
        </Passwords>
    );
}
