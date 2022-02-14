import RoleStepperButtons from "../Role/Stepper/StepperButtons";
import CloseIcon from "@mui/icons-material/Close";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import {
    Theme,
    useTheme,
} from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: `relative`,
        },
        title: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(1),
        },
    }));

interface Props {
    handleClose: () => void;
    toolbarBtn?: React.ReactNode;
    steps?: string[];
    activeStep?: number;
    handleBack?: () => void;
    handleNext?: () => Promise<void>;
    handleReset?: () => void;
    displayHome?: boolean;
    roleInfoStepIsValid?: boolean;
    permissionsStepIsValid?: boolean;
    createOrEditTitle: string;
}

export default function DialogAppBar (props: Props) {
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
        roleInfoStepIsValid,
        permissionsStepIsValid,
        createOrEditTitle,
    } = props;

    return <>
        <AppBar
            color="primary"
            className={classes.appBar}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="close"
                    size="large"
                    onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <Grid
                    container
                    item
                    wrap="nowrap">
                    <Typography
                        id="nav-menu-title"
                        variant="h6"
                    >
                        {createOrEditTitle}
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
                        roleInfoStepIsValid={roleInfoStepIsValid}
                        permissionsStepIsValid={permissionsStepIsValid}
                    />
                )}
            </Toolbar>
        </AppBar>
    </>;
}
