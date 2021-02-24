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
        alphanumeric: (errorMessage?: string) => validations.alphanumeric(errorMessage ?? `The value is not alphanumeric`),
        equals: (value: any, errorMessage?: string) => validations.equals(value, errorMessage ?? `The values don't match`),
        email: (errorMessage?: string) => validations.email(errorMessage ?? `Invalid email address`),
        max: (max: number, errorMessage?: string) => validations.max(max, errorMessage ?? `Input needs to be maximum ${max} characters`),
        min: (min: number, errorMessage?: string) => validations.min(min, errorMessage ?? `Input needs to be minimum ${min} characters`),
        phone: (errorMessage?: string) => validations.phone(errorMessage ?? `Invalid phone number`),
        required: (errorMessage?: string) => validations.required(errorMessage ?? `Required`),
    };
};
