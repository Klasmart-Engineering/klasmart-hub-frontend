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
    useUpdateClass,
} from "@/api/classes";
import {
    Dialog,
    useSnackbar,
} from "kidsloop-px";
import { buildEmptyClass } from "@/utils/classes";
import { useGetSchools } from "@/api/schools";
import { useReactiveVar } from "@apollo/client";
import { currentMembershipVar } from "@/cache";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    open: boolean;
    value?: Class;
    onClose: (value?: Class) => void;
}

export default function EditClassDialog (props: Props) {
    const {
        open,
        value,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const { data } = useGetSchools(organization_id);
    const [ editedClass, setEditedClass ] = useState(buildEmptyClass());
    const [ valid, setValid ] = useState(true);
    const [ updateClass, { loading: loadingSave } ] = useUpdateClass();
    const [ deleteClass, { loading: loadingDelete } ] = useDeleteClass();

    useEffect(() => {
        setEditedClass(value ?? buildEmptyClass());
    }, [ value ]);

    const handleSave = async () => {
        try {
            await updateClass(editedClass);
            onClose(editedClass);
            // enqueueSnackbar(intl.formatMessage({ id: "classes_classSavedMessage" }), { variant: "success" });
        } catch (error) {
            // enqueueSnackbar(intl.formatMessage({ id: "classes_classSaveError" }), { variant: "error" });
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${value?.class_name}"?`)) return;
        try {
            await deleteClass(editedClass.class_id);
            onClose(editedClass);
            // enqueueSnackbar(intl.formatMessage({ id: "classes_classDeletedMessage" }), { variant: "success" });
        } catch (error) {
            // enqueueSnackbar(intl.formatMessage({ id: "classes_classDeletedError" }), { variant: "error" });
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
                    loading: loadingSave,
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
