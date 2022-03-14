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
    useDeleteUsersInOrganization,
    useGetOrganizationUserNode,
    useUpdateOrganizationMembership,
} from "@/api/organizationMemberships";
import { UserNode } from "@/api/users";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    isActive,
    Status,
} from "@/types/graphQL";
import { useDeleteEntityPrompt } from "@/utils/common";
import { ApolloError } from "@apollo/client";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
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

export function mapUserNodeToFormState (user: UserNode): State {
    return {
        givenName: user?.givenName ?? ``,
        familyName: user?.familyName ?? ``,
        contactInfo: user?.contactInfo?.email ?? user?.contactInfo?.phone ?? ``,
        birthday: user?.dateOfBirth ?? ``,
        gender: user?.gender ?? ``,
        alternativeEmail: user?.alternateContactInfo?.email ?? ``,
        alternativePhone: user?.alternateContactInfo?.phone ?? ``,
        shortcode: user.organizationMembershipsConnection?.edges[0]?.node.shortCode ?? ``,
        schools: user.schools?.filter(school => school?.status === Status.ACTIVE)?.map(school => school.id ?? ``) ?? [],
        roles: user.roles?.filter(isActive)?.map(role => role.id ?? ``) ?? [],
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
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;
    const { data: organizationMembershipData, loading: loadingMembershipData } = useGetOrganizationUserNode({
        fetchPolicy: `cache-and-network`,
        variables: {
            userId: userId ?? ``,
            organizationId,
        },
        skip: !open || !organizationId || !userId,
    });

    const [ updateOrganizationMembership ] = useUpdateOrganizationMembership();
    const [ deleteUserInOrganization ] = useDeleteUsersInOrganization();

    useEffect(() => {
        if (!open || !userId || !organizationId) return;
        const state = organizationMembershipData?.userNode ? mapUserNodeToFormState(organizationMembershipData.userNode) : defaultState;
        setInitialFormState(state);
        setFormState(state);
        setFormErrors({});
    }, [
        open,
        userId,
        organizationId,
    ]);

    useEffect(() => {
        if (!organizationMembershipData) return;
        const state = mapUserNodeToFormState(organizationMembershipData.userNode);
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
            const variables = mapFormStateToUpdateOrganizationMembershipRequest(formState, userId ?? ``, organizationId ?? ``);
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
        if (!userId || !organizationId) return;
        const { givenName, familyName } = organizationMembershipData?.userNode ?? {};
        const userName = `${givenName} ${familyName}`;
        if (!(await deletePrompt({
            title: intl.formatMessage({
                id: `users_deleteTitle`,
            }),
            entityName: userName,
        }))) return;
        try {
            await deleteUserInOrganization({
                variables: {
                    organizationId,
                    userIds: [ userId ],
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
