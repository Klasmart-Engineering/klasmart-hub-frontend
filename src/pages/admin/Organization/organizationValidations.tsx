import { FormValues } from "../../../models/FormValues";
import { constantValues } from "../constants";

export const organizationValidations = (values: FormValues) => {
    const errors: any = {};
    if (!values.organization_name) {
        errors.organization_name = "The organization name is required.";
    } else if (
        !constantValues.alphanumericNameOrganization.test(
            String(values.organization_name).toLowerCase(),
        )
    ) {
        errors.organization_name = "Name of organization is invalid.";
    } else if (values.organization_name.length > 30) {
        errors.organization_name = "Max length 30 of characters.";
    } else if (values.organization_name.length < 3) {
        errors.organization_name = "Min length 3 of characters.";
    }

    if (!values.address1) {
        errors.address1 = "The first address is required";
    } else if (
        !constantValues.alphanumericAddressValidation.test(
            String(values.address1).toLowerCase(),
        )
    ) {
        errors.address1 = "The first address is invalid.";
    } else if (values.address1.length > 60) {
        errors.address1 = "Max length 60 of characters.";
    }

    if (values.address2) {
        if (
            !constantValues.alphanumericAddressValidation.test(
                String(values.address2).toLowerCase(),
            )
        ) {
            errors.address2 = "The second address is invalid";
        } else if (values.address2.length > 60) {
            errors.address2 = "Max length 60 of characters.";
        }
    }

    if (!values.email) {
        errors.email = "The organization email is required";
    } else if (values.email.length > 50) {
        errors.email = "Max length 50 of characters.";
    } else if (
        !constantValues.emailValidation.test(String(values.email).toLowerCase())
    ) {
        errors.email = "The organization email address is invalid";
    }

    if (
        Object.keys(values.logo).length === 0 &&
    values.logo.constructor === Object
    ) {
        errors.logo = "Organization logo is required";
    }

    if (!values.phone) {
        errors.phone = "The phone number is required";
    } else if (values.phone.length > 15) {
        errors.phone = "The phone number must have a maximum of 15 characters";
    } else if (values.phone.length < 10) {
        errors.phone = "The phone number must have a minimum of 10 characters";
    }

    return errors;
};
