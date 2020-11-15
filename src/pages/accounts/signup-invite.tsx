import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import { AccountsLayout } from "./accounts";
import { useRestAPI } from "../../api/restapi";
import { RestAPIError, RestAPIErrorType } from "../../api/restapi_errors";
import { redirectIfAuthorized } from "../../components/authorized";
import StyledTextField from "../../components/styled/textfield";
import StyledButton from "../../components/styled/button";
import { getIdentityType, IdentityType } from "../../utils/accountType";

import KidsloopLogo from "../../assets/img/kidsloop.svg";

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) => createStyles(
    {
        link: {
            textAlign: "right",
            justifyContent: "flex-end",
            [theme.breakpoints.down("sm")]: {
                justifyContent: "flex-start",
                paddingTop: theme.spacing(2),
                textAlign: "left",
            },
        },
    }
));
// tslint:enable:object-literal-sort-keys

// TODO: Lookup standard
const phoneRegex = /^(\+[1-9][0-9]*)?[0-9\- ]*$/;
export function SignupInvite() {
    const organization = "Calm Island";
    const name = "John Doe";

    const [inFlight, setInFlight] = useState(false);

    const [email, setEmail] = useState("john.doe@calmid.com");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [passwordError, setPasswordError] = useState<JSX.Element | null>(null);
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [emailError, setEmailError] = useState<JSX.Element | null>(null);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const classes = useStyles();
    const history = useHistory();
    const restApi = useRestAPI();

    redirectIfAuthorized();

    function checkPasswordMatch() {
        if (password === "") { return; }
        if (passwordConfirmation === "") { return; }
        setPasswordMatchError(password !== passwordConfirmation);
    }

    async function signup(e: React.FormEvent) {
        e.preventDefault();
        setEmailError(null);
        if (inFlight) { return; }
        if (email === "") { setEmailError(<FormattedMessage id="create_account_empty_email" />); return; }
        if (email.indexOf("@") === -1 && !phoneRegex.test(email)) {
            setEmailError(<FormattedMessage id="create_account_invalid_email" />);
            return;
        }
        if (password === "") { setEmailError(<FormattedMessage id="create_account_empty_pass" />); return; }
        if (password !== passwordConfirmation) { setEmailError(<FormattedMessage id="create_account_pass_not_matched" />); return; }

        const accountType = getIdentityType(email);
        if (accountType === undefined) { return; }
        try {
            setInFlight(true);
            // TODO: Get Locale
            await restApi.signup(email, password, "en");
            switch (accountType) {
                case IdentityType.Email:
                    history.push("/verify-email");
                    break;
                case IdentityType.Phone:
                    history.push("/verify-phone");
                    break;
                default:
                    throw new Error("Unknown Account Type");
            }
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
            case RestAPIErrorType.EMAIL_ALREADY_USED:
            case RestAPIErrorType.INVALID_EMAIL_FORMAT:
            case RestAPIErrorType.INVALID_EMAIL_HOST:
                setEmailError(errorMessage);
                break;
            case RestAPIErrorType.PASSWORD_LOWERCASE_MISSING:
            case RestAPIErrorType.PASSWORD_NUMBER_MISSING:
            case RestAPIErrorType.PASSWORD_TOO_LONG:
            case RestAPIErrorType.PASSWORD_TOO_SHORT:
            case RestAPIErrorType.PASSWORD_UPPERCASE_MISSING:
                setPasswordError(errorMessage);
                break;
            default:
                setGeneralError(errorMessage);
                break;
        }
    }

    return (
        <AccountsLayout inFlight={inFlight}>
            <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                    <img alt="KidsLoop Logo" src={KidsloopLogo} height="50px" />
                </Grid>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                    <Typography variant="h5">
                        <FormattedMessage
                            id="signupInvite_signupPrompt"
                            values={{ organization, name }}
                        />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <StyledTextField
                        disabled
                        required
                        fullWidth
                        autoComplete="email"
                        label={<FormattedMessage id="form_emailLabel" />}
                        value={email}
                        error={emailError !== null}
                        helperText={emailError}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <StyledTextField
                        required
                        fullWidth
                        type="password"
                        label={<FormattedMessage id="form_passwordLabel" />}
                        value={password}
                        error={passwordError !== null || passwordMatchError}
                        helperText={passwordError}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Grid>
                <Grid container item xs={6}>
                    <Link
                        href="#"
                        variant="subtitle2"
                        onClick={(e: React.MouseEvent) => { history.push("/login"); e.preventDefault(); }}
                    >
                        <FormattedMessage id="signup_signedUpAlready" />
                    </Link>
                </Grid>
                <Grid item xs={6} className={classes.link}>
                    <StyledButton
                        disabled={inFlight}
                        onClick={(e) => signup(e)}
                        size="medium"
                        type="submit"
                    >
                        {
                            inFlight ?
                                <CircularProgress size={25} /> :
                                <FormattedMessage id="signup_signupButton" />
                        }
                    </StyledButton>
                </Grid>
                <Grid container item xs={12} style={{ textAlign: "center" }}>
                    <span style={{ textAlign: "center" }}>
                        <FormattedMessage id="signupInvite_mistake" />
                        <Link
                            href="#"
                            variant="subtitle2"
                            onClick={() => { }}
                        >
                            <FormattedMessage id="signupInvite_click" />
                        </Link>
                    </span>
                </Grid>
                <Grid item>
                    {
                        generalError === null ? null :
                            <Typography color="error">
                                {generalError}
                            </Typography>
                    }
                </Grid>
            </Grid>
        </AccountsLayout>
    );
}