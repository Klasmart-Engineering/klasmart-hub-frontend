import React, { useEffect, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core";
import { OrganizationMembership } from "@/types/graphQL";
import UserDialogForm from "./Form";
// import { useCreateUser } from "@/api/users";
import { Dialog } from "kidsloop-px";
import { useReactiveVar } from "@apollo/client";
import { currentMembershipVar } from "@/cache";
import { useGetSchools } from "@/api/schools";
import { buildEmptyOrganizationMembership } from "@/utils/organizationMemberships";

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
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const { data } = useGetSchools(organization_id);
    const [ valid, setValid ] = useState(true);
    const [ newUser, setNewUser ] = useState<OrganizationMembership>(buildEmptyOrganizationMembership());
    // const [ createUser, { loading: loadingCreate } ] = useCreateUser();

    useEffect(() => {
        if (!open) return;
        setNewUser(buildEmptyOrganizationMembership());
    }, [open]);

    const handleCreate = async () => {
        try {
            const schools = data?.me.membership?.organization?.schools ?? [];
            // await createUser(newUser, organization_id, schools);
            // TODO (Henrik): show snackbar message intl.formatMessage({ id: "users_userDeletedMessage" })
            onClose(newUser);
        } catch (error) {
            console.error(error);
            // TODO (Henrik): show snackbar message intl.formatMessage({ id: "users_userDeletedError" })
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
                    // loading: loadingCreate,
                    disabled: !valid,
                    onClick: handleCreate,
                },
            ]}
        >
            <UserDialogForm
                value={newUser}
                onChange={(value) => setNewUser(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}