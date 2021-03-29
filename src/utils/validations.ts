import { validations } from "kidsloop-px";
import { useIntl } from "react-intl";

export function alphanumeric (name: string): boolean {
    const regularExpression = /[^a-zA-Z0-9\s]/;
    return regularExpression.test(name);
}

export const phoneNumberRegex = /^\++?[1-9][0-9]\d{6,14}$/;

export const emailAddressRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const formatPermissionName = (str: string) =>
    str.replace(/[^A-Za-z]+/g, ` `).replace(/(?:^|\s|[_"'([{])+\S/g, (match) => match.toUpperCase());

export const useValidations = () => {
    const intl = useIntl();
    return {
        alphanumeric: (errorMessage?: string) => validations.alphanumeric(errorMessage ?? intl.formatMessage({
            id: `genericValidations_alphanumeric`,
        })),
        equals: (value: any, errorMessage?: string) => validations.equals(value, errorMessage ?? intl.formatMessage({
            id: `genericValidations_equals`,
        })),
        email: (errorMessage?: string) => validations.email(errorMessage ?? intl.formatMessage({
            id: `genericValidations_emailInvalid`,
        })),
        letternumeric: (errorMessage?: string) => validations.letternumeric(errorMessage ?? `The value contains invalid characters`),
        max: (max: number, errorMessage?: string) => validations.max(max, errorMessage ?? intl.formatMessage({
            id: `genericValidations_maxChar`,
        }, {
            max,
        })),
        min: (min: number, errorMessage?: string) => validations.min(min, errorMessage ?? intl.formatMessage({
            id: `genericValidations_minChar`,
        }, {
            min,
        })),
        phone: (errorMessage?: string) => validations.phone(errorMessage ?? intl.formatMessage({
            id: `genericValidations_phoneInvalid`,
        })),
        required: (errorMessage?: string) => validations.required(errorMessage ?? intl.formatMessage({
            id: `genericValidations_required`,
        })),
        emailOrPhone: (errorMessage?: string) => validations.emailOrPhone(errorMessage ?? intl.formatMessage({
            id: `genericValidations_emailInvalid`,
        })),
    };
};
