import AcademicTermStep from "./Steps/AcademicTerm";
import ProgramsStep from "./Steps/Programs";
import SchoolInfoStep from "./Steps/SchoolInfo";
import { SchoolStepper } from "./Steps/shared";
import SummaryStep from "./Steps/Summary/Base";
import { ProgramEdge } from "@/api/programs";
import {
    useEditSchoolPrograms,
    useGetSchoolNode,
    useUpdateSchool,
} from "@/api/schools";
import {
    buildEmptySchoolNode,
    mapSchoolNodeToSchoolStepper,
} from "@/utils/schools";
import { useValidations } from "@/utils/validations";
import {
    Button,
    FullScreenDialog,
    Stepper,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { Step } from "@kl-engineering/kidsloop-px/dist/types/components/Stepper";
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
    schoolId?: string;
    onClose: (value?: SchoolStepper) => void;
}

const mapProgramEdgesToIds = (programEdges: ProgramEdge[]) => programEdges.map(edge => edge.node.id);

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
    const {
        data: schoolNodeData,
        refetch,
        loading,
    } = useGetSchoolNode({
        variables: {
            id: schoolId ?? ``,
            programCount: 50,
        },
        fetchPolicy: `cache-and-network`,
        skip: !open || !schoolId,
    });

    const [ editSchoolPrograms ] = useEditSchoolPrograms();
    const [ editedSchool, setEditedSchool ] = useState(buildEmptySchoolNode());
    const [ steps_, setSteps ] = useState<Step[]>([]);
    const [ stepIndex_, setStepIndex ] = useState(INITIAL_STEP_INDEX);
    const [ StepComponent, setStepComponent ] = useState<ReactNode>();

    const handleChange = (value: SchoolStepper) => {
        if (isEqual(value, editedSchool)) return;
        setEditedSchool(value);
    };

    useEffect(() => {
        if (!open) {
            setEditedSchool(buildEmptySchoolNode());
            return;
        }

        const programIds = !schoolNodeData?.schoolNode.programsConnection?.pageInfo?.hasPreviousPage ? [ ...mapProgramEdgesToIds(schoolNodeData?.schoolNode.programsConnection?.edges ?? []) ] :
            [ ...editedSchool.programIds, ...mapProgramEdgesToIds(schoolNodeData?.schoolNode.programsConnection?.edges ?? []) ];
        const schoolFormData = schoolNodeData?.schoolNode ? mapSchoolNodeToSchoolStepper(schoolNodeData?.schoolNode, programIds) : buildEmptySchoolNode();
        setEditedSchool(schoolFormData);
        setStepIndex(INITIAL_STEP_INDEX);

        if (!schoolNodeData?.schoolNode.programsConnection?.pageInfo?.hasNextPage) return;
        refetch({
            programCursor: schoolNodeData?.schoolNode.programsConnection?.pageInfo.endCursor,
        });
    }, [ schoolNodeData, open ]);

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
                        isEdit
                        value={editedSchool}
                        loading={loading}
                        onChange={handleChange}
                    />
                ),
                error: [
                    required()(editedSchool?.name),
                    letternumeric()(editedSchool?.name),
                    max(120)(editedSchool?.name ?? ``),
                    max(10)(editedSchool?.shortcode ?? ``),
                    alphanumeric()(editedSchool?.shortcode),
                ].filter(((error): error is string => error !== true))
                    .find((error) => error),
            },
            {
                label: intl.formatMessage({
                    id: `common.inputField.optional`,
                    defaultMessage: `Academic Term (Optional)`,
                }, {
                    inputField: intl.formatMessage({
                        id: `academicTerm.label`,
                    }),
                }),
                content: (
                    <AcademicTermStep
                        isEdit
                        value={editedSchool}
                        loading={loading}
                        onChange={handleChange}
                    />
                ),
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
                error: [ required()(editedSchool?.programIds) ].filter(((error): error is string => error !== true))
                    .find((error) => error),
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
            id,
            name,
            shortcode,
            programIds,
        } = editedSchool;
        try {
            await updateSchool({
                variables: {
                    school_id: id,
                    school_name: name ?? ``,
                    shortcode: shortcode ?? undefined,
                },
            });
            await editSchoolPrograms({
                variables: {
                    school_id: id,
                    program_ids: programIds,
                },
            });
            onClose(editedSchool);
            setEditedSchool(buildEmptySchoolNode());
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
