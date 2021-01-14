import React from "react";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Close";
import logo from "../../assets/img/logo.png";
import Button from "@material-ui/core/Button";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: `64px`,
            display: `flex`,
        },
        iconContainer: {
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
            marginRight: `auto`,
        },
        buttonsContainer: {
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
        },
        continueButton: {
            background: `linear-gradient(45deg, #3478CE 30%, #3478CE 90%)`,
            borderRadius: 25,
            border: 0,
            color: `white`,
            padding: `8px 29px`,
        },
        buttonLabel: {
            textTransform: `capitalize`,
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
        organizationText: {
            fontWeight: `bold`,
            paddingLeft: `6px`,
        },
        iconButton: {
            paddingLeft: `6px`,
        },
    }),
);

interface Props {
    steps: string[];
    activeStep: number;
    handleBack: () => void;
    handleNext: () => void;
    handleReset: () => void;
}

export default function HeaderControlCard(props: Props) {
    const classes = useStyles();
    const {
        steps,
        activeStep,
        handleBack,
        handleNext,
        handleReset,
    } = props;

    return (
        <Card className={classes.root}>
            <div className={classes.iconContainer}>
                <div className={classes.iconButton}>
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </div>
                <img
                    src={logo}
                    alt="Kids loop logo"
                    height="30" />
                <div className={classes.organizationText}>
                    for Organizations
                </div>
            </div>
            <div className={classes.buttonsContainer}>
                <Button
                    disabled={activeStep === 0}
                    className={classes.backButton}
                    onClick={handleBack}
                >
                    Back
                </Button>
                {activeStep === steps.length ? (
                    <Button
                        classes={{
                            root: classes.continueButton,
                            label: classes.buttonLabel,
                        }}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                ) : (
                    <Button
                        classes={{
                            root: classes.continueButton,
                            label: classes.buttonLabel,
                        }}
                        onClick={handleNext}
                    >
                        {activeStep === steps.length - 1
                            ? `Finish`
                            : `Continue`}
                    </Button>
                )}
            </div>
        </Card>
    );
}
