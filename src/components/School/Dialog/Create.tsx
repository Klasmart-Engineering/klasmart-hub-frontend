import ClassesStep from "./Steps/Classes";
import ProgramsStep from "./Steps/Programs";
import SchoolInfoStep from "./Steps/SchoolInfo";
import SummaryStep from "./Steps/Summary";
import { useCreateSchool } from "@/api/schools";
import { currentMembershipVar } from "@/cache";
import { School } from "@/types/graphQL";
import { buildEmptySchool } from "@/utils/schools";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    Box,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import {
    Button,
    FullScreenDialog,
    Stepper,
    useSnackbar,
} from "kidsloop-px";
import { Step } from "kidsloop-px/dist/types/components/Stepper";
import { isEqual } from "lodash";
import React,
{
    ReactNode,
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    paper: {
        padding: theme.spacing(3),
    },
    actionsContainer: {
        margin: theme.spacing(2, 0),
    },
}));

const INITIAL_STEP_INDEX = 0;

interface Props {
    open: boolean;
    onClose: (value?: School) => void;
}

export default function CreateSchoolDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ createSchool ] = useCreateSchool();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const {
        required,
        alphanumeric,
        max,
    } = useValidations();
    const [ newSchool, setNewSchool ] = useState(buildEmptySchool());
    const [ StepComponent, setStepComponent ] = useState<ReactNode>();
    const [ stepIndex_, setStepIndex ] = useState(INITIAL_STEP_INDEX);
    const [ steps_, setSteps ] = useState<Step[]>([]);

    const handleChange = (value: School) => {
        if (isEqual(value, newSchool)) return;
        setNewSchool(value);
    };

    useEffect(() => {
        if (!open) return;
        setNewSchool(buildEmptySchool());
        setStepIndex(INITIAL_STEP_INDEX);
    }, [ open ]);

    useEffect(() => {
        if (!steps_.length) return;
        setStepComponent(steps_[stepIndex_].content);
    }, [ stepIndex_, steps_ ]);

    useEffect(() => {
        const steps: Step[] = [
            {
                label: `School Info`,
                content: <SchoolInfoStep
                    value={newSchool}
                    onChange={handleChange}
                />,
                error: [
                    required()(newSchool?.school_name),
                    alphanumeric()(newSchool?.school_name),
                    max(10)(newSchool?.short_code?.length),
                    alphanumeric()(newSchool?.short_code),
                ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: `Programs`,
                content: <ProgramsStep
                    value={newSchool}
                    onChange={handleChange}
                />,
                error: [ required()(newSchool?.programs) ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: `Classes`,
                content: <ClassesStep
                    value={newSchool}
                    onChange={handleChange}
                />,
                error: [ required()(newSchool?.classes) ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: `Summary`,
                content: <SummaryStep
                    value={newSchool}
                    onChange={handleChange}
                />,
            },
        ];
        setSteps(steps);
    }, [ newSchool ]);

    const handleCreate = async () => {
        const { school_name } = newSchool;
        try {
            await createSchool({
                variables: {
                    organization_id,
                    school_name: school_name ?? ``,
                },
            });
            onClose(newSchool);
            enqueueSnackbar(intl.formatMessage({
                id: `schools_createdSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `schools_createdError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <FullScreenDialog
            open={open}
            title={intl.formatMessage({
                id: `schools_createTitle`,
            })}
            action={{
                label: intl.formatMessage({
                    id: `schools_createLabel`,
                }),
                disabled: stepIndex_ !== steps_.length - 1 || steps_.some((step) => step.error),
                onClick: handleCreate,
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
                        disabled={steps_.some((step) => step.error)}
                        onClick={handleCreate}
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
