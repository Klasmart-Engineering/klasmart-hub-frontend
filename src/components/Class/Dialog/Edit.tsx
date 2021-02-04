import ClassDialogForm from "./Form";
import {
    useDeleteClass,
    useEditClassSchools,
    useUpdateClass,
} from "@/api/classes";
import { Class } from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { buildEmptyClass } from "@/utils/classes";
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
    value?: Class;
    onClose: (value?: Class) => void;
}

export default function EditClassDialog(props: Props) {
    const {
        open,
        value,
        onClose,
    } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ editedClass, setEditedClass ] = useState(buildEmptyClass());
    const [ valid, setValid ] = useState(true);
    const [ updateClass ] = useUpdateClass();
    const [ deleteClass ] = useDeleteClass();
    const [ editSchools ] = useEditClassSchools();
    const canEditSchool = usePermission(`edit_school_20330`);

    useEffect(() => {
        setEditedClass(value ?? buildEmptyClass());
    }, [ value ]);

    const handleSave = async () => {
        try {
            const {
                class_id,
                class_name,
                schools,
            } = editedClass;
            await updateClass({
                variables: {
                    class_id,
                    class_name: class_name ?? ``,
                },
            });
            if (canEditSchool) {
                await editSchools({
                    variables: {
                        class_id,
                        school_ids:
                            schools?.map((school) => school.school_id) ?? [],
                    },
                });
            }

            onClose(editedClass);
            enqueueSnackbar(
                intl.formatMessage({
                    id: `classes_classSavedMessage`,
                }),
                {
                    variant: `success`,
                },
            );
        } catch (error) {
            enqueueSnackbar(
                intl.formatMessage({
                    id: `classes_classSaveError`,
                }),
                {
                    variant: `error`,
                },
            );
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${value?.class_name}"?`))
            return;
        try {
            const { class_id } = editedClass;
            await deleteClass({
                variables: {
                    class_id,
                },
            });
            onClose(editedClass);
            enqueueSnackbar(
                intl.formatMessage({
                    id: `classes_classDeletedMessage`,
                }),
                {
                    variant: `success`,
                },
            );
        } catch (error) {
            enqueueSnackbar(
                intl.formatMessage({
                    id: `classes_classDeletedError`,
                }),
                {
                    variant: `error`,
                },
            );
        }
    };

    return (
        <Dialog
            open={open}
            title="Edit class"
            actions={[
                {
                    label: `Delete`,
                    color: `error`,
                    align: `left`,
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
            <ClassDialogForm
                value={editedClass}
                onChange={(value) => setEditedClass(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}
