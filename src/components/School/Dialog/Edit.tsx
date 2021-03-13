import ClassesStep from "./Steps/Classes";
import ProgramsStep from "./Steps/Programs";
import SchoolInfoStep from "./Steps/SchoolInfo";
import SummaryStep from "./Steps/Summary";
import {
    useEditSchoolPrograms,
    useUpdateSchool,
} from "@/api/schools";
import { School } from "@/types/graphQL";
import { buildEmptySchool } from "@/utils/schools";
import { useValidations } from "@/utils/validations";
import {
    Box,
    createStyles,
    makeStyles,
    Toolbar,
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

const useStyles = makeStyles((theme) => createStyles({
    actionsContainer: {
        backgroundColor: theme.overrides?.MuiAppBar?.colorPrimary?.backgroundColor,
    },
}));

const INITIAL_STEP_INDEX = 2;

interface Props {
    open: boolean;
    value?: School;
    onClose: (value?: School) => void;
}

export default function EditSchoolDialog (props: Props) {
    const {
        open,
        value,
        onClose,
    } = props;
    const classes = useStyles();
    const {
        required,
        alphanumeric,
        max,
    } = useValidations();
    const { enqueueSnackbar } = useSnackbar();
    const [ updateSchool ] = useUpdateSchool();
    const [ editSchoolPrograms ] = useEditSchoolPrograms();
    const [ editedSchool, setEditedSchool ] = useState(value ?? buildEmptySchool());
    const [ steps_, setSteps ] = useState<Step[]>([]);
    const [ stepIndex_, setStepIndex ] = useState(INITIAL_STEP_INDEX);
    const [ StepComponent, setStepComponent ] = useState<ReactNode>();

    const handleChange = (value: School) => {
        if (isEqual(value, editedSchool)) return;
        setEditedSchool(value);
    };

    useEffect(() => {
        if (!open) return;
        setEditedSchool(value ?? buildEmptySchool());
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
                    value={editedSchool}
                    onChange={handleChange}
                />,
                error: [
                    required()(editedSchool?.school_name),
                    alphanumeric()(editedSchool?.school_name),
                    max(10)(editedSchool?.shortcode?.length),
                    alphanumeric()(editedSchool?.shortcode),
                ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: `Programs`,
                content: <ProgramsStep
                    value={editedSchool}
                    onChange={handleChange}
                />,
                error: [ required()(editedSchool?.programs) ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            // {
            //     label: `Classes`,
            //     content: <ClassesStep
            //         value={editedSchool}
            //         onChange={handleChange}
            //     />,
            //     error: [ required()(editedSchool?.classes) ].filter(((error): error is string => error !== true)).find((error) => error),
            // },
            {
                label: `Summary`,
                content: <SummaryStep
                    value={editedSchool}
                    onChange={handleChange}
                />,
            },
        ];
        setSteps(steps);
    }, [ editedSchool ]);

    const handleSave = async () => {
        if (!value) return;
        const {
            school_id,
            school_name,
            programs,
            shortcode,
        } = editedSchool;
        try {
            await updateSchool({
                variables: {
                    school_id,
                    school_name: school_name ?? ``,
                    shortcode: shortcode ?? undefined,
                },
            });
            await editSchoolPrograms({
                variables: {
                    school_id,
                    program_ids: programs?.map((program) => program.id).filter((id): id is string => !!id) ?? [],
                },
            });
            onClose(editedSchool);
            enqueueSnackbar(`School has been saved succesfully`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    return (
        <FullScreenDialog
            open={open}
            title="Edit School"
            header={
                <Stepper
                    step={stepIndex_}
                    steps={steps_}
                    onChange={setStepIndex}
                />
            }
            footer={
                <Toolbar className={classes.actionsContainer}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        flex="1"
                    >
                        <Button
                            label="Previous"
                            variant="contained"
                            color="primary"
                            disabled={stepIndex_ === 0}
                            onClick={() => setStepIndex((value) => value - 1)}
                        />
                        <Button
                            label="Save"
                            variant="contained"
                            color="primary"
                            disabled={steps_.some((step) => step.error)}
                            onClick={handleSave}
                        />
                        <Button
                            label="Next"
                            variant="contained"
                            color="primary"
                            disabled={stepIndex_ === steps_.length - 1}
                            onClick={() => setStepIndex((value) => value + 1)}
                        />
                    </Box>
                </Toolbar>
            }
            onClose={() => onClose()}
        >
            {StepComponent && StepComponent}
        </FullScreenDialog>
    );
}
