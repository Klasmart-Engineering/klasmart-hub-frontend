import ProgramInfoStep from "./Steps/ProgramInfo";
import SubjectsStep from "./Steps/Subjects";
import SummaryStep from "./Steps/Summary";
import { Program } from "@/types/graphQL";
import { buildEmptyProgram } from "@/utils/programs";
import { useValidations } from "@/utils/validations";
import {
    Box,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import {
    Button,
    FullScreenDialog,
    Stepper,
} from "kidsloop-px";
import { Step } from "kidsloop-px/dist/types/components/Stepper";
import { isEqual } from "lodash";
import React,
{
    ReactNode,
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme) => createStyles({
    paper: {
        padding: theme.spacing(3),
    },
    actionsContainer: {
        margin: theme.spacing(2, 0),
    },
}));

interface Props {
    open: boolean;
    onClose: (program?: Program) => void;
}

export default function CreateProgramDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const { required, alphanumeric } = useValidations();
    const [ steps_, setSteps ] = useState<Step[]>([]);
    const [ stepIndex_, setStepIndex ] = useState(0);
    const [ StepComponent, setStepComponent ] = useState<ReactNode>();
    const [ value_, setValue ] = useState<Program>(buildEmptyProgram());
    const [ programInfoError, setProgramInfoError ] = useState<string>();
    const [ subjectsError, setSubjectsError ] = useState<string>();

    const handleValue = (value: Program) => {
        if (isEqual(value, value_)) return;
        setValue(value);
    };

    useEffect(() => {
        if (!steps_.length) return;
        setStepComponent(steps_[stepIndex_].content);
    }, [ stepIndex_, steps_ ]);

    useEffect(() => {
        const steps: Step[] = [
            {
                label: `Project Info`,
                content: <ProgramInfoStep
                    value={value_}
                    onChange={handleValue}
                />,
                error: [
                    required()(value_?.program_name),
                    alphanumeric()(value_?.program_name),
                    required()(value_?.grades),
                    required()(value_?.age_ranges),
                ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: `Subjects`,
                content: <SubjectsStep
                    value={value_}
                    onChange={handleValue}
                />,
                error: [ required()(value_?.subjects) ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: `Summary`,
                content: <SummaryStep
                    value={value_}
                    onChange={handleValue}
                />,
            },
        ];
        setSteps(steps);
    }, [ value_ ]);

    return (
        <FullScreenDialog
            open={open}
            title="Create Program"
            action={{
                label: `Create`,
                disabled: stepIndex_ !== steps_.length - 1 || !steps_.every((step) => !step.error),
                onClick: () => onClose(value_),
            }}
            header={
                <Stepper
                    step={stepIndex_}
                    steps={steps_}
                    onChange={setStepIndex}
                />
            }
            onClose={() => onClose()}
        >
            {StepComponent && StepComponent}
            <Box
                display="flex"
                justifyContent="space-between"
                className={classes.actionsContainer}
            >
                <Button
                    label="Previous"
                    variant="contained"
                    color="primary"
                    disabled={stepIndex_ === 0}
                    onClick={() => setStepIndex((value) => value - 1)}
                />
                {stepIndex_ === steps_.length - 1 && (
                    <Button
                        label="Create"
                        variant="contained"
                        color="primary"
                        disabled={!steps_.every((step) => !step.error)}
                        onClick={() => onClose(value_)}
                    />
                )}
                <Button
                    label="Next"
                    variant="contained"
                    color="primary"
                    disabled={stepIndex_ === steps_.length - 1 || !!steps_[stepIndex_]?.error}
                    onClick={() => setStepIndex((value) => value + 1)}
                />
            </Box>
        </FullScreenDialog>
    );
}
