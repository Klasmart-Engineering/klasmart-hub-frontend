import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { useHistory } from "react-router";
import { redirectIfAuthorized } from "../../components/authorized";
import { useRestAPI } from "../../api/restapi";
import { RestAPIError, RestAPIErrorType } from "../../api/restapi_errors";
import { ActionTypes } from "../../store/actions";
import { State } from "../../store/store";
import KidsloopLogo from "../../assets/img/kidsloop.svg";
import StyledTextField from "../../components/styled/textfield";
import StyledButton from "../../components/styled/button";
import { AccountsLayout } from "./accounts";
import { isLoggedIn } from "../../components/authorized";


// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme) => createStyles(
    {
        link: {
            textAlign: "right",
            [theme.breakpoints.down("sm")]: {
                paddingTop: theme.spacing(2),
                textAlign: "left",
            },
        },
    }
));
// tslint:enable:object-literal-sort-keys

export function Login() {
    const [inFlight, setInFlight] = useState(false);

    const defaultEmail = useSelector((state: State) => state.account.email || "");
    const passes = useSelector((state: State) => state.account.passes || []);
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState("");

    const [passwordError, setPasswordError] = useState<JSX.Element | null>(null);
    const [emailError, setEmailError] = useState<JSX.Element | null>(null);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const classes = useStyles();
    const store = useStore();
    const history = useHistory();
    const restApi = useRestAPI();

    redirectIfAuthorized();

    async function login(e: React.FormEvent) {
        e.preventDefault();
        if (inFlight) { return; }
        if (email === "") { return; }
        if (password === "") { return; }
        try {
            setInFlight(true);
            await restApi.login(email, password);
            const { passes: newPasses } = await restApi.getPassAccesses();
            store.dispatch({ type: ActionTypes.PASSES, payload: newPasses });
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
            case RestAPIErrorType.INVALID_LOGIN:
                setEmailError(errorMessage);
                break;
            case RestAPIErrorType.INVALID_PASSWORD:
                setPasswordError(errorMessage);
                break;
            case RestAPIErrorType.EMAIL_NOT_VERIFIED:
                history.push("/verify-email");
                break;
            case RestAPIErrorType.PHONE_NUMBER_NOT_VERIFIED:
                history.push("/verify-phone");
                break;
            case RestAPIErrorType.ACCOUNT_BANNED:
            default:
                setGeneralError(errorMessage);
                break;
        }
    }

    return (
        <AccountsLayout inFlight={inFlight}>
            <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                <Grid item xs={12}>
                    <img alt="KidsLoop Logo" src={KidsloopLogo} height="50px" />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        <FormattedMessage
                            id={"login_loginPrompt"}
                            values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                        />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <StyledTextField
                        autoComplete="email"
                        error={emailError !== null}
                        fullWidth
                        helperText={emailError}
                        id="email-input"
                        label={<FormattedMessage id="form_emailLabel" />}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <StyledTextField
                        autoComplete="current-password"
                        error={passwordError !== null}
                        fullWidth
                        helperText={passwordError}
                        id="password-input"
                        label={<FormattedMessage id="form_passwordLabel" />}
                        onChange={(e) => setPassword(e.target.value)}
                        showForgotPassword
                        type="password"
                        value={password}
                    />
                </Grid>
                <Grid item xs={6}>
                    {/* <Link
                        href="#"
                        variant="subtitle2"
                        onClick={(e: React.MouseEvent) => { history.push("/signup"); e.preventDefault(); }}
                    >
                        <FormattedMessage id="login_createAccount" />
                    </Link> */}
                </Grid>
                <Grid item xs={6} className={classes.link}>
                    <StyledButton
                        disabled={inFlight}
                        onClick={(e) => login(e)}
                        size="medium"
                        type="submit"
                    >
                        {
                            inFlight ?
                                <CircularProgress size={25} /> :
                                <FormattedMessage id="login_loginButton" />
                        }
                    </StyledButton>
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
