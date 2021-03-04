import ClassDialogForm from "./Form";
import { useCreateClass } from "@/api/classes";
import { currentMembershipVar } from "@/cache";
import { Class } from "@/types/graphQL";
import { buildEmptyClass } from "@/utils/classes";
import { useReactiveVar } from "@apollo/client";
import {
    Dialog,
    useSnackbar,
} from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

interface Props {
    open: boolean;
    onClose: (value?: Class) => void;
}

export default function CreateClassDialog (props: Props) {
    const { open, onClose } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const [ valid, setValid ] = useState(true);
    const [ newClass, setNewClass ] = useState(buildEmptyClass());
    const [ createClass ] = useCreateClass();

    useEffect(() => {
        if (!open) return;
        setNewClass(buildEmptyClass());
    }, [ open ]);

    const handleCreate = async () => {
        try {
            const { class_name, schools } = newClass;
            await createClass({
                variables: {
                    organization_id,
                    class_name: class_name ?? ``,
                    school_ids: schools?.map((school) => school.school_id) ?? [],
                },
            });
            onClose(newClass);
            enqueueSnackbar(intl.formatMessage({
                id: `classes_classSavedMessage`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `classes_classSaveError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title="Create class"
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
                    onClick: () => console.log(`create`),
                },
            ]}
            onClose={() => onClose()}
        >
            <ClassDialogForm
                value={newClass}
                onChange={(value) => setNewClass(value)}
                onValidation={setValid} />
        </Dialog>
    );
}
