import SubjectDialogForm from "./Form";
import { currentMembershipVar } from "@/cache";
import { Subject } from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { buildEmptySubject } from "@/utils/subjects";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
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
    value?: Subject;
    open: boolean;
    onClose: (value?: Subject) => void;
}

export default function CreateSubjectDialog (props: Props) {
    const {
        value,
        open,
        onClose,
    } = props;
    const intl = useIntl();
    const prompt = usePrompt();
    const { required, equals } = useValidations();
    const { enqueueSnackbar } = useSnackbar();
    const canDelete = usePermission(`delete_subjects_20447`);
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const [ valid, setValid ] = useState(true);
    const [ updatedSubject, setUpdatedSubject ] = useState(value ?? buildEmptySubject());

    useEffect(() => {
        if (!open) return;
        setUpdatedSubject(value ?? buildEmptySubject());
    }, [ open ]);

    const handleSave = async () => {
        try {
            const { subject_name } = updatedSubject;
            onClose(updatedSubject);
            enqueueSnackbar(intl.formatMessage({
                id: `subjects_subjectSavedMessage`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `subjects_subjectSaveError`,
            }), {
                variant: `error`,
            });
        }
    };

    const handleDelete = async () => {
        try {
            if (!await prompt({
                variant: `error`,
                title: `Delete Subject`,
                okLabel: `Delete`,
                content: <>
                    <DialogContentText>Are you sure you want to delete {`"${value?.subject_name}"`}?</DialogContentText>
                    <DialogContentText>Type <strong>{value?.subject_name}</strong> to confirm deletion.</DialogContentText>
                </>,
                validations: [ required(), equals(value?.subject_name) ],
            })) return;
            onClose(updatedSubject);
            enqueueSnackbar(`Grade successfully deleted`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title="Edit Subject"
            actions={[
                {
                    label: `Delete`,
                    color: `error`,
                    align: `left`,
                    disabled: !canDelete,
                    onClick: handleDelete,
                },
                {
                    label: `Cancel`,
                    color: `primary`,
                    align: `right`,
                    onClick: () => onClose(),
                },
                {
                    label: `Save`,
                    color: `primary`,
                    align: `right`,
                    disabled: !valid,
                    onClick: handleSave,
                },
            ]}
            onClose={() => onClose()}
        >
            <SubjectDialogForm
                value={updatedSubject}
                onChange={setUpdatedSubject}
                onValidation={setValid}
            />
        </Dialog>
    );
}
