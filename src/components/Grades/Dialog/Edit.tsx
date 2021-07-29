import GradeForm from "./Form";
import {
    useCreateUpdateGrade,
    useDeleteGrade,
    useGetGrade,
} from "@/api/grades";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Grade } from "@/types/graphQL";
import { buildEmptyGrade } from "@/utils/grades";
import { useValidations } from "@/utils/validations";
import { DialogContentText } from "@material-ui/core";
import {
    Dialog,
    usePrompt,
    useSnackbar,
} from "kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

interface Props {
    open: boolean;
    onClose: (updatedGrade?: Grade) => void;
    gradeId?: string;
}

export default function (props: Props) {
    const {
        open,
        onClose,
        gradeId,
    } = props;
    const intl = useIntl();
    const prompt = usePrompt();
    const { equals, required } = useValidations();
    const { enqueueSnackbar } = useSnackbar();
    const [ updatedGrade, setUpdatedGrade ] = useState(buildEmptyGrade());
    const [ valid, setValid ] = useState(true);
    const currentOrganization = useCurrentOrganization();
    const [ updateGrade ] = useCreateUpdateGrade();
    const [ deleteGrade ] = useDeleteGrade();

    const { data } = useGetGrade({
        variables: {
            id: gradeId ?? ``,
        },
        skip: !open || !gradeId,
    });

    useEffect(() => {
        setUpdatedGrade(data?.grade ?? buildEmptyGrade());
    }, [ open, data ]);

    const handleSave = async () => {
        try {
            await updateGrade({
                variables: {
                    organization_id: currentOrganization?.organization_id ?? ``,
                    grades: [
                        {
                            id: updatedGrade.id,
                            name: updatedGrade.name ?? ``,
                            progress_from_grade_id: updatedGrade.progress_from_grade?.id ?? ``,
                            progress_to_grade_id: updatedGrade.progress_to_grade?.id ?? ``,
                        },
                    ],
                },
            });
            onClose(updatedGrade);
            enqueueSnackbar(intl.formatMessage({
                id: `grades_editSuccess`,
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

    const handleDelete = async () => {
        try {
            if (!await prompt({
                variant: `error`,
                title: intl.formatMessage({
                    id: `grades_deleteGradePromptTitle`,
                }),
                okLabel: intl.formatMessage({
                    id: `grades_deleteLabel`,
                }),
                content: <>
                    <DialogContentText>
                        {intl.formatMessage({
                            id: `editDialog_deleteConfirm`,
                        }, {
                            userName: updatedGrade?.name,
                        })}
                    </DialogContentText>
                    <DialogContentText>{intl.formatMessage({
                        id: `generic_typeToRemovePrompt`,
                    }, {
                        value: <strong>{updatedGrade?.name}</strong>,
                    })}</DialogContentText>
                </>,
                validations: [ required(), equals(updatedGrade?.name) ],
            })) return;

            await deleteGrade({
                variables: {
                    id: updatedGrade?.id ?? ``,
                },
            });
            onClose(updatedGrade);
            enqueueSnackbar(intl.formatMessage({
                id: `grades_deleteSuccess`,
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
        <>
            <Dialog
                title={intl.formatMessage({
                    id: `grades_editTitle`,
                })}
                open={open}
                actions={[
                    {
                        label: intl.formatMessage({
                            id: `grades_deleteLabel`,
                        }),
                        color: `error`,
                        align: `left`,
                        onClick: handleDelete,
                    },
                    {
                        label: intl.formatMessage({
                            id: `grades_cancelLabel`,
                        }),
                        color: `primary`,
                        align: `right`,
                        onClick: () => onClose(),
                    },
                    {
                        label: intl.formatMessage({
                            id: `generic_saveLabel`,
                        }),
                        color: `primary`,
                        align: `right`,
                        onClick: handleSave,
                        disabled: !valid,
                    },
                ]}
                onClose={() => onClose()}
            >
                <GradeForm
                    key={updatedGrade.id}
                    value={updatedGrade}
                    onChange={setUpdatedGrade}
                    onValidation={setValid}
                />
            </Dialog>
        </>
    );
}
