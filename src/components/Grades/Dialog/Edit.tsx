import GradeForm from "./Form";
import {
    useCreateUpdateGrade,
    useDeleteGrade,
    useGetGrade,
} from "@/api/grades";
import { useCurrentOrganization } from "@/state/organizationMemberships";
import { Grade } from "@/types/graphQL";
import { useDeleteEntityPrompt } from "@/utils/common";
import { buildEmptyGrade } from "@/utils/grades";
import {
    Dialog,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
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
    const deletePrompt = useDeleteEntityPrompt();
    const { enqueueSnackbar } = useSnackbar();
    const [ updatedGrade, setUpdatedGrade ] = useState(buildEmptyGrade());
    const [ valid, setValid ] = useState(true);
    const currentOrganization = useCurrentOrganization();
    const [ updateGrade ] = useCreateUpdateGrade();
    const [ deleteGrade ] = useDeleteGrade();

    const { data, loading } = useGetGrade({
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
                    organization_id: currentOrganization?.id ?? ``,
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
        if (!(await deletePrompt({
            entityName: updatedGrade.name ?? ``,
            title: intl.formatMessage({
                id: `grades_deleteGradePrompt`,
            }),
        }))) return;
        try {
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
                    loading={loading}
                    onChange={setUpdatedGrade}
                    onValidation={setValid}
                />
            </Dialog>
        </>
    );
}
