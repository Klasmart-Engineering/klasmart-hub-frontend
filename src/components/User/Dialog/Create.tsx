import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core";
import { OrganizationMembership } from "@/types/graphQL";
import UserDialogForm from "./Form";
// import { useCreateUser } from "@/api/users";
import { Dialog } from "kidsloop-px";
import { useReactiveVar } from "@apollo/client";
import { currentMembershipVar } from "@/cache";
import { buildEmptyOrganizationMembership } from "@/utils/organizationMemberships";
import { useCreateOrganizationMembership } from "@/api/organizationMemberships";

const useStyles = makeStyles((theme) => createStyles({
}));

interface Props {
    open: boolean
    onClose: (value?: OrganizationMembership) => void
}

export default function CreateUserDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const [ valid, setValid ] = useState(true);
    const [ newOrganizationMembership, setNewOrganizationMembership ] = useState(buildEmptyOrganizationMembership());
    const [ createOrganizationMembership, { loading: loadingCreate } ] = useCreateOrganizationMembership();

    useEffect(() => {
        if (!open) return;
        setNewOrganizationMembership(buildEmptyOrganizationMembership());
    }, [open]);

    const handleCreate = async () => {
        try {
            await createOrganizationMembership(newOrganizationMembership);
            onClose(newOrganizationMembership);
            // enqueueSnackbar("User has been created succesfully", { variant: "success" });
        } catch (error) {
            // enqueueSnackbar("Sorry, something went wrong, please try again", { variant: "error" });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => onClose()}
            title="Create user"
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
            <UserDialogForm
                value={newOrganizationMembership}
                onChange={(value) => setNewOrganizationMembership(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}