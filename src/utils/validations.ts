import { validations } from "@kl-engineering/kidsloop-px";
import { format } from 'date-fns';
import { useIntl } from "react-intl";

export function alphanumeric (name: string): boolean {
    const regularExpression = /[^a-zA-Z0-9\s]/;
    return regularExpression.test(name);
}

export const phoneNumberRegex = /^\++?[1-9][0-9]\d{6,14}$/;

export const emailAddressRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const formatPermissionName = (str: string) =>
    str.replace(/[^A-Za-z]+/g, ` `)
        .replace(/(?:^|\s|[_"'([{])+\S/g, (match) => match.toUpperCase());

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
        letternumeric: (errorMessage?: string) => validations.letternumeric(errorMessage ?? intl.formatMessage({
            id: `genericValidations_letternumeric`,
        })),
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
        emailOrPhone: (emailErrorMessage?: string, phoneErrorMessage?: string) => validations.emailOrPhone(emailErrorMessage ?? intl.formatMessage({
            id: `genericValidations_emailInvalid`,
        }), phoneErrorMessage ?? intl.formatMessage({
            id: `genericValidations_phoneInvalid`,
        })),
        notEquals: (value: string, errorMessage?: string) => validations.notEquals(value, errorMessage ?? intl.formatMessage({
            id: `genericValidations_notEquals`,
        })),
        afterDate: (min: Date, errorMessage?: string) => validations.afterDate(min, errorMessage ?? intl.formatMessage({
            id: `genericValidations_afterDateError`,
        }, {
            value: format(min, `MMMM yyyy`),
        })),
        beforeDate: (max: Date, errorMessage?: string) => validations.beforeDate(max, errorMessage ?? intl.formatMessage({
            id: `genericValidations_beforeDateError`,
        }, {
            value: format(max, `MMMM yyyy`),
        })),
    };
};
