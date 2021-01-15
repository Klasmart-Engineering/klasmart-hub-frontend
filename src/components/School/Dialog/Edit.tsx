import React,
{
    useEffect,
    useState,
} from "react";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import { School } from "@/types/graphQL";
import SchoolDialogForm from "./Form";
import {
    Dialog,
    useSnackbar,
} from "kidsloop-px";
import { buildEmptySchool } from "@/utils/schools";
import {
    useDeleteSchool,
    useUpdateSchool,
} from "@/api/schools";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    open: boolean;
    value?: School;
    onClose: (value?: School) => void;
}

export default function EditSchoolDialog (props: Props) {
    const {
        open,
        value,
        onClose,
    } = props;
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [ editedSchool, setEditedSchool ] = useState(buildEmptySchool());
    const [ valid, setValid ] = useState(true);
    const [ updateSchool, { loading: loadingSave } ] = useUpdateSchool();
    const [ deleteSchool, { loading: loadingDelete } ] = useDeleteSchool();

    useEffect(() => {
        setEditedSchool(value ?? buildEmptySchool());
    }, [ value ]);

    const handleSave = async () => {
        const { school_name } = editedSchool;
        if (!value) return;
        const { school_id } = value;
        try {
            await updateSchool({
                variables: {
                    school_id,
                    school_name: school_name ?? ``,
                },
            });
            onClose(editedSchool);
            enqueueSnackbar(`School has been saved succesfully`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${value?.school_name}"?`)) return;
        if (!value) return;
        const { school_id } = value;
        try {
            await deleteSchool({
                variables: {
                    school_id,
                },
            });
            onClose(editedSchool);
            enqueueSnackbar(`School has been deleted succesfully`, {
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
            <SchoolDialogForm
                value={editedSchool}
                acceptableSchoolName={value?.school_name}
                onChange={(value) => setEditedSchool(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}
