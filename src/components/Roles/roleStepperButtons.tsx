import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import { BaseFabButton } from "kidsloop-px";
import React from "react";

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
    handleNext?: () => Promise<void>;
    handleReset?: () => void;
    roleInfoStepIsValid?: boolean;
    permissionsStepIsValid?: boolean;
}

export default function RoleStepperButtons(props: Props) {
    const classes = useStyles();

    const {
        steps,
        activeStep,
        handleBack,
        handleNext,
        handleReset,
        roleInfoStepIsValid,
        permissionsStepIsValid,
    } = props;

    const disabledHandler = () => {
        if (activeStep === 0) {
            return roleInfoStepIsValid;
        }

        if (activeStep === 1) {
            return !permissionsStepIsValid;
        }

        return false;
    };

    return (
        <Grid
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
                {steps && activeStep === steps.length ? (
                    <BaseFabButton onClick={handleReset}>Reset</BaseFabButton>
                ) : (
                    <BaseFabButton
                        disabled={disabledHandler()}
                        onClick={handleNext}
                    >
                        {steps && activeStep === steps.length - 1
                            ? `Finish`
                            : `Continue`}
                    </BaseFabButton>
                )}
            </div>
        </Grid>
    );
}
