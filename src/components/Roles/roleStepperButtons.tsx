import Button from "@material-ui/core/Button";
import { BaseFabButton } from "kidsloop-px";
import Grid from "@material-ui/core/Grid";
import React from "react";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backButton: {
            marginRight: theme.spacing(1),
        },
    }),
);

interface Props {
    steps?: string[];
    activeStep?: number;
    handleBack?: () => void;
    handleNext?: () => void;
    handleReset?: () => void;
}

export default function RoleStepperButtons(props: Props) {
    const classes = useStyles();

    const {
        steps,
        activeStep,
        handleBack,
        handleNext,
        handleReset,
    } = props;

    return (<Grid
        container
        item
        justify="flex-end"
        wrap="nowrap">
        <div>
            <Button
                disabled={activeStep === 0}
                className={classes.backButton}
                onClick={handleBack}
            >
                Back
            </Button>
            {activeStep === steps.length ? (
                <BaseFabButton onClick={handleReset}>
                    Reset
                </BaseFabButton>
            ) : (
                <BaseFabButton onClick={handleNext}>
                    {activeStep === steps.length - 1
                        ? `Finish`
                        : `Continue`}
                </BaseFabButton>
            )}
        </div>
    </Grid>);
}
