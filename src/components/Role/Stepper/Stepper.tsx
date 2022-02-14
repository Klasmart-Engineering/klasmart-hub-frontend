import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from "react";

interface Props {
    activeStep: number;
    steps: string[];
}

const useStyles = makeStyles((theme) =>
    createStyles({
        stepper: {
            padding: theme.spacing(3),
        },
    }));

export default function RoleStepper ({ activeStep, steps }: Props) {
    const classes = useStyles();
    return (
        <div className={classes.stepper}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: { optional?: React.ReactNode } = {};

                    return (
                        <Step
                            key={label}
                            {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </div>
    );
}
