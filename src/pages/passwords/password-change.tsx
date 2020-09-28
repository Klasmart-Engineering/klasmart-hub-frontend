import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import BadanamuLogo from "../../assets/img/badanamu_logo.png";
import { useRestAPI } from "../../api/restapi";
import { RestAPIError } from "../../api/restapi_errors";
import StyledTextField from "../../components/styled/textfield";
import StyledButton from "../../components/styled/button";
import KidsloopLogo from "../../assets/img/kidsloop.svg";
import { Passwords } from "./passwords";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme: Theme) => createStyles(
    {
        link: {
            textAlign: "right",
            [theme.breakpoints.down("sm")]: {
                paddingTop: theme.spacing(2),
                textAlign: "left",
            },
        }
    }
));

export function PasswordChange() {
    const [inFlight, setInFlight] = useState(false);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const classes = useStyles();
    const history = useHistory();
    const restApi = useRestAPI();

    function checkPasswordMatch() {
        if (newPassword === "") { return; }
        if (newPasswordConfirmation === "") { return; }
        const match = (newPassword !== newPasswordConfirmation);
        setPasswordMatchError(match);
    }

    async function changepassword(e: React.FormEvent) {
        e.preventDefault();
        if (inFlight) { return; }
        if (newPassword === "") { return; }
        if (currentPassword === "") { return; }
        if (newPassword !== newPasswordConfirmation) { return; }
        try {
            setInFlight(true);
            const result = await restApi.changePassword(currentPassword, newPassword);
            if (result.status === 200) { history.push("/password-changed"); }
        } catch (e) {
            handleError(e);
        } finally {
            setInFlight(false);
        }
    }

    function handleError(e: RestAPIError | Error) {
        if (!(e instanceof RestAPIError)) {
            console.error(e);
            return;
        }
        const id = e.getErrorMessageID();
        const errorMessage = <FormattedMessage id={id} />;
        switch (e.getErrorMessageType()) {
        default:
            setGeneralError(errorMessage);
            break;
        }
    }

    return (
        <Passwords>
            <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                <Grid item xs={12}>
                    <img alt="KidsLoop Logo" src={KidsloopLogo} height="50px" />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        <FormattedMessage
                            id="password_changePrompt"
                            values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                        />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <StyledTextField
                        required
                        fullWidth
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        label={<FormattedMessage id="form_currentPasswordLabel" />}
                    />
                    <StyledTextField
                        required
                        fullWidth
                        type="password"
                        error={passwordMatchError}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onBlur={() => checkPasswordMatch()}
                        label={<FormattedMessage id="form_newPasswordLabel" />}
                    />
                    <StyledTextField
                        required
                        fullWidth
                        type="password"
                        error={passwordMatchError}
                        value={newPasswordConfirmation}
                        onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                        onBlur={() => checkPasswordMatch()}
                        label={<FormattedMessage id="form_newPasswordConfirmLabel" />}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Link
                        href="#"
                        variant="subtitle2"
                        onClick={(e: React.MouseEvent) => { history.goBack(); e.preventDefault(); }}
                    >
                        <FormattedMessage id="password_forgotBack" />
                    </Link>
                </Grid>
                <Grid item xs={6} className={classes.link}>
                    <StyledButton
                        type="submit"
                        size="medium"
                        fullWidth
                        disabled={inFlight}
                        onClick={(e) => changepassword(e)}
                    >
                        {
                            inFlight ?
                                <CircularProgress size={25} /> :
                                <FormattedMessage id="password_confirmChange" />
                        }
                    </StyledButton>
                </Grid>
                {
                    generalError === null ? null :
                        <Typography color="error">
                            {generalError}
                        </Typography>
                }
            </Grid>
        </Passwords>
    );
}
