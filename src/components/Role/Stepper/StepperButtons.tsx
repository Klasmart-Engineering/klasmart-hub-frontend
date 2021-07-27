import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import { Fab } from "kidsloop-px";
import React from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backButton: {
            marginRight: theme.spacing(1),
        },
    }));

interface Props {
    steps?: string[];
    activeStep?: number;
    handleBack?: () => void;
    handleNext?: () => Promise<void>;
    handleReset?: () => void;
    roleInfoStepIsValid?: boolean;
    permissionsStepIsValid?: boolean;
}

export default function RoleStepperButtons (props: Props) {
    const classes = useStyles();
    const intl = useIntl();

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
            return !roleInfoStepIsValid;
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
                    <FormattedMessage id="rolesInfoCard_backButton" />
                </Button>
                {steps && activeStep === steps.length ? (
                    <Fab
                        color="primary"
                        label="Reset"
                        variant="extended"
                        onClick={handleReset}
                    />
                ) : (
                    <Fab
                        color="primary"
                        disabled={disabledHandler()}
                        variant="extended"
                        label={steps && activeStep === steps.length - 1
                            ? intl.formatMessage({
                                id: `rolesInfoCard_finishButton`,
                            })
                            : intl.formatMessage({
                                id: `rolesInfoCard_continueButton`,
                            }) }
                        onClick={handleNext}
                    />
                )}
            </div>
        </Grid>
    );
}