import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core";
import { Class } from "@/types/graphQL";
import ClassDialogForm from "./Form";
import { useUpdateClass, useDeleteClass } from "@/api/classes";
import { Dialog } from "kidsloop-px";
import { buildEmptyClass } from "@/utils/classes";
import { useGetSchools } from "@/api/schools";
import { useReactiveVar } from "@apollo/client";
import { currentMembershipVar } from "@/cache";

const useStyles = makeStyles((theme) => createStyles({
}));

interface Props {
    open: boolean
    value?: Class
    onClose: (value?: Class) => void
}

export default function EditClassDialog (props: Props) {
    const {
        open,
        value,
        onClose,
    } = props;
    const classes = useStyles();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const { data } = useGetSchools(organization_id);
    const [ editedClass, setEditedClass ] = useState<Class>(buildEmptyClass());
    const [ valid, setValid ] = useState(true);
    const [ updateClass, { loading: loadingSave } ] = useUpdateClass();
    const [ deleteClass, { loading: loadingDelete } ] = useDeleteClass();
    
    useEffect(() => {
        setEditedClass(value ?? buildEmptyClass());
    }, [value]);

    const handleSave = async () => {
        try {
            const schools = data?.me.membership?.organization?.schools ?? [];
            await updateClass(editedClass, schools);
            // TODO (Henrik): show snackbar message intl.formatMessage({ id: "classes_classSavedMessage" })
            onClose(editedClass);
        } catch (error) {
            console.error(error);
            // TODO (Henrik): show snackbar message intl.formatMessage({ id: "classes_classSaveError" })
        }
    };
    
    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${value?.class_name}"?`)) return;
        try {
            await deleteClass(editedClass.class_id);
            // TODO (Henrik): show snackbar message intl.formatMessage({ id: "classes_classDeletedMessage" })
            onClose(editedClass);
        } catch (error) {
            console.error(error);
            // TODO (Henrik): show snackbar message intl.formatMessage({ id: "classes_classDeletedError" })
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => onClose()}
            title="Edit class"
            actions={[
                {
                    label: "Delete",
                    color: "error",
                    align: "left",
                    loading: loadingDelete,
                    onClick: handleDelete,
                },
                {
                    label: "Cancel",
                    color: "primary",
                    align: "right",
                    onClick: () => onClose(),
                },
                {
                    label: "Save",
                    color: "primary",
                    align: "right",
                    loading: loadingSave,
                    disabled: !valid,
                    onClick: handleSave,
                },
            ]}
        >
            <ClassDialogForm
                value={editedClass}
                onChange={(value) => setEditedClass(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}