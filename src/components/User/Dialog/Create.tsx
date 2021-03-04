import UserDialogForm from "./Form";
import { useCreateOrganizationMembership } from "@/api/organizationMemberships";
import { currentMembershipVar } from "@/cache";
import { OrganizationMembership } from "@/types/graphQL";
import { buildEmptyOrganizationMembership } from "@/utils/organizationMemberships";
import { useReactiveVar } from "@apollo/client";
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
    onClose: (value?: OrganizationMembership) => void;
}

export default function CreateUserDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ valid, setValid ] = useState(true);
    const organization = useReactiveVar(currentMembershipVar);
    const [ newOrganizationMembership, setNewOrganizationMembership ] = useState(buildEmptyOrganizationMembership());
    const [ createOrganizationMembership ] = useCreateOrganizationMembership();

    useEffect(() => {
        if (!open) return;
        setNewOrganizationMembership(buildEmptyOrganizationMembership());
    }, [ open ]);

    const handleCreate = async () => {
        try {
            const {
                roles,
                schoolMemberships,
                user,
            } = newOrganizationMembership;
            const { organization_id } = organization;
            await createOrganizationMembership({
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
            onClose(newOrganizationMembership);
            enqueueSnackbar(intl.formatMessage({
                id: `createUser_createSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `createUser_createError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <Dialog
            open={open}
            title={intl.formatMessage({
                id: `createUser_title`,
            })}
            actions={[
                {
                    label: intl.formatMessage({
                        id: `createUser_cancel`,
                    }),
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: intl.formatMessage({
                        id: `createUser_create`,
                    }),
                    color: `primary`,
                    disabled: !valid,
                    onClick: handleCreate,
                },
            ]}
            onClose={() => onClose()}
        >
            <UserDialogForm
                value={newOrganizationMembership}
                onChange={(value) => setNewOrganizationMembership(value)}
                onValidation={setValid}
            />
        </Dialog>
    );
}
