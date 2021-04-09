import ProgramsStep from "./Steps/Programs";
import SchoolInfoStep from "./Steps/SchoolInfo";
import SummaryStep from "./Steps/Summary";
import {
    useCreateSchool,
    useEditSchoolPrograms,
} from "@/api/schools";
import { useCurrentOrganization } from "@/store/organizationMemberships";
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
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    actionsContainer: {
        backgroundColor: theme.overrides?.MuiAppBar?.colorPrimary?.backgroundColor,
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
    const [ editSchoolPrograms ] = useEditSchoolPrograms();
    const currentOrganization = useCurrentOrganization();
    const {
        required,
        alphanumeric,
        letternumeric,
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
                label: intl.formatMessage({
                    id: `schools_schoolInfoLabel`,
                }),
                content: <SchoolInfoStep
                    value={newSchool}
                    onChange={handleChange}
                />,
                error: [
                    required(`The school name is required`)(newSchool?.school_name),
                    letternumeric()(newSchool?.school_name),
                    max(35, `Max length 35 of characters`)(newSchool.school_name),
                    max(10)(newSchool?.shortcode?.length),
                    alphanumeric()(newSchool?.shortcode),
                ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            {
                label: intl.formatMessage({
                    id: `schools_programsLabel`,
                }),
                content: <ProgramsStep
                    value={newSchool}
                    onChange={handleChange}
                />,
                error: [ required()(newSchool?.programs) ].filter(((error): error is string => error !== true)).find((error) => error),
            },
            // {
            //     label: `Classes`,
            //     content: <ClassesStep
            //         value={newSchool}
            //         onChange={handleChange}
            //     />,
            //     error: [ required()(newSchool?.classes) ].filter(((error): error is string => error !== true)).find((error) => error),
            // },
            {
                label: intl.formatMessage({
                    id: `schools_summaryLabel`,
                }),
                content: <SummaryStep
                    value={newSchool}
                    onChange={handleChange}
                />,
            },
        ];
        setSteps(steps);
    }, [ newSchool ]);

    const handleCreate = async () => {
        const {
            school_name,
            programs,
            shortcode,
        } = newSchool;
        try {
            const createdSchoolResp = await createSchool({
                variables: {
                    organization_id: currentOrganization?.organization_id ?? ``,
                    school_name: school_name ?? ``,
                    shortcode: shortcode ?? undefined,
                },
            });
            const schoolId = createdSchoolResp.data?.organization.createSchool.school_id;
            if (!schoolId) throw Error(`invalid-school-id`);
            await editSchoolPrograms({
                variables: {
                    school_id: schoolId,
                    program_ids: programs?.map((program) => program.id).filter((id): id is string => !!id) ?? [],
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
                                id: `generic_previousLabel`,
                            })}
                            variant="contained"
                            color="primary"
                            disabled={stepIndex_ === 0}
                            onClick={() => setStepIndex((value) => value - 1)}
                        />
                        {stepIndex_ === steps_.length - 1 && (
                            <Button
                                label={intl.formatMessage({
                                    id: `schools_createLabel`,
                                })}
                                variant="contained"
                                color="primary"
                                disabled={steps_.some((step) => step.error)}
                                onClick={handleCreate}
                            />
                        )}
                        <Button
                            label={intl.formatMessage({
                                id: `generic_nextLabel`,
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
