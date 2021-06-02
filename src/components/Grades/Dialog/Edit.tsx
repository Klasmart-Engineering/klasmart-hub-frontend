import GradeForm from "./Form";
import {
    useCreateUpdateGrade,
    useDeleteGrade,
} from "@/api/grades";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Grade } from "@/types/graphQL";
import { buildEmptyGrade } from "@/utils/grades";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    DialogContentText,
    makeStyles,
} from "@material-ui/core";
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
    value?: Grade;
    open: boolean;
    onClose: (updatedGrade?: Grade) => void;
}

export default function (props: Props) {
    const {
        open,
        onClose,
        value,
    } = props;
    const intl = useIntl();
    const prompt = usePrompt();
    const { equals, required } = useValidations();
    const { enqueueSnackbar } = useSnackbar();
    const [ updatedGrade, setUpdatedGrade ] = useState(value ?? buildEmptyGrade());
    const [ valid, setValid ] = useState(true);
    const currentOrganization = useCurrentOrganization();
    const [ updateGrade ] = useCreateUpdateGrade();
    const [ deleteGrade ] = useDeleteGrade();

    useEffect(() => {
        setUpdatedGrade(value ?? buildEmptyGrade());
    }, [ open ]);

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
                            userName: value?.name,
                        })}
                    </DialogContentText>
                    <DialogContentText>{intl.formatMessage({
                        id: `generic_typeToRemovePrompt`,
                    }, {
                        value: <strong>{value?.name}</strong>,
                    })}</DialogContentText>
                </>,
                validations: [ required(), equals(value?.name) ],
            })) return;

            await deleteGrade({
                variables: {
                    id: value?.id ?? ``,
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
                    value={updatedGrade}
                    onChange={setUpdatedGrade}
                    onValidation={setValid}
                />
            </Dialog>
        </>
    );
}
