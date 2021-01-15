import React,
{ useState } from "react";
import PermissionsActionsCard from "@/components/Roles/PermissionsActionsCard";
import PermissionsCard from "@/components/Roles/PermissionsCard";
import RoleAndNameDescriptionCard from "@/components/Roles/RoleAndNameDescriptionCard";
import RoleInfoCard from "@/components/Roles/RoleInfoCard";
import RoleReviewCard from "@/components/Roles/RoleReviewCard";
import RoleStepper from "@/components/Roles/RoleStepper";
import { createStyles } from "@material-ui/core";
import {
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import DialogAppBar from "@/components/styled/dialogAppBar";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import { TransitionProps } from "@material-ui/core/transitions";
import Grow from "@material-ui/core/Grow";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: `100%`,
        },
        stepper: {
            boxShadow: `0 4px 8px 0 rgba(0,0,0,0.2)`,
        },
        menuContainer: {
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down(`sm`)]: {
                padding: theme.spacing(2, 2),
            },
        },
    }),
);

const motion = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return (
        <Grow
            ref={ref}
            style={{
                transformOrigin: `0 0 0`,
            }}
            {...props}
        />
    );
});

export default function CreateRole() {
    const classes = useStyles();
    const [ activeStep, setActiveStep ] = useState(0);
    const [ skipped, setSkipped ] = useState(new Set<number>());
    const [ open, setOpen ] = useState(true);

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
            return <RoleInfoCard />;
        case 1:
            return (
                <>
                    <PermissionsActionsCard />
                    <PermissionsCard />
                </>
            );
        case 2:
            return (
                <>
                    <RoleAndNameDescriptionCard />
                    <RoleReviewCard />
                </>
            );
        default:
            return `Unknown step`;
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Dialog
                fullScreen
                aria-labelledby="nav-menu-title"
                aria-describedby="nav-menu-description"
                open={open}
                TransitionComponent={motion}
                onClose={handleClose}
            >
                <DialogAppBar
                    handleClose={handleClose}
                    subtitleID={`navMenu_adminConsoleLabel`}
                    steps={steps}
                    activeStep={activeStep}
                    handleBack={handleBack}
                    handleNext={handleNext}
                    handleReset={handleReset}
                />
                <div className={classes.stepper}>
                    <RoleStepper activeStep={activeStep} />
                </div>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    spacing={2}
                    className={classes.menuContainer}
                >
                    {getStepContent(activeStep)}
                </Grid>
            </Dialog>
        </div>
    );
}
