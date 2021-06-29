import ProgramInfoStep from "./Steps/ProgramInfo";
import SubjectsStep from "./Steps/Subjects";
import SummaryStep from "./Steps/Summary";
import {
    ProgramEdge,
    useCreateOrUpdatePrograms,
} from "@/api/programs";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { buildEmptyProgram } from "@/utils/programs";
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
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    actionsContainer: {
        backgroundColor: theme.overrides?.MuiAppBar?.colorPrimary?.backgroundColor,
    },
}));

const INITIAL_STEP_INDEX = 2;

interface Props {
    value?: ProgramEdge;
    open: boolean;
    onClose: (program?: ProgramEdge) => void;
}

export default function CreateProgramDialog (props: Props) {
    const {
        value,
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const {
        required,
        letternumeric,
        max,
    } = useValidations();
    const currentOrganization = useCurrentOrganization();
    const [ createOrUpdatePrograms ] = useCreateOrUpdatePrograms();
    const [ steps_, setSteps ] = useState<Step[]>([]);
    const [ stepIndex_, setStepIndex ] = useState(INITIAL_STEP_INDEX);
    const [ StepComponent, setStepComponent ] = useState<ReactNode>();
    const [ value_, setValue ] = useState<ProgramEdge>(value ?? buildEmptyProgram());

    const handleValue = (value: ProgramEdge) => {
        if (isEqual(value, value_)) return;
        setValue(value);
    };

    useEffect(() => {
        if (!open) return;
        setStepIndex(INITIAL_STEP_INDEX);
        setValue(value ?? buildEmptyProgram());
    }, [ open, value ]);

    useEffect(() => {
        if (!steps_.length) return;
        setStepComponent(steps_[stepIndex_].content);
    }, [ stepIndex_, steps_ ]);

    useEffect(() => {
        const steps: Step[] = [
            {
                label: intl.formatMessage({
                    id: `programs_projectInfoLabel`,
                }),
                content: <ProgramInfoStep
                    value={value_}
                    onChange={handleValue}
                />,
                error: [
                    required()(value_?.node?.name),
                    letternumeric()(value_?.node?.name),
                    max(35)(value_?.node?.name),
                    required()(value_?.node?.grades),
                    required()(value_?.node?.ageRanges),
                ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: intl.formatMessage({
                    id: `programs_subjects`,
                }),
                content: <SubjectsStep
                    value={value_}
                    onChange={handleValue}
                />,
                error: [ required()(value_?.node?.subjects) ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: intl.formatMessage({
                    id: `programs_summaryLabel`,
                }),
                content: <SummaryStep
                    value={value_}
                    onChange={handleValue}
                />,
            },
        ];
        setSteps(steps);
    }, [ value_ ]);

    const updateProgram = async () => {
        const {
            id,
            name,
            ageRanges,
            grades,
            subjects,
        } = value_?.node;

        try {
            await createOrUpdatePrograms({
                variables: {
                    organization_id: currentOrganization?.organization_id ?? ``,
                    programs: [
                        {
                            id,
                            name: name ?? ``,
                            age_ranges: ageRanges?.map(({ id }) => id).filter((id): id is string => !!id) ?? [],
                            grades: grades?.map(({ id }) => id).filter((id): id is string => !!id) ?? [],
                            subjects: subjects?.map(({ id }) => id).filter((id): id is string => !!id) ?? [],
                        },
                    ],
                },
            });
            onClose(value_);
            enqueueSnackbar(intl.formatMessage({
                id: `programs_programSaveMessage`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `programs_programSaveError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <FullScreenDialog
            open={open}
            title={intl.formatMessage({
                id: `programs_editProgramLabel`,
            })}
            header={
                <Stepper
                    editable
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
                            label={intl.formatMessage({
                                id: `programs_previousLabel`,
                            })}
                            variant="contained"
                            color="primary"
                            disabled={stepIndex_ === 0}
                            onClick={() => setStepIndex((value) => value - 1)}
                        />
                        <Button
                            label={intl.formatMessage({
                                id: `programs_saveLabel`,
                            })}
                            variant="contained"
                            color="primary"
                            disabled={!steps_.every((step) => !step.error)}
                            onClick={updateProgram}
                        />
                        <Button
                            label={intl.formatMessage({
                                id: `programs_nextLabel`,
                            })}
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
