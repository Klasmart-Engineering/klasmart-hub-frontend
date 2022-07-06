import {
    Errors,
    State,
} from "./Form";
import {
    APIErrorCode,
    APIErrorDetails,
    filterAPIErrors,
} from "@/api/errors";
import {
    emailAddressRegex,
    phoneNumberRegex,
} from "@/utils/validations";
import { ApolloError } from "@apollo/client";
import { updatedDiff } from "deep-object-diff";
import { IntlShape } from "react-intl";

function contactInfoStringToEmailPhoneObject (contactInfo: string) {
    return {
        email: emailAddressRegex.test(contactInfo) ? contactInfo : undefined,
        phone: phoneNumberRegex.test(contactInfo) ? contactInfo : undefined,
    };
}

export function mapFormStateToOrganizationMembership (state: State) {
    /* eslint-disable @typescript-eslint/naming-convention */
    const organization_role_ids = state.roles.map((role)=>role.value);
    const school_ids = state.schools.map((school)=>school.value);
    const {
        givenName: given_name,
        familyName: family_name,
        birthday: date_of_birth,
        alternativeEmail: alternate_email,
        alternativePhone: alternate_phone,
        contactInfo,
        shortcode,
        gender,
    } = state;
    /* eslint-enable @typescript-eslint/naming-convention */
    // organization_role_ids
    const emailAndPhone = contactInfoStringToEmailPhoneObject(contactInfo);
    return {
        given_name,
        family_name,
        date_of_birth,
        organization_role_ids,
        school_ids,
        alternate_email,
        alternate_phone,
        shortcode,
        gender,
        ...emailAndPhone,
    };
}

const uniqueUserFields = new Set<keyof State>([
    `givenName`,
    `familyName`,
    `contactInfo`,
]);

const getChangedFields = (formState: State, newFormState: State) => {
    return new Set(Object.keys(updatedDiff(formState, newFormState)) as Array<keyof State>);
};

export function updatedFormErrors (formState: State,
    newFormState: State,
    formErrors: Errors) {
    // Once a field with a formError is changed, the error should be cleared
    const changedFields = getChangedFields(formState, newFormState);
    return Object.fromEntries((
            Object.entries(formErrors) as Array<[keyof State, APIErrorDetails]>
    ).filter(([ key, value ]) => {
        // Field was changed directly, error should be removed
        if (changedFields.has(key)) return false;
        if (
            uniqueUserFields.has(key) &&
                value.code === APIErrorCode.ERR_DUPLICATE_ENTITY &&
                Array.from(uniqueUserFields)
                    .some((field) =>
                        changedFields.has(field))
        ) {
            // One of the 3 fields which make a unique User was changed, error state of all 3 can be cleared
            return false;
        }
        // Field wasn't changed, and no special case handling, so error should be kept
        return true;
    }));
}

export function hasDuplicateShortcodeError (apiErrors: APIErrorDetails[]) {
    return apiErrors.find(details => details.code === APIErrorCode.ERR_DUPLICATE_CHILD_ENTITY && details?.entity === `OrganizationMembership`);
}

export function hasDuplicateUserError (apiErrors: APIErrorDetails[]) {
    return apiErrors.find(details => [ APIErrorCode.ERR_DUPLICATE_ENTITY, APIErrorCode.ERR_DUPLICATE_CHILD_ENTITY ].includes(details.code) && details?.entity === `User`);
}
/**
 * Handle specific errors from the backend, setting the corresponding fields to invalid.
 * These fields must be changed before the form will be valid again.
 * Default to a generic error snackbar if not one of the expected server errors
 */

export function handleSubmitError ({ error, localization: { intl, genericErrorMessageId } }: {
    error: ApolloError;
    localization: {
        intl: IntlShape;
        genericErrorMessageId: string;
    };
}) {
    const apiErrors = filterAPIErrors(error);
    const newFormErrors: Errors = {};
    let hasExpectedError = false;
    let snackbarMessage;
    if (hasDuplicateShortcodeError(apiErrors)) {
        newFormErrors.shortcode = {
            code: APIErrorCode.ERR_DUPLICATE_ENTITY,
            message: intl.formatMessage({
                id: `validation.error.shortCode.duplicate`,
            }),
        };
        hasExpectedError = true;
    }

    if (hasDuplicateUserError(apiErrors)) {
        ([
            `givenName`,
            `familyName`,
            `contactInfo`,
        ] as (keyof State)[]).forEach((field) => {
            newFormErrors[field] = {
                code: APIErrorCode.ERR_DUPLICATE_ENTITY,
                message: ` `,
            };
        });
        snackbarMessage = intl.formatMessage({
            id: `validation.error.user.duplicate`,
        });
        hasExpectedError = true;
    }

    if (!hasExpectedError) {
        console.error(apiErrors);
        snackbarMessage = intl.formatMessage({
            id: genericErrorMessageId,
        });
    }

    return {
        hasExpectedError,
        newFormErrors,
        snackbarMessage,
    };
}
