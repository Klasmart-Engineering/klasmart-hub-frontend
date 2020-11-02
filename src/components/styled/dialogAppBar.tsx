import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import HomeIcon from "@material-ui/icons/Home";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import KidsloopLogo from "../../assets/img/kidsloop_icon.svg";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: "relative",
        },
        title: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(1),
        },
    }));

interface Props {
    handleClose: () => void;
    subtitleID: string;
    toolbarBtn?: React.ReactNode;
}

export default function DialogAppBar(props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const { handleClose, subtitleID, toolbarBtn } = props;

    return (
        <>
            <AppBar color="inherit" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    { window.location.hash !== "#/" ?
                        <IconButton
                            aria-label="home"
                            color="inherit"
                            edge="end"
                            onClick={() => {
                                history.push("/");
                                handleClose();
                            }}
                            style={{ marginRight: theme.spacing(2) }}
                        >
                            <HomeIcon />
                        </IconButton> : null
                    }
                    <Grid container item wrap="nowrap">
                        <img alt="kidsloop logo" className={classes.title} src={KidsloopLogo} height={32} />
                        <Typography id="nav-menu-title" variant="h6">
                            for Organizations
                        </Typography>
                    </Grid>
                    { toolbarBtn ? toolbarBtn : null }
                </Toolbar>
            </AppBar>
            <Grid
                container
                direction="row"
            >
                <Paper square style={{ flex: 1, height: "100%" }}>
                    <Toolbar variant="dense">
                        <Typography id="nav-menu-description" variant="body2">
                            <FormattedMessage id={subtitleID} />
                        </Typography>
                    </Toolbar>
                </Paper>
            </Grid>
        </>
    );
}
