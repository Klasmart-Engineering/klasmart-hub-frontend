import UserDialogForm from "./Form";
import {
    useDeleteOrganizationMembership,
    useUpdateOrganizationMembership,
} from "@/api/organizationMemberships";
import { OrganizationMembership } from "@/types/graphQL";
import { buildEmptyOrganizationMembership } from "@/utils/organizationMemberships";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
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

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    open: boolean;
    value?: OrganizationMembership;
    onClose: (value?: OrganizationMembership) => void;
}

export default function EditUserDialog (props: Props) {
    const {
        open,
        value,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ editedOrganizationMembership, setEditedOrganizationMembership ] = useState(buildEmptyOrganizationMembership());
    const [ valid, setValid ] = useState(true);
    const [ updateOrganizationMembership ] = useUpdateOrganizationMembership();
    const [ deleteOrganizationMembership ] = useDeleteOrganizationMembership();

    useEffect(() => {
        setEditedOrganizationMembership(value ?? buildEmptyOrganizationMembership());
    }, [ value ]);

    const handleSave = async () => {
        try {
            const {
                organization_id,
                user,
                roles,
                schoolMemberships,
            } = editedOrganizationMembership;
            await updateOrganizationMembership({
                variables: {
                    organization_id,
                    organization_role_ids: roles?.map((r) => r.role_id) ?? [],
                    school_ids: schoolMemberships?.map((s) => s.school_id) ?? [],
                    given_name: user?.given_name,
                    family_name: user?.family_name,
                    email: user?.email,
                    phone: user?.phone,
                },
            });
            onClose(editedOrganizationMembership);
            enqueueSnackbar(intl.formatMessage({
                id: `editDialog_savedSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `editDialog_savedError`,
            }), {
                variant: `error`,
            });
        }
    };

    const handleDelete = async () => {
        const userName = `${value?.user?.given_name} ${value?.user?.family_name}`;
        if (!confirm(intl.formatMessage({
            id: `editDialog_deleteConfirm`,
        }, {
            userName,
        }))) return;

        const {
            organization_id,
            user_id,
        } = editedOrganizationMembership;
        try {
            await deleteOrganizationMembership({
                variables: {
                    organization_id,
                    user_id,
                },
            });
            onClose(editedOrganizationMembership);
            enqueueSnackbar(intl.formatMessage({
                id: `editDialog_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `editDialog_deleteError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title="Edit user"
            actions={[
                {
                    label: intl.formatMessage({
                        id: `editDialog_delete`,
                    }),
                    color: `error`,
                    align: `left`,
                    onClick: handleDelete,
                },
                {
                    label: intl.formatMessage({
                        id: `editDialog_cancel`,
                    }),
                    color: `primary`,
                    align: `right`,
                    onClick: () => onClose(),
                },
                {
                    label: intl.formatMessage({
                        id: `editDialog_save`,
                    }),
                    color: `primary`,
                    align: `right`,
                    disabled: !valid,
                    onClick: handleSave,
                },
            ]}
            onClose={() => onClose()}
        >
            <UserDialogForm
                value={editedOrganizationMembership}
                onChange={(value) => setEditedOrganizationMembership(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}
