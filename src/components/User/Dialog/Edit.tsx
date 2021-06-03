import UserDialogForm from "./Form";
import {
    useDeleteOrganizationMembership,
    useGetOrganizationMembership,
    useUpdateOrganizationMembership,
} from "@/api/organizationMemberships";
import { useCurrentOrganization } from "@/store/organizationMemberships";
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
    userId?: string;
    onClose: (didEdit?: boolean) => void;
}

export default function EditUserDialog (props: Props) {
    const {
        open,
        userId,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ initOrganizationMembership, setInitOrganizationMembership ] = useState(buildEmptyOrganizationMembership());
    const [ editedOrganizationMembership, setEditedOrganizationMembership ] = useState(buildEmptyOrganizationMembership());
    const [ valid, setValid ] = useState(true);
    const organization = useCurrentOrganization();
    const [ getOrganizationMembership, { data: organizationMembershipData, loading: loadingMembershipData } ] = useGetOrganizationMembership({
        fetchPolicy: `cache-and-network`,
    });
    const [ updateOrganizationMembership ] = useUpdateOrganizationMembership();
    const [ deleteOrganizationMembership ] = useDeleteOrganizationMembership();

    useEffect(() => {
        if (!open || !userId || !organization) return;
        setInitOrganizationMembership(organizationMembershipData?.user.membership ?? buildEmptyOrganizationMembership());
        setEditedOrganizationMembership(buildEmptyOrganizationMembership());
        getOrganizationMembership({
            variables: {
                organizationId: organization?.organization_id ?? ``,
                userId: userId ?? ``,
            },
        });
    }, [
        open,
        userId,
        organization,
    ]);

    useEffect(() => {
        const organizationMembership = organizationMembershipData?.user.membership;
        if (!organizationMembership) return;
        setInitOrganizationMembership(organizationMembership);
    }, [ organizationMembershipData ]);

    const handleEdit = async () => {
        try {
            const {
                organization_id,
                user,
                roles,
                schoolMemberships,
                shortcode,
            } = editedOrganizationMembership;
            await updateOrganizationMembership({
                variables: {
                    user_id: userId ?? ``,
                    organization_id,
                    organization_role_ids: roles?.map((r) => r.role_id) ?? [],
                    school_ids: schoolMemberships?.map((s) => s.school_id) ?? [],
                    given_name: user?.given_name,
                    family_name: user?.family_name,
                    email: user?.email,
                    phone: user?.phone,
                    date_of_birth: user?.date_of_birth ?? ``,
                    alternate_email: user?.alternate_email ?? ``,
                    alternate_phone: user?.alternate_phone ?? ``,
                    gender: user?.gender ?? ``,
                    shortcode: shortcode ?? ``,
                },
            });
            onClose(true);
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
        if (!userId) return;
        const { given_name, family_name } = organizationMembershipData?.user.membership.user ?? {};
        const userName = `${given_name} ${family_name}`;
        if (!confirm(intl.formatMessage({
            id: `editDialog_deleteConfirm`,
        }, {
            userName,
        }))) return;

        const { organization_id } = editedOrganizationMembership;

        try {
            await deleteOrganizationMembership({
                variables: {
                    organization_id,
                    user_id: userId,
                },
            });
            onClose(true);
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
                    disabled: !valid || loadingMembershipData,
                    onClick: handleEdit,
                },
            ]}
            onClose={() => onClose()}
        >
            <UserDialogForm
                value={initOrganizationMembership}
                onChange={setEditedOrganizationMembership}
                onValidation={setValid}
            />
        </Dialog>
    );
}
