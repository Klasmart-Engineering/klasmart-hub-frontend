import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";
import { useHistory } from "react-router";
import StyledButton from "../../components/styled/button";
import StyledTextField from "../../components/styled/textfield";
import BadanamuLogo from "../../assets/img/badanamu_logo.png";
import { useRestAPI } from "../../api/restapi";
import { RestAPIError } from "../../api/restapi_errors";
import { ActionTypes } from "../../store/actions";
import { State } from "../../store/store";
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

export function PasswordForgot() {
    const store = useStore();
    const [inFlight, setInFlight] = useState(false);

    const defaultEmail = useSelector((state: State) => state.account.email || "");
    const [email, setEmail] = useState(defaultEmail);

    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const classes = useStyles();
    const restApi = useRestAPI();
    const history = useHistory();
    async function forgotPassword(e: React.FormEvent) {
        e.preventDefault();
        const lang = "en"; // TODO: use locale
        try {
            setInFlight(true);
            const response = await restApi.forgotPassword(email, lang);
            if (response.status === 200) {
                store.dispatch({ type: ActionTypes.EMAIL, payload: email });
                history.push("/password-restore");
            }
        } catch (e) {
            if (!(e instanceof RestAPIError)) {
                console.error(e);
                return;
            }
            setGeneralError(<FormattedMessage id={e.getErrorMessageID()} />);
        } finally {
            setInFlight(false);
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
                            id="password_forgotPrompt"
                            values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                        />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <StyledTextField
                        required
                        fullWidth
                        autoComplete="email"
                        label={<FormattedMessage id="form_passwordForgotEmailLabel" />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        disabled={inFlight}
                        onClick={(e) => forgotPassword(e)}
                    >
                        {
                            inFlight ?
                                <CircularProgress size={25} /> :
                                <FormattedMessage id="password_forgotRecover" />
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
        </Passwords>
    );
}
