import { ApolloError } from "@apollo/client";
import { pick } from "lodash";

export const APIErrorMessage = `ERR_API_BAD_INPUT`;

export enum APIErrorCode {
    ERR_MISSING_REQUIRED_ENTITY_ATTRIBUTE = `ERR_MISSING_REQUIRED_ENTITY_ATTRIBUTE`,
    ERR_MISSING_REQUIRED_EITHER = `ERR_MISSING_REQUIRED_EITHER`,
    ERR_DUPLICATE_ENTITY = `ERR_DUPLICATE_ENTITY`,
    ERR_DUPLICATE_CHILD_ENTITY = `ERR_DUPLICATE_CHILD_ENTITY`,
    ERR_INVALID_MIN_LENGTH = `ERR_INVALID_MIN_LENGTH`,
    ERR_INVALID_MAX_LENGTH = `ERR_INVALID_MAX_LENGTH`,
    ERR_NON_EXISTENT_ENTITY = `ERR_NON_EXISTENT_ENTITY`,
    ERR_NON_EXISTENT_CHILD_ENTITY = `ERR_NON_EXISTENT_CHILD_ENTITY`,
    ERR_INVALID_ALPHANUMERIC_SPECIAL_CHARACTERS = `ERR_INVALID_ALPHANUMERIC_SPECIAL_CHARACTERS`,
    ERR_INVALID_ALPHABETIC = `ERR_INVALID_ALPHABETIC`,
    ERR_INVALID_ALPHANUMERIC = `ERR_INVALID_ALPHANUMERIC`,
    ERR_INVALID_DATE = `ERR_INVALID_DATE`,
    ERR_INVALID_EMAIL = `ERR_INVALID_EMAIL`,
    ERR_INVALID_PHONE = `ERR_INVALID_PHONE`,
    ERR_INVALID_UUID = `ERR_INVALID_UUID`,
    ERR_INVALID_USERNAME = `ERR_INVALID_USERNAME`,
    UNAUTHORIZED = `UNAUTHORIZED`,
    UNAUTHORIZED_UPLOAD_TO_ORGANIZATION = `UNAUTHORIZED_UPLOAD_TO_ORGANIZATION`,
    UNAUTHORIZED_UPLOAD_CHILD_ENTITY = `UNAUTHORIZED_UPLOAD_CHILD_ENTITY`
}

export interface APIErrorDetails {
    code: APIErrorCode;
    message: string;
    variables: string[];
    entity?: string;
    attribute?: string;
    otherAttribute?: string;
    organizationName?: string;
    entityName?: string;
    parentEntity?: string;
    parentName?: string;
    min?: string;
    max?: string;
    format?: string;
}

export function filterAPIErrors (error: ApolloError): APIErrorDetails[] {
    return error.graphQLErrors
        ?.filter(graphQLError => graphQLError.message === APIErrorMessage)
        .map(graphQLError => graphQLError.extensions?.exception.errors as Record<string, unknown>[])
        .flatMap(errors => {
            return errors.map(error => {
                // Filter out additional properties
                return pick(error, [
                    `code`,
                    `message`,
                    `variables`,
                    `entity`,
                    `attribute`,
                    `organizationName`,
                    `otherAttribute`,
                    `entityName`,
                    `parentEntity`,
                    `parentName`,
                    `min`,
                    `max`,
                    `format`,
                ]) as APIErrorDetails;
            });
        });
}
