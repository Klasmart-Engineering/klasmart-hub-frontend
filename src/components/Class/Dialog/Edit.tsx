import React,
{
    useEffect,
    useState,
} from "react";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import { Class } from "@/types/graphQL";
import ClassDialogForm from "./Form";
import {
    useDeleteClass,
    useEditSchools,
    useUpdateClass,
} from "@/api/classes";
import {
    Dialog,
    useSnackbar,
} from "kidsloop-px";
import { buildEmptyClass } from "@/utils/classes";
import { useIntl } from "react-intl";
import { getPermissionState } from "@/utils/checkAllowed";

const useStyles = makeStyles((theme) => createStyles({}));

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
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ editedClass, setEditedClass ] = useState(buildEmptyClass());
    const [ valid, setValid ] = useState(true);
    const [ updateClass, { loading: loadingSave } ] = useUpdateClass();
    const [ deleteClass, { loading: loadingDelete } ] = useDeleteClass();
    const [ editSchools, { loading: loadingEditSchools } ] = useEditSchools();
    const { organization_id } = organization;
    const canEditSchool = getPermissionState(
        organization_id,
        `edit_school_20330`,
    );
    const loadingUpdateClass = loadingSave || loadingEditSchools;

    useEffect(() => {
        setEditedClass(value ?? buildEmptyClass());
    }, [ value ]);

    const handleSave = async () => {
        try {
            await updateClass(editedClass);
            if (canEditSchool) {
                await editSchools(editedClass);
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
            await deleteClass(editedClass.class_id);
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
                    loading: loadingDelete,
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
                    loading: loadingUpdateClass,
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
