import UserDialogForm, {
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
    CreateOrganizationMembershipRequest,
    useCreateOrganizationMembership,
} from "@/api/organizationMemberships";
import { useCurrentOrganization } from "@/store/organizationMemberships";
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

function mapFormStateToCreateOrganizationMembershipRequest (state: State, organizationId: string): CreateOrganizationMembershipRequest {
    const membershipInfo = mapFormStateToOrganizationMembership(state);
    return {
        organization_id: organizationId,
        ...membershipInfo,
    };
}

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    open: boolean;
    onClose: (didCreate?: boolean) => void;
}

export default function CreateUserDialog (props: Props) {
    const { open, onClose } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ valid, setValid ] = useState(true);
    const [ initialFormState, setInitialFormState ] = useState<State>(defaultState);
    const [ formState, setFormState ] = useState<State>(defaultState);
    const currentOrganization = useCurrentOrganization();
    const [ createOrganizationMembership ] = useCreateOrganizationMembership();
    const [ formErrors, setFormErrors ] = useState<Errors>({});

    useEffect(() => {
        if (!open) return;
        setInitialFormState(defaultState);
        setFormState(defaultState);
        setFormErrors({});
    }, [ open ]);

    const handleError = (error: ApolloError) => {
        const {
            hasExpectedError,
            newFormErrors,
            snackbarMessage,
        } = handleSubmitError({
            error,
            localization: {
                intl,
                genericErrorMessageId: `createUser_error`,
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

    const onChange = (newFormState: State) => {
        if (!isEmpty(formErrors)) {
            const newFormErrors = updatedFormErrors(formState, newFormState, formErrors);
            setFormErrors(newFormErrors);
        }
        setFormState(newFormState);
    };

    const handleCreate = async () => {
        try {
            const variables = mapFormStateToCreateOrganizationMembershipRequest(formState, currentOrganization?.id ?? ``);
            await createOrganizationMembership({
                variables,
            });
            enqueueSnackbar(intl.formatMessage({
                id: `createUser_success`,
            }), {
                variant: `success`,
            });
            onClose(true);
        } catch (error) {
            handleError(error);
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
                initialState={initialFormState}
                isExistingUser={false}
                errors={formErrors}
                onChange={onChange}
                onValidation={setValid}
            />
        </Dialog>
    );
}
