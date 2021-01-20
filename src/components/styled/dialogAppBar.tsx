import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import KidsloopLogo from "@/assets/img/kidsloop_icon.svg";
import RoleStepperButtons from "../Roles/roleStepperButtons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: `relative`,
        },
        title: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(1),
        },
    }),
);

interface Props {
    handleClose: () => void;
    toolbarBtn?: React.ReactNode;
    steps?: string[];
    activeStep?: number;
    handleBack?: () => void;
    handleNext?: () => void;
    handleReset?: () => void;
    displayHome?: boolean;
}

export default function DialogAppBar(props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const {
        handleClose,
        toolbarBtn,
        steps,
        activeStep,
        handleBack,
        handleNext,
        handleReset,
        displayHome,
    } = props;

    return (
        <>
            <AppBar
                color="primary"
                className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="close"
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Grid
                        container
                        item
                        wrap="nowrap">
                        <img
                            alt="kidsloop logo"
                            className={classes.title}
                            src={KidsloopLogo}
                            height={32}
                        />
                        <Typography
                            id="nav-menu-title"
                            variant="h6">
                            for Organizations
                        </Typography>
                    </Grid>
                    {toolbarBtn ? toolbarBtn : null}
                    {steps?.length && (
                        <RoleStepperButtons
                            steps={steps}
                            activeStep={activeStep}
                            handleBack={handleBack}
                            handleNext={handleNext}
                            handleReset={handleReset}
                        />
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
}
