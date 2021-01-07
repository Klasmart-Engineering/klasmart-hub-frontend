import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core";
import { OrganizationMembership } from "@/types/graphQL";
import UserDialogForm from "./Form";
import { Dialog, useSnackbar } from "kidsloop-px";
import { useDeleteOrganizationMembership, useUpdateOrganizationMembership } from "@/api/organizationMemberships";
import { useIntl } from "react-intl";
import { buildEmptyOrganizationMembership } from "@/utils/organizationMemberships";

const useStyles = makeStyles((theme) => createStyles({
}));

interface Props {
    open: boolean
    value?: OrganizationMembership
    onClose: (value?: OrganizationMembership) => void
}

export default function EditUserDialog (props: Props) {
    const {
        open,
        value,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    // const { enqueueSnackbar } = useSnackbar();
    const [ editedOrganizationMembership, setEditedOrganizationMembership ] = useState(buildEmptyOrganizationMembership());
    const [ valid, setValid ] = useState(true);
    const [ updateOrganizationMembership, { loading: loadingSave } ] = useUpdateOrganizationMembership();
    const [ deleteOrganizationMembership, { loading: loadingDelete } ] = useDeleteOrganizationMembership();
    
    
    useEffect(() => {
        setEditedOrganizationMembership(value ?? buildEmptyOrganizationMembership());
    }, [value]);

    const handleSave = async () => {
        try {
            await updateOrganizationMembership(editedOrganizationMembership);
            onClose(editedOrganizationMembership);
            // enqueueSnackbar("User has been saved succesfully", { variant: "success" });
        } catch (error) {
            // enqueueSnackbar("Sorry, something went wrong, please try again", { variant: "error" });
        }
    };
    
    const handleDelete = async () => {
        const userName = `${value?.user?.given_name} ${value?.user?.family_name}`;
        if (!confirm(`Are you sure you want to delete "${userName}"?`)) return;
        try {
            await deleteOrganizationMembership(editedOrganizationMembership);
            onClose(editedOrganizationMembership);
            // enqueueSnackbar("User has been deleted succesfully", { variant: "success" });
        } catch (error) {
            // enqueueSnackbar("Sorry, something went wrong, please try again", { variant: "error" });
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
                    disabled: !valid,
                    loading: loadingSave,
                    onClick: handleSave,
                },
            ]}
        >
            <UserDialogForm
                value={editedOrganizationMembership}
                onChange={(value) => setEditedOrganizationMembership(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}