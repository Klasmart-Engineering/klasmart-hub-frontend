import SubjectDialogForm from "./Form";
import { currentMembershipVar } from "@/cache";
import { Subject } from "@/types/graphQL";
import { buildEmptySubject } from "@/utils/subjects";
import { useReactiveVar } from "@apollo/client";
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
    onClose: (value?: Subject) => void;
}

export default function CreateSubjectDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const [ valid, setValid ] = useState(true);
    const [ newSubject, setNewSubject ] = useState(buildEmptySubject());

    useEffect(() => {
        if (!open) return;
        setNewSubject(buildEmptySubject());
    }, [ open ]);

    const handleCreate = async () => {
        try {
            const { subject_name } = newSubject;
            onClose(newSubject);
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

    return (
        <Dialog
            open={open}
            title="Create subject"
            actions={[
                {
                    label: `Cancel`,
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: `Create`,
                    color: `primary`,
                    disabled: !valid,
                    onClick: handleCreate,
                },
            ]}
            onClose={() => onClose()}
        >
            <SubjectDialogForm
                value={newSubject}
                onChange={setNewSubject}
                onValidation={setValid}
            />
        </Dialog>
    );
}
