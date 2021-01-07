import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core";
import { Class } from "@/types/graphQL";
import ClassDialogForm from "./Form";
import { useCreateClass } from "@/api/classes";
import { Dialog, useSnackbar } from "kidsloop-px";
import { buildEmptyClass } from "@/utils/classes";
import { useReactiveVar } from "@apollo/client";
import { currentMembershipVar } from "@/cache";
import { useGetSchools } from "@/api/schools";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
}));

interface Props {
    open: boolean
    onClose: (value?: Class) => void
}

export default function CreateClassDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl()
    const { enqueueSnackbar } = useSnackbar()
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const { data } = useGetSchools(organization_id);
    const [ valid, setValid ] = useState(true);
    const [ newClass, setNewClass ] = useState<Class>(buildEmptyClass());
    const [ createClass, { loading: loadingCreate } ] = useCreateClass();

    useEffect(() => {
        if (!open) return;
        setNewClass(buildEmptyClass());
    }, [open]);

    const handleCreate = async () => {
        try {
            const schools = data?.me.membership?.organization?.schools ?? [];
            await createClass(newClass, organization_id, schools);
            onClose(newClass);
            enqueueSnackbar(intl.formatMessage({ id: "classes_classSavedMessage" }), { variant: "success" })
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({ id: "classes_classSaveError" }), { variant: "error" })
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => onClose()}
            title="Create class"
            actions={[
                {
                    label: "Cancel",
                    color: "primary",
                    onClick: () => onClose(),
                },
                {
                    label: "Create",
                    color: "primary",
                    loading: loadingCreate,
                    disabled: !valid,
                    onClick: handleCreate,
                },
            ]}
        >
            <ClassDialogForm
                value={newClass}
                onChange={(value) => setNewClass(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}