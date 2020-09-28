import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as QueryString from "query-string";
import * as React from "react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useStore } from "react-redux";
import { useHistory } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { redirectIfUnverifiable } from "../../components/authorized";
import StyledButton from "../../components/styled/button";
import { useRestAPI } from "../../api/restapi";
import { RestAPIError } from "../../api/restapi_errors";
import { ActionTypes } from "../../store/actions";
import { IdentityType } from "../../utils/accountType";
import { Verify } from "./verify";
import KidsloopLogo from "../../assets/img/kidsloop.svg";

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

export function VerifyLink(props: RouteComponentProps) {
    const store = useStore();
    const classes = useStyles();
    const history = useHistory();
    const params = QueryString.parse(props.location.search);
    if (typeof params.accountId === "string") {
        store.dispatch({ type: ActionTypes.ACCOUNT_ID, payload: { accountId: params.accountId } });
    }

    const [error, setError] = React.useState<JSX.Element | null>(null);
    const [verifyInFlight, setVerifyInFlight] = React.useState(false);
    const restApi = useRestAPI();

    async function verify(code: string) {
        if (code === "") { return; }
        if (verifyInFlight) { return; }
        try {
            setVerifyInFlight(true);
            await restApi.verify(code, IdentityType.Email);
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
            verify(params.code);
        }
    }, []);

    redirectIfUnverifiable();

    return (
        <Verify inFlight={verifyInFlight}>
            <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                <Grid item xs={12}>
                    <img alt="KidsLoop Logo" src={KidsloopLogo} height="50px" />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        <FormattedMessage id={"verify_emailPrompt"} />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {
                        verifyInFlight ?
                            <CircularProgress size={25} /> : (
                                error !== null ?
                                    <Typography color="error">
                                        {error}
                                    </Typography>
                                    :
                                    < FormattedMessage id="verify_emailSuccess" />
                            )
                    }
                </Grid>
                <Grid item xs={6} />
                <Grid item xs={6} className={classes.link}>
                    <StyledButton
                        fullWidth
                        size="large"
                        onClick={(e) => {
                            history.push("/login");
                        }}
                    >
                        <FormattedMessage id="login_button" />
                    </StyledButton>
                </Grid>
            </Grid>
        </Verify>
    );
}
