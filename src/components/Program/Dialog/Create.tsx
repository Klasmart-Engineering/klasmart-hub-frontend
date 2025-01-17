import ProgramInfoStep from "./Steps/ProgramInfo";
import SubjectsStep from "./Steps/Subjects";
import SummaryStep from "./Steps/Summary/Base";
import {
    ProgramForm,
    useCreateOrUpdatePrograms,
} from "@/api/programs";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { buildEmptyProgram } from "@/utils/programs";
import { useValidations } from "@/utils/validations";
import {
    Button,
    FullScreenDialog,
    Stepper,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { Step } from "@kl-engineering/kidsloop-px/dist/src/components/Stepper";
import {
    Box,
    Toolbar,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { isEqual } from "lodash";
import React,
{
    ReactNode,
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    actionsContainer: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        backgroundColor: theme.overrides?.MuiAppBar?.colorPrimary?.backgroundColor,
    },
}));

const INITIAL_STEP_INDEX = 0;

interface Props {
    open: boolean;
    onClose: (program?: ProgramForm) => void;
}

export default function CreateProgramDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const currentOrganization = useCurrentOrganization();
    const {
        required,
        letternumeric,
        max,
    } = useValidations();
    const [ steps_, setSteps ] = useState<Step[]>([]);
    const [ stepIndex_, setStepIndex ] = useState(INITIAL_STEP_INDEX);
    const [ StepComponent, setStepComponent ] = useState<ReactNode>();
    const [ value_, setValue ] = useState<ProgramForm>(buildEmptyProgram());
    const [ createOrUpdatePrograms ] = useCreateOrUpdatePrograms();

    const handleValue = (value: ProgramForm) => {
        if (isEqual(value, value_)) return;
        setValue(value);
    };

    useEffect(() => {
        setStepIndex(INITIAL_STEP_INDEX);
        setValue(buildEmptyProgram());
    }, [ open ]);

    useEffect(() => {
        if (!steps_.length) return;
        setStepComponent(steps_[stepIndex_].content);
    }, [ stepIndex_, steps_ ]);

    useEffect(() => {
        const steps: Step[] = [
            {
                label: intl.formatMessage({
                    id: `programs_programsInfoLabel`,
                }),
                content: (
                    <ProgramInfoStep
                        value={value_}
                        onChange={handleValue}
                    />
                ),
                error: [
                    required()(value_?.name),
                    letternumeric()(value_?.name),
                    max(35)(value_?.name),
                    required()(value_?.grades),
                    required()(value_?.ageRanges),
                ].filter(((error): error is string => error !== true))
                    .find((error) => error),
            },
            {
                label: intl.formatMessage({
                    id: `programs_subjects`,
                }),
                content: (
                    <SubjectsStep
                        value={value_}
                        onChange={handleValue}
                    />
                ),
                error: [ required()(value_?.subjects) ].filter(((error): error is string => error !== true))
                    .find((error) => error),
            },
            {
                label: intl.formatMessage({
                    id: `programs_summaryLabel`,
                }),
                content: (
                    <SummaryStep
                        value={value_}
                        onChange={handleValue}
                    />
                ),
            },
        ];
        setSteps(steps);
    }, [ value_ ]);

    const createProgram = async () => {
        const {
            name,
            ageRanges,
            grades,
            subjects,
        } = value_;
        try {
            await createOrUpdatePrograms({
                variables: {
                    organization_id: currentOrganization?.id ?? ``,
                    programs: [
                        {
                            name: name ?? ``,
                            age_ranges: ageRanges ?? [],
                            grades: grades ?? [],
                            subjects: subjects ?? [],
                        },
                    ],
                },
            });
            setValue(buildEmptyProgram());
            onClose(value_);
            enqueueSnackbar(intl.formatMessage({
                id: `programs_programCreateMessage`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `programs_programCreateError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <FullScreenDialog
            open={open}
            title={intl.formatMessage({
                id: `programs_createProgramLabel`,
            })}
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
                        flex="1"
                        justifyContent="space-between"
                    >
                        <Button
                            label={intl.formatMessage({
                                id: `programs_previousLabel`,
                            })}
                            variant="contained"
                            color="primary"
                            disabled={stepIndex_ === 0}
                            onClick={() => setStepIndex((value) => value - 1)}
                        />
                        {stepIndex_ === steps_.length - 1 && (
                            <Button
                                label={intl.formatMessage({
                                    id: `programs_createLabel`,
                                })}
                                variant="contained"
                                color="primary"
                                disabled={!steps_.every((step) => !step.error)}
                                onClick={createProgram}
                            />
                        )}
                        <Button
                            label={intl.formatMessage({
                                id: `programs_nextLabel`,
                            })}
                            variant="contained"
                            color="primary"
                            disabled={stepIndex_ === steps_.length - 1 || !!steps_[stepIndex_]?.error}
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
