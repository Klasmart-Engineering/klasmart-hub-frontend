import ProgramsStep from "./Steps/Programs";
import SchoolInfoStep from "./Steps/SchoolInfo";
import SummaryStep from "./Steps/Summary/Base";
import {
    useEditSchoolPrograms,
    useGetSchool,
    useUpdateSchool,
} from "@/api/schools";
import {
    School,
    Status,
} from "@/types/graphQL";
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
    open: boolean;
    schoolId?: string;
    onClose: (value?: School) => void;
}

export default function EditSchoolDialog (props: Props) {
    const {
        open,
        schoolId,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const {
        required,
        alphanumeric,
        letternumeric,
        max,
    } = useValidations();
    const { enqueueSnackbar } = useSnackbar();
    const [ updateSchool ] = useUpdateSchool();
    const { data: schoolData } = useGetSchool({
        variables: {
            school_id: schoolId ?? ``,
        },
        fetchPolicy: `cache-and-network`,
        skip: !open || !schoolId,
    });
    const [ editSchoolPrograms ] = useEditSchoolPrograms();
    const [ editedSchool, setEditedSchool ] = useState(buildEmptySchool());
    const [ steps_, setSteps ] = useState<Step[]>([]);
    const [ stepIndex_, setStepIndex ] = useState(INITIAL_STEP_INDEX);
    const [ StepComponent, setStepComponent ] = useState<ReactNode>();

    const handleChange = (value: School) => {
        if (isEqual(value, editedSchool)) return;
        setEditedSchool(value);
    };

    useEffect(() => {
        if (!open) {
            setEditedSchool(buildEmptySchool());
            return;
        }
        setEditedSchool(schoolData?.school ?? buildEmptySchool());
        setStepIndex(INITIAL_STEP_INDEX);
    }, [ schoolData, open ]);

    useEffect(() => {
        if (!steps_.length) return;
        setStepComponent(steps_[stepIndex_].content);
    }, [ stepIndex_, steps_ ]);

    useEffect(() => {
        const steps: Step[] = [
            {
                label: intl.formatMessage({
                    id: `schools_schoolInfoLabel`,
                }),
                content: (
                    <SchoolInfoStep
                        value={editedSchool}
                        onChange={handleChange}
                    />
                ),
                error: [
                    required()(editedSchool?.school_name),
                    letternumeric()(editedSchool?.school_name),
                    max(120)(editedSchool?.school_name),
                    max(10)(editedSchool?.shortcode),
                    alphanumeric()(editedSchool?.shortcode),
                ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: intl.formatMessage({
                    id: `schools_programsLabel`,
                }),
                content: (
                    <ProgramsStep
                        value={editedSchool}
                        onChange={handleChange}
                    />
                ),
                error: [ required()(editedSchool?.programs) ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: intl.formatMessage({
                    id: `schools_summaryLabel`,
                }),
                content: (
                    <SummaryStep
                        value={editedSchool}
                        onChange={handleChange}
                    />
                ),
            },
        ];

        setSteps(steps);
    }, [ editedSchool ]);

    const handleSave = async () => {
        if (!schoolId) return;
        const {
            school_id,
            school_name,
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
                    program_ids: editedSchool.programs?.map((program) => program?.id).filter((id): id is string => !!id) ?? [],
                },
            });
            onClose(editedSchool);
            enqueueSnackbar(intl.formatMessage({
                id: `schools_editSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `generic_createError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <FullScreenDialog
            open={open}
            title={intl.formatMessage({
                id: `schools_editSchoolLabel`,
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
                                id: `generic_previousLabel`,
                            })}
                            variant="contained"
                            color="primary"
                            disabled={stepIndex_ === 0}
                            onClick={() => setStepIndex((value) => value - 1)}
                        />
                        <Button
                            label={intl.formatMessage({
                                id: `generic_saveLabel`,
                            })}
                            variant="contained"
                            color="primary"
                            disabled={steps_.some((step) => step.error)}
                            onClick={handleSave}
                        />
                        <Button
                            label={intl.formatMessage({
                                id: `generic_nextLabel`,
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
