import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import * as QueryString from "query-string";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl";
import { useStore } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { redirectIfUnverifiable } from "../../components/authorized";
import { useRestAPI } from "../../api/restapi";
import { RestAPIError } from "../../api/restapi_errors";
import { ActionTypes } from "../../store/actions";
import { IdentityType } from "../../utils/accountType";
import StyledTextField from "../../components/styled/textfield";
import KidsloopLogo from "../../assets/img/kidsloop.svg";
import { Verify } from "./verify";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => createStyles(
    {
        link: {
            textAlign: "right",
            [theme.breakpoints.down("sm")]: {
                paddingTop: theme.spacing(2),
                textAlign: "left",
            },
        },
        iconButton: {
            padding: 10,
        },
    }
));

interface Props { type: IdentityType; }

export function VerifyAccount(props: Props & RouteComponentProps) {
    const store = useStore();
    const classes = useStyles();
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState<JSX.Element | null>(null);
    const [verifyInFlight, setVerifyInFlight] = useState(false);
    const restApi = useRestAPI();
    const history = useHistory();

    const params = QueryString.parse(props.location.search);
    if (typeof params.accountId === "string") {
        store.dispatch({ type: ActionTypes.ACCOUNT_ID, payload: { accountId: params.accountId } });
    }

    redirectIfUnverifiable();

    async function verify(code = verificationCode) {
        if (code === "") { return; }
        if (verifyInFlight) { return; }
        try {
            setVerifyInFlight(true);
            await restApi.verify(code, props.type);
            history.replace("/login");
        } catch (e) {
            if (e instanceof RestAPIError) {
                const id = e.getErrorMessageID();
                setError(<FormattedMessage id={id} />);
            }
        } finally {
            setVerifyInFlight(false);
        }
    }

    useEffect(() => {
        if (typeof params.code === "string") {
            setVerificationCode(params.code);
            verify(params.code);
        }
    }, []);

    let stopVerifyCheckLoop = false;
    async function verifyCheckLoop() {
        try {
            const verified = await restApi.verifyCheck(props.type);
            if (verified) { history.replace("/login"); }
        } catch (e) { } finally {
            if (!stopVerifyCheckLoop) {
                setTimeout(() => verifyCheckLoop(), 1000);
            }
        }
    }
    useEffect(() => {
        if (props.type === IdentityType.Email) {
            verifyCheckLoop();
        }
        return () => { stopVerifyCheckLoop = true; };
    });

    const type = IdentityType[props.type].toLowerCase();

    return (
        <Verify inFlight={verifyInFlight}>
            <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                <Grid item xs={12}>
                    <img alt="KidsLoop Logo" src={KidsloopLogo} height="50px" />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        <FormattedMessage id={`verify_${type}Prompt`} />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        <FormattedMessage id={`verify_${type}Directions`} />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <StyledTextField
                        required
                        fullWidth
                        id="verify_code"
                        label={<FormattedMessage id={`verify_${type}Code`} />}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        inputProps={{ style: { verticalAlign: "center", fontFamily: "monospace" } }}
                        InputProps={{
                            endAdornment:
                                <Tooltip placement="bottom" title="Submit">
                                    <IconButton
                                        className={classes.iconButton}
                                        disabled={verifyInFlight}
                                        onClick={() => verify()}
                                        aria-label="submit"
                                    >
                                        {verifyInFlight ? <CircularProgress size={25} /> : <ExitToAppRoundedIcon />}
                                    </IconButton>
                                </Tooltip>,
                        }}
                    />
                </Grid>
                {
                    error === null ? null :
                        <Typography color="error">
                            {error}
                        </Typography>
                }
            </Grid>
        </Verify>
    );
}
