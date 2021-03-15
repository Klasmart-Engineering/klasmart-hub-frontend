import GradeForm from "./Form";
import { useCreateUpdateGrade } from "@/api/grades";
import { currentMembershipVar } from "@/cache";
import { Grade } from "@/types/graphQL";
import { buildEmptyGrade } from "@/utils/grades";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import {
    Dialog,
    useSnackbar,
} from "kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

interface Props {
    open: boolean;
    onClose: (newGrade?: Grade) => void;
}

export default function (props: Props) {
    const { open, onClose } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ newGrade, setNewGrade ] = useState(buildEmptyGrade());
    const [ valid, setValid ] = useState(true);

    const [ createGrade ] = useCreateUpdateGrade();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;

    useEffect(() => {
        setNewGrade(buildEmptyGrade());
    }, [ open ]);

    const handleCreate = async () => {
        try {
            const grade: Grade = {
                name: newGrade.name,
                progress_from_grade_id: newGrade.progress_from_grade_id ?? null,
                progress_to_grade_id: newGrade.progress_to_grade_id ?? null,
            };
            const response = await createGrade({
                variables: {
                    organization_id,
                    grades: [ grade ],
                },
            });
            onClose(newGrade);
            enqueueSnackbar(intl.formatMessage({
                id: `grades_createSuccess`,
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
                    id: `grades_createGradeTitle`,
                })}
                open={open}
                actions={[
                    {
                        label: intl.formatMessage({
                            id: `grades_cancelLabel`,
                        }),
                        color: `primary`,
                        onClick: () => onClose(),
                    },
                    {
                        label: intl.formatMessage({
                            id: `grades_createLabel`,
                        }),
                        color: `primary`,
                        onClick: handleCreate,
                        disabled: !valid,
                    },
                ]}
                onClose={() => onClose()}
            >
                <GradeForm
                    value={newGrade}
                    onChange={setNewGrade}
                    onValidation={setValid}
                />
            </Dialog>
        </>
    );
}
