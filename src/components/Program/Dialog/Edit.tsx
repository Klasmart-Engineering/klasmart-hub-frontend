import ProgramInfoStep from "./Steps/ProgramInfo";
import SubjectsStep from "./Steps/Subjects";
import SummaryStep from "./Steps/Summary/Base";
import {
    ProgramNode,
    useCreateOrUpdatePrograms,
    useGetProgramNode,
} from "@/api/programs";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Program } from "@/types/graphQL";
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        backgroundColor: theme.overrides?.MuiAppBar?.colorPrimary?.backgroundColor,
    },
}));

const INITIAL_STEP_INDEX = 2;

interface Props {
    programId?: string;
    open: boolean;
    onClose: (program?: Program) => void;
}

export default function CreateProgramDialog (props: Props) {
    const {
        programId,
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
    const { data, loading: programsLoading } = useGetProgramNode({
        variables: {
            id: programId ?? ``,
        },
        fetchPolicy: `cache-and-network`,
        skip: !open || !programId,
    });
    const [ createOrUpdatePrograms ] = useCreateOrUpdatePrograms();
    const [ steps_, setSteps ] = useState<Step[]>([]);
    const [ stepIndex_, setStepIndex ] = useState(INITIAL_STEP_INDEX);
    const [ StepComponent, setStepComponent ] = useState<ReactNode>();
    const [ updatedProgram, setUpdatedProgram ] = useState<ProgramNode>(buildEmptyProgram());
    const [ loading, setLoading ] = useState<boolean>(true);

    const handleValue = (value: ProgramNode) => {
        if (isEqual(value, updatedProgram)) return;
        setUpdatedProgram(value);
    };

    useEffect(() => {
        if (!open) {
            setUpdatedProgram(buildEmptyProgram());
            return;
        }
        setStepIndex(INITIAL_STEP_INDEX);
        setUpdatedProgram(data?.programNode ?? buildEmptyProgram());
        setLoading(programsLoading);
    }, [ open, data ]);

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
                content: (
                    <ProgramInfoStep
                        value={updatedProgram}
                        loading={programsLoading}
                        onChange={handleValue}
                    />
                ),
                error: [
                    required()(updatedProgram?.name),
                    letternumeric()(updatedProgram?.name),
                    max(35)(updatedProgram?.name),
                    required()(updatedProgram?.grades),
                    required()(updatedProgram?.ageRanges),
                ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: intl.formatMessage({
                    id: `programs_subjects`,
                }),
                content: (
                    <SubjectsStep
                        value={updatedProgram}
                        onChange={handleValue}
                    />
                ),
                error: [ required()(updatedProgram?.subjects) ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: intl.formatMessage({
                    id: `programs_summaryLabel`,
                }),
                content: (
                    <SummaryStep
                        value={updatedProgram}
                        loading={programsLoading}
                        onChange={handleValue}
                    />
                ),
            },
        ];
        setSteps(steps);
    }, [ updatedProgram, loading ]);

    const updateProgram = async () => {
        const {
            id,
            name,
            ageRanges,
            grades,
            subjects,
        } = updatedProgram;
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
            onClose(updatedProgram);
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
            header={(
                <Stepper
                    editable
                    step={stepIndex_}
                    steps={steps_}
                    onChange={setStepIndex}
                />
            )}
            footer={(
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
            )}
            onClose={() => onClose()}
        >
            {StepComponent && StepComponent}
        </FullScreenDialog>
    );
}
