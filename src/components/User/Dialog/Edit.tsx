import UserDialogForm,
{
    defaultState,
    Errors,
    State,
} from "./Form";
import {
    handleSubmitError,
    mapFormStateToOrganizationMembership,
    updatedFormErrors,
} from "./shared";
import {
    UpdateOrganizationMembershipRequest,
    useDeleteOrganizationMembership,
    useGetOrganizationMembership,
    useUpdateOrganizationMembership,
} from "@/api/organizationMemberships";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    isActive,
    OrganizationMembership,
    Status,
} from "@/types/graphQL";
import { useDeleteEntityPrompt } from "@/utils/common";
import { ApolloError } from "@apollo/client";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import {
    Dialog,
    useSnackbar,
} from "kidsloop-px";
import { isEmpty } from "lodash";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({}));

export function mapOrganizationMembershipToFormState (membership: OrganizationMembership): State {
    const user = membership.user;
    return {
        givenName: user?.given_name ?? ``,
        familyName: user?.family_name ?? ``,
        contactInfo: user?.email ?? user?.phone ?? ``,
        birthday: user?.date_of_birth ?? ``,
        gender: user?.gender ?? ``,
        alternativeEmail: user?.alternate_email ?? ``,
        alternativePhone: user?.alternate_phone ?? ``,
        shortcode: membership.shortcode ?? ``,
        schools: membership.schoolMemberships?.filter(schoolMembership => schoolMembership?.school?.status === Status.ACTIVE)?.map(school => school.school_id) ?? [],
        roles: membership.roles?.filter(isActive)?.map(role => role.role_id) ?? [],
    };
}

export function mapFormStateToUpdateOrganizationMembershipRequest (state: State, userId: string, organizationId: string): UpdateOrganizationMembershipRequest {
    const membershipInfo = mapFormStateToOrganizationMembership(state);
    return {
        ...membershipInfo,
        organization_id: organizationId,
        user_id: userId,
    };
}

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
    const deletePrompt = useDeleteEntityPrompt();
    const { enqueueSnackbar } = useSnackbar();
    const [ initialFormState, setInitialFormState ] = useState<State>(defaultState);
    const [ formState, setFormState ] = useState<State>(defaultState);
    const [ formErrors, setFormErrors ] = useState<Errors>({});
    const [ valid, setValid ] = useState(true);
    const organization = useCurrentOrganization();
    const { data: organizationMembershipData, loading: loadingMembershipData } = useGetOrganizationMembership({
        fetchPolicy: `cache-and-network`,
        variables: {
            organizationId: organization?.organization_id ?? ``,
            userId: userId ?? ``,
        },
        skip: !open || !organization?.organization_id || !userId,
    });
    const [ updateOrganizationMembership ] = useUpdateOrganizationMembership();
    const [ deleteOrganizationMembership ] = useDeleteOrganizationMembership();

    const organizationMembership = organizationMembershipData?.user.membership;

    useEffect(() => {
        if (!open || !userId || !organization) return;
        const state = organizationMembership ? mapOrganizationMembershipToFormState(organizationMembership) : defaultState;
        setInitialFormState(state);
        setFormState(state);
        setFormErrors({});
    }, [
        open,
        userId,
        organization?.organization_id,
    ]);

    useEffect(() => {
        if (!organizationMembership) return;
        const state = mapOrganizationMembershipToFormState(organizationMembership);
        setInitialFormState(state);
        setFormState(state);
    }, [ organizationMembershipData ]);

    const onChange = (newFormState: State) => {
        if (!isEmpty(formErrors)) {
            const newFormErrors = updatedFormErrors(formState, newFormState, formErrors);
            setFormErrors(newFormErrors);
        }
        setFormState(newFormState);
    };

    const handleEditError = (error: ApolloError) => {
        const {
            hasExpectedError,
            newFormErrors,
            snackbarMessage,
        } = handleSubmitError({
            error,
            localization: {
                intl,
                genericErrorMessageId: `editDialog_savedError`,
            },
        });

        if (snackbarMessage) {
            enqueueSnackbar(snackbarMessage, {
                variant: `error`,
            });
        }

        setFormErrors(newFormErrors);

        if (hasExpectedError) {
            setValid(false);
        }
    };

    const handleEdit = async () => {
        try {
            const variables = mapFormStateToUpdateOrganizationMembershipRequest(formState, userId ?? ``, organization?.organization_id ?? ``);
            await updateOrganizationMembership({
                variables,
            });
            onClose(true);
            enqueueSnackbar(intl.formatMessage({
                id: `editDialog_savedSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            handleEditError(error);
        }
    };

    const handleDelete = async () => {
        if (!(userId && organization?.organization_id)) return;
        const { given_name, family_name } = organizationMembershipData?.user.membership.user ?? {};
        const userName = `${given_name} ${family_name}`;
        if (!await deletePrompt({
            title: intl.formatMessage({
                id: `users_deleteTitle`,
            }),
            entityName: userName,
        })) return;
        try {
            await deleteOrganizationMembership({
                variables: {
                    organization_id: organization.organization_id,
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
                initialState={initialFormState}
                isExistingUser={true}
                errors={formErrors}
                onChange={onChange}
                onValidation={setValid}
            />
        </Dialog>
    );
}
