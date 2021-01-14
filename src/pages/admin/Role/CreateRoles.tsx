import React,
{ useState } from "react";
import HeaderControlCard from "@/components/Roles/HeaderControlCard";
import PermissionsActionsCard from "@/components/Roles/PermissionsActionsCard";
import PermissionsCard from "@/components/Roles/PermissionsCard";
import RoleAndNameDescriptionCard from "@/components/Roles/RoleAndNameDescriptionCard";
import RoleInfoCard from "@/components/Roles/RoleInfoCard";
import RoleReviewCard from "@/components/Roles/RoleReviewCard";
import RoleStepper from "@/components/Roles/RoleStepper";
import {
    createStyles,
    Typography,
} from "@material-ui/core";
import {
    makeStyles,
    Theme,
} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: `100%`,
        },
        componentsContainer: {
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `center`,
            alignItems: `center`,
        },
        stepper: {
            boxShadow: `0 4px 8px 0 rgba(0,0,0,0.2)`,
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        button: {
            marginRight: theme.spacing(1),
        },
    }),
);

export default function CreateRole() {
    const classes = useStyles();
    const [ activeStep, setActiveStep ] = useState(0);
    const [ skipped, setSkipped ] = useState(new Set<number>());

    const handleNext = () => {
        const newSkipped = skipped;
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function getSteps() {
        return [
            `Role Info`,
            `Set Permissions`,
            `Confirm role`,
        ];
    }

    const steps = getSteps();

    function getStepContent(step: number) {
        switch (step) {
        case 0:
            return (
                <div
                    style={{
                        display: `flex`,
                        justifyContent: `center`,
                        alignItems: `center`,
                    }}
                >
                    <RoleInfoCard />
                </div>
            );
        case 1:
            return (
                <div className={classes.componentsContainer}>
                    <PermissionsActionsCard />
                    <br />
                    <PermissionsCard />
                </div>
            );
        case 2:
            return (
                <div className={classes.componentsContainer}>
                    <RoleAndNameDescriptionCard />
                    <br />
                    <RoleReviewCard />
                </div>
            );
        default:
            return `Unknown step`;
        }
    }

    return (
        <div className={classes.root}>
            <HeaderControlCard
                steps={steps}
                activeStep={activeStep}
                handleBack={handleBack}
                handleNext={handleNext}
                handleReset={handleReset}
            />
            <div className={classes.stepper}>
                <div>
                    <div>
                        <RoleStepper activeStep={activeStep} />
                    </div>
                </div>
            </div>
            <div>
                {activeStep === steps.length ? (
                    <div>
                        <Typography className={classes.instructions}>
                            All steps completed - you&apos;re finished
                        </Typography>
                    </div>
                ) : (
                    <div>
                        <br />
                        <div
                            style={{
                                padding: `10px`,
                                backgroundColor: `#f1f1f1`,
                            }}
                        >
                            {getStepContent(activeStep)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
