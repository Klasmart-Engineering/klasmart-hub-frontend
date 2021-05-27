import { ApolloError } from "@apollo/client";
import { SpreadsheetValidtionError } from "kidsloop-px/dist/types/components/Input/File/Spreadsheet/Base";
import { IntlShape } from "react-intl";

export const CSV_ACCEPT_TYPES = [
    `text/csv`,
    `text/x-csv`,
    `application/x-csv`,
    `application/csv`,
    `text/x-comma-separated-values`,
    `text/comma-separated-values`,
    `.csv`,
];

export enum CsvUploadErrorCode {
    ERR_CSV_BAD_INPUT = `ERR_CSV_BAD_INPUT`,
}

export enum CsvUploadEntityErrorCode {
    ERR_CSV_EMPTY_FILE = `ERR_CSV_EMPTY_FILE`,
    ERR_CSV_MISSING_REQUIRED = `ERR_CSV_MISSING_REQUIRED`,
    ERR_CSV_MISSING_REQUIRED_EITHER = `ERR_CSV_MISSING_REQUIRED_EITHER`,
    ERR_CSV_DUPLICATE_ENTITY = `ERR_CSV_DUPLICATE_ENTITY`,
    ERR_CSV_DUPLICATE_CHILD_ENTITY = `ERR_CSV_DUPLICATE_CHILD_ENTITY`,
    ERR_CSV_NONE_EXIST_ENTITY = `ERR_CSV_NONE_EXIST_ENTITY`,
    ERR_CSV_NONE_EXIST_CHILD_ENTITY = `ERR_CSV_NONE_EXIST_CHILD_ENTITY`,
    ERR_CSV_INVALID_ENUM = `ERR_CSV_INVALID_ENUM`,
    ERR_CSV_INVALID_MIN = `ERR_CSV_INVALID_MIN`,
    ERR_CSV_INVALID_MAX = `ERR_CSV_INVALID_MAX`,
    ERR_CSV_INVALID_BETWEEN = `ERR_CSV_INVALID_BETWEEN`,
    ERR_CSV_INVALID_ALPHA = `ERR_CSV_INVALID_ALPHA`,
    ERR_CSV_INVALID_ALPHA_NUM = `ERR_CSV_INVALID_ALPHA_NUM`,
    ERR_CSV_INVALID_DATE_FORMAT = `ERR_CSV_INVALID_DATE_FORMAT`,
    ERR_CSV_INVALID_BOOLEAN = `ERR_CSV_INVALID_BOOLEAN`,
    ERR_CSV_INVALID_EMAIL = `ERR_CSV_INVALID_EMAIL`,
    ERR_CSV_INVALID_PHONE = `ERR_CSV_INVALID_PHONE`,
    ERR_CSV_INVALID_NUMBER = `ERR_CSV_INVALID_NUMBER`,
    ERR_CSV_INVALID_UUID = `ERR_CSV_INVALID_UUID`,
    ERR_CSV_INVALID_GREATER_THAN_OTHER = `ERR_CSV_INVALID_GREATER_THAN_OTHER`,
    ERR_CSV_INVALID_DIFFERENT = `ERR_CSV_INVALID_DIFFERENT`,
    ERR_CSV_INVALID_UPPERCASE_ALPHA_NUM_WITH_MAX = `ERR_CSV_INVALID_UPPERCASE_ALPHA_NUM_WITH_MAX`,
    ERR_CSV_INVALID_MULTIPLE_EXIST = `ERR_CSV_INVALID_MULTIPLE_EXIST`,
    ERR_CSV_INVALID_MULTIPLE_EXIST_CHILD = `ERR_CSV_INVALID_MULTIPLE_EXIST_CHILD`,
    ERR_CSV_INVALID_LENGTH = `ERR_CSV_INVALID_LENGTH`,
}

export interface CsvBadInputErrorDetails {
    code: CsvUploadEntityErrorCode;
    message: string;
    row: number;
    column: string;
    entity?: string;
    attribute?: string;
    name?: string;
    parent_name?: string;
    parent_entity?: string;
    filename?: string;
    min?: string;
    max?: string;
    format?: string;
    other?: string;
    values?: string;
    count?: string;
    other_entity?: string;
    other_attribute?: string;
}

export interface CsvBadInputError {
    message: CsvUploadErrorCode.ERR_CSV_BAD_INPUT;
    details: CsvBadInputErrorDetails[];
}

const codeToTranslatedError = (error: CsvBadInputErrorDetails, intl: IntlShape) => {
    const {
        name,
        entity,
        message,
        parent_name,
        parent_entity,
        filename,
        attribute,
        min,
        max,
        format,
        other,
        values,
        count,
        other_entity,
        other_attribute,
    } = error;
    switch (error.code) {
    case CsvUploadEntityErrorCode.ERR_CSV_DUPLICATE_CHILD_ENTITY:
        return intl.formatMessage({
            id: `ERR_CSV_DUPLICATE_CHILD_ENTITY`,
        }, {
            name,
            entity,
            parent_name,
            parent_entity,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_DUPLICATE_ENTITY:
        return intl.formatMessage({
            id: `ERR_CSV_DUPLICATE_ENTITY`,
        }, {
            name,
            entity,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_EMPTY_FILE:
        return intl.formatMessage({
            id: `ERR_CSV_EMPTY_FILE`,
        }, {
            filename,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_ALPHA:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_ALPHA`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_ALPHA_NUM:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_ALPHA_NUM`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_BETWEEN:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_BETWEEN`,
        }, {
            entity,
            attribute,
            min,
            max,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_BOOLEAN:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_BOOLEAN`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_DATE_FORMAT:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_DATE_FORMAT`,
        }, {
            entity,
            attribute,
            format,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_DIFFERENT:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_DIFFERENT`,
        }, {
            entity,
            attribute,
            other,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_EMAIL:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_EMAIL`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_ENUM:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_ENUM`,
        }, {
            entity,
            attribute,
            values,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_GREATER_THAN_OTHER:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_GREATER_THAN_OTHER`,
        }, {
            entity,
            attribute,
            other,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_LENGTH:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_LENGTH`,
        }, {
            entity,
            attribute,
            max,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_MAX:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_MAX`,
        }, {
            entity,
            attribute,
            max,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_MIN:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_MIN`,
        }, {
            entity,
            attribute,
            min,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_MULTIPLE_EXIST:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_MULTIPLE_EXIST`,
        }, {
            name,
            entity,
            count,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_MULTIPLE_EXIST_CHILD:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_MULTIPLE_EXIST_CHILD`,
        }, {
            name,
            entity,
            parent_entity,
            parent_name,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_NUMBER:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_NUMBER`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_PHONE:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_PHONE`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_UPPERCASE_ALPHA_NUM_WITH_MAX:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_UPPERCASE_ALPHA_NUM_WITH_MAX`,
        }, {
            entity,
            attribute,
            max,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_UUID:
        return intl.formatMessage({
            id: `ERR_CSV_INVALID_UUID`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_MISSING_REQUIRED:
        return intl.formatMessage({
            id: `ERR_CSV_MISSING_REQUIRED`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_MISSING_REQUIRED_EITHER:
        return intl.formatMessage({
            id: `ERR_CSV_MISSING_REQUIRED_EITHER`,
        }, {
            entity,
            attribute,
            other_entity,
            other_attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_NONE_EXIST_CHILD_ENTITY:
        return intl.formatMessage({
            id: `ERR_CSV_NONE_EXIST_CHILD_ENTITY`,
        }, {
            name,
            entity,
            parent_entity,
            parent_name,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_NONE_EXIST_ENTITY:
        return intl.formatMessage({
            id: `ERR_CSV_NONE_EXIST_ENTITY`,
        }, {
            name,
            entity,
        });
    default: return message;
    }
};

export const handleFileUploadError = (intl: IntlShape) => (error: ApolloError): SpreadsheetValidtionError[] => {
    const errors = error.graphQLErrors;
    return errors
        ?.filter((error) => error.message === CsvUploadErrorCode.ERR_CSV_BAD_INPUT)
        .map((error: any) => error as CsvBadInputError)
        .flatMap((error) => {
            return error.details?.map((detailsError) => ({
                row: detailsError.row,
                column: detailsError.column,
                message: codeToTranslatedError(detailsError, intl),
            })) ?? [];
        }) ?? [];
};

export const addCsvTypeIfMissing = (file: File) => {
    if (!file.name.endsWith(`.csv`)) return file;
    return new File([ file ], file.name, {
        type: file.type || `text/csv`,
    });
};
