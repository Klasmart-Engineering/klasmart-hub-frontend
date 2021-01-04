import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as QueryString from "query-string";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { useHistory } from "react-router";
import StyledButton from "../../components/styled/button";
import StyledTextField from "../../components/styled/textfield";
import BadanamuLogo from "../../assets/img/badanamu_logo.png";
import { useRestAPI } from "../../api/restapi";
import { RestAPIError } from "../../api/restapi_errors";
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

export function PasswordRestore(props: RouteComponentProps) {
    const [inFlight, setInFlight] = useState(false);
    const params = QueryString.parse(props.location.search);

    const defaultEmail = params.email || useSelector((state: State) => state.account.email || "");
    const [email, setEmail] = useState(defaultEmail);
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [resetCode, setResetCode] = useState(typeof params.code === "string" ? params.code : "");

    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const history = useHistory();
    const classes = useStyles();
    const restApi = useRestAPI();

    function checkPasswordMatch() {
        if (newPassword === "") { return; }
        if (newPasswordConfirmation === "") { return; }
        const match = (newPassword !== newPasswordConfirmation);
        setPasswordMatchError(match);
    }

    async function restorePassword(e: React.FormEvent) {
        if (inFlight) { return; }
        if (newPassword !== newPasswordConfirmation) { return; }
        e.preventDefault();
        const lang = "en"; // TODO: use locale
        try {
            setInFlight(true);
            const result = await restApi.restorePassword(email, newPassword, resetCode);
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
                            id="password_restorePrompt"
                            values={{ b: (...chunks: any[]) => <strong>{chunks}</strong> }}
                        />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <StyledTextField
                        required
                        fullWidth
                        autoComplete="email"
                        label={<FormattedMessage id="form_emailLabel" />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <StyledTextField
                        required
                        fullWidth
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        label={<FormattedMessage id="form_newPasswordCodeLabel" />}
                    />
                </Grid>
                <Grid item xs={6} />
                <Grid item xs={6} className={classes.link}>
                    <StyledButton
                        type="submit"
                        fullWidth
                        size="medium"
                        disabled={inFlight}
                        onClick={(e) => restorePassword(e)}
                    >
                    
                        {
                            inFlight ?
                                <CircularProgress size={25} /> :
                                <FormattedMessage id="password_confirmRestore" />
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
