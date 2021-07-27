import { ApolloError } from "@apollo/client";
import {
    Props as SpreadsheetFileInputProps,
    SpreadsheetValidationError,
} from "kidsloop-px/dist/types/components/Input/File/Spreadsheet/Base";
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
    ERR_EMPTY_FILE = `ERR_EMPTY_FILE`,
    ERR_FILE_EXCEEDS_MAX_SIZE = `ERR_FILE_EXCEEDS_MAX_SIZE`,
    ERR_INVALID_FILE_TYPE = `ERR_INVALID_FILE_TYPE`,
    ERR_UPLOAD_EXCEEDS_MAX_FILE_COUNT = `ERR_UPLOAD_EXCEEDS_MAX_FILE_COUNT`,
    ERR_CSV_MISSING_REQUIRED_COLUMN = `ERR_CSV_MISSING_REQUIRED_COLUMN`,
    ERR_CSV_DUPLICATE_COLUMN = `ERR_CSV_DUPLICATE_COLUMN`,
    ERR_CSV_MISSING_REQUIRED = `ERR_CSV_MISSING_REQUIRED`,
    ERR_MISSING_REQUIRED_ENTITY_ATTRIBUTE = `ERR_MISSING_REQUIRED_ENTITY_ATTRIBUTE`,
    ERR_CSV_MISSING_REQUIRED_EITHER = `ERR_CSV_MISSING_REQUIRED_EITHER`,
    ERR_CSV_DUPLICATE_ENTITY = `ERR_CSV_DUPLICATE_ENTITY`,
    ERR_DUPLICATE_ENTITY = `ERR_DUPLICATE_ENTITY`,
    ERR_CSV_DUPLICATE_CHILD_ENTITY = `ERR_CSV_DUPLICATE_CHILD_ENTITY`,
    ERR_CSV_NONE_EXIST_ENTITY = `ERR_CSV_NONE_EXIST_ENTITY`,
    ERR_NON_EXISTENT_ENTITY = `ERR_NON_EXISTENT_ENTITY`,
    ERR_CSV_NONE_EXIST_CHILD_ENTITY = `ERR_CSV_NONE_EXIST_CHILD_ENTITY`,
    ERR_NON_EXISTENT_CHILD_ENTITY = `ERR_NON_EXISTENT_CHILD_ENTITY`,
    ERR_CSV_INVALID_ENUM = `ERR_CSV_INVALID_ENUM`,
    ERR_CSV_INVALID_MIN = `ERR_CSV_INVALID_MIN`,
    ERR_INVALID_MIN_LENGTH = `ERR_INVALID_MIN_LENGTH`,
    ERR_INVALID_MAX_LENGTH = `ERR_INVALID_MAX_LENGTH`,
    ERR_CSV_INVALID_MAX = `ERR_CSV_INVALID_MAX`,
    ERR_CSV_INVALID_BETWEEN = `ERR_CSV_INVALID_BETWEEN`,
    ERR_CSV_INVALID_ALPHA = `ERR_CSV_INVALID_ALPHA`,
    ERR_INVALID_ALPHANUMERIC_SPECIAL_CHARACTERS = `ERR_INVALID_ALPHANUMERIC_SPECIAL_CHARACTERS`,
    ERR_INVALID_ALPHABETIC = `ERR_INVALID_ALPHABETIC`,
    ERR_CSV_INVALID_ALPHA_NUM = `ERR_CSV_INVALID_ALPHA_NUM`,
    ERR_INVALID_ALPHANUMERIC = `ERR_INVALID_ALPHANUMERIC`,
    ERR_CSV_INVALID_DATE_FORMAT = `ERR_CSV_INVALID_DATE_FORMAT`,
    ERR_INVALID_DATE = `ERR_INVALID_DATE`,
    ERR_CSV_INVALID_BOOLEAN = `ERR_CSV_INVALID_BOOLEAN`,
    ERR_CSV_INVALID_EMAIL = `ERR_CSV_INVALID_EMAIL`,
    ERR_INVALID_EMAIL = `ERR_INVALID_EMAIL`,
    ERR_CSV_INVALID_PHONE = `ERR_CSV_INVALID_PHONE`,
    ERR_INVALID_PHONE = `ERR_INVALID_PHONE`,
    ERR_CSV_INVALID_NUMBER = `ERR_CSV_INVALID_NUMBER`,
    ERR_CSV_INVALID_UUID = `ERR_CSV_INVALID_UUID`,
    ERR_INVALID_UUID = `ERR_INVALID_UUID`,
    ERR_CSV_INVALID_GREATER_THAN_OTHER = `ERR_CSV_INVALID_GREATER_THAN_OTHER`,
    ERR_CSV_INVALID_DIFFERENT = `ERR_CSV_INVALID_DIFFERENT`,
    ERR_CSV_INVALID_UPPERCASE_ALPHA_NUM_WITH_MAX = `ERR_CSV_INVALID_UPPERCASE_ALPHA_NUM_WITH_MAX`,
    ERR_CSV_INVALID_MULTIPLE_EXIST = `ERR_CSV_INVALID_MULTIPLE_EXIST`,
    ERR_CSV_INVALID_MULTIPLE_EXIST_CHILD = `ERR_CSV_INVALID_MULTIPLE_EXIST_CHILD`,
    ERR_CSV_INVALID_LENGTH = `ERR_CSV_INVALID_LENGTH`,
    UNAUTHORIZED = `UNAUTHORIZED`,
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
    parentName?: string;
    parent_entity?: string;
    parentEntity?: string;
    min?: string;
    max?: string;
    format?: string;
    other?: string;
    values?: string;
    count?: string;
    other_entity?: string;
    other_attribute?: string;
    size?: string;
    fileType?: string;
    columnName?: string;
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
        parentName,
        parent_entity,
        parentEntity,
        attribute,
        min,
        max,
        format,
        other,
        values,
        count,
        other_entity,
        other_attribute,
        size,
        fileType,
        columnName,
    } = error;
    switch (error.code) {
    case CsvUploadEntityErrorCode.ERR_CSV_DUPLICATE_CHILD_ENTITY:
        return intl.formatMessage({
            id: `validation.error.entity.duplicateChild`,
        }, {
            name,
            entity,
            // Support legacy snake_case properties
            parentEntity: parentEntity || parent_entity,
            parentName: parentName || parent_name,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_DUPLICATE_ENTITY:
    case CsvUploadEntityErrorCode.ERR_DUPLICATE_ENTITY:
        return intl.formatMessage({
            id: `validation.error.entity.duplicate`,
        }, {
            name,
            entity,
        });
    case CsvUploadEntityErrorCode.ERR_EMPTY_FILE:
        return intl.formatMessage({
            id: `validation.error.file.empty`,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_ALPHA:
    case CsvUploadEntityErrorCode.ERR_INVALID_ALPHABETIC:
        return intl.formatMessage({
            id: `validation.error.entity.alphabetic`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_ALPHA_NUM:
    case CsvUploadEntityErrorCode.ERR_INVALID_ALPHANUMERIC:
        return intl.formatMessage({
            id: `validation.error.entity.alphanumeric`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_INVALID_ALPHANUMERIC_SPECIAL_CHARACTERS:
        return intl.formatMessage({
            id: `validation.error.entity.alphanumericAndSpecialCharacters`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_BETWEEN:
        return intl.formatMessage({
            id: `validation.error.entity.between`,
        }, {
            entity,
            attribute,
            min,
            max,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_BOOLEAN:
        return intl.formatMessage({
            id: `validation.error.entity.boolean`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_DATE_FORMAT:
    case CsvUploadEntityErrorCode.ERR_INVALID_DATE:
        return intl.formatMessage({
            id: `validation.error.entity.date`,
        }, {
            entity,
            attribute,
            format,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_DIFFERENT:
        return intl.formatMessage({
            id: `validation.error.entity.different`,
        }, {
            entity,
            attribute,
            other,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_EMAIL:
    case CsvUploadEntityErrorCode.ERR_INVALID_EMAIL:
        return intl.formatMessage({
            id: `validation.error.entity.email`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_ENUM:
        return intl.formatMessage({
            id: `validation.error.entity.enum`,
        }, {
            entity,
            attribute,
            values,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_GREATER_THAN_OTHER:
        return intl.formatMessage({
            id: `validation.error.entity.greaterThan`,
        }, {
            entity,
            attribute,
            other,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_LENGTH:
    case CsvUploadEntityErrorCode.ERR_INVALID_MAX_LENGTH:
        return intl.formatMessage({
            id: `validation.error.entity.maxLength`,
        }, {
            entity,
            attribute,
            max,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_MAX:
        return intl.formatMessage({
            id: `validation.error.entity.max`,
        }, {
            entity,
            attribute,
            max,
        });
    case CsvUploadEntityErrorCode.ERR_INVALID_MIN_LENGTH:
        return intl.formatMessage({
            id: `validation.error.entity.minLength`,
        }, {
            entity,
            attribute,
            min,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_MIN:
        return intl.formatMessage({
            id: `validation.error.entity.min`,
        }, {
            entity,
            attribute,
            min,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_MULTIPLE_EXIST:
        return intl.formatMessage({
            id: `validation.error.entity.multipleExist`,
        }, {
            name,
            entity,
            count,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_MULTIPLE_EXIST_CHILD:
        return intl.formatMessage({
            id: `validation.error.entity.multipleChildrenExist`,
        }, {
            name,
            entity,
            // Support legacy snake_case properties
            parentEntity: parentEntity || parent_entity,
            parentName: parentName || parent_name,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_NUMBER:
        return intl.formatMessage({
            id: `validation.error.entity.numeric`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_PHONE:
    case CsvUploadEntityErrorCode.ERR_INVALID_PHONE:
        return intl.formatMessage({
            id: `validation.error.entity.phone`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_UPPERCASE_ALPHA_NUM_WITH_MAX:
        return intl.formatMessage({
            id: `validation.error.entity.uppercaseAlphanumericMaxLength`,
        }, {
            entity,
            attribute,
            max,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_INVALID_UUID:
    case CsvUploadEntityErrorCode.ERR_INVALID_UUID:
        return intl.formatMessage({
            id: `validation.error.entity.uuid`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_MISSING_REQUIRED:
    case CsvUploadEntityErrorCode.ERR_MISSING_REQUIRED_ENTITY_ATTRIBUTE:
        return intl.formatMessage({
            id: `validation.error.entity.required`,
        }, {
            entity,
            attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_MISSING_REQUIRED_EITHER:
        return intl.formatMessage({
            id: `validation.error.entity.conditionallyRequired`,
        }, {
            entity,
            attribute,
            other_entity,
            other_attribute,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_NONE_EXIST_CHILD_ENTITY:
    case CsvUploadEntityErrorCode.ERR_NON_EXISTENT_CHILD_ENTITY:
        return intl.formatMessage({
            id: `validation.error.entity.nonExistentChild`,
        }, {
            name,
            entity,
            // Support legacy snake_case properties
            parentEntity: parentEntity || parent_entity,
            parentName: parentName || parent_name,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_NONE_EXIST_ENTITY:
    case CsvUploadEntityErrorCode.ERR_NON_EXISTENT_ENTITY:
        return intl.formatMessage({
            id: `validation.error.entity.nonExistent`,
        }, {
            name,
            entity,
        });
    case CsvUploadEntityErrorCode.UNAUTHORIZED:
        return intl.formatMessage({
            id: `validation.error.permission.unauthorized`,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_MISSING_REQUIRED_COLUMN:
        return intl.formatMessage({
            id: `validation.error.spreadsheet.missingColumn`,
        }, {
            columnName,
        });
    case CsvUploadEntityErrorCode.ERR_CSV_DUPLICATE_COLUMN:
        return intl.formatMessage({
            id: `validation.error.spreadsheet.duplicateColumn`,
        }, {
            columnName,
        });
    case CsvUploadEntityErrorCode.ERR_INVALID_FILE_TYPE:
        return intl.formatMessage({
            id: `validation.error.file.type`,
        }, {
            fileType,
        });
    case CsvUploadEntityErrorCode.ERR_UPLOAD_EXCEEDS_MAX_FILE_COUNT:
        return intl.formatMessage({
            id: `validation.error.file.maxCount`,
        }, {
            max,
        });
    case CsvUploadEntityErrorCode.ERR_FILE_EXCEEDS_MAX_SIZE:
        return intl.formatMessage({
            id: `validation.error.file.maxSize`,
        }, {
            size,
            max,
        });
    default: return message;
    }
};

export const handleFileUploadError = (intl: IntlShape) => (error: ApolloError): SpreadsheetValidationError[] => {
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
        type: `text/csv`,
    });
};

const MAX_FILE_SIZE = 50_000; // 50kB

const defaultStaticSpreadsheetFileInputProps = {
    accept: CSV_ACCEPT_TYPES,
    maxFileSize: MAX_FILE_SIZE,
};

export function buildDefaultSpreadsheetFileInputProps (intl: IntlShape): Partial<SpreadsheetFileInputProps> {
    return {
        ...defaultStaticSpreadsheetFileInputProps,
        locales: intl.locale,
        dropzoneLabel: intl.formatMessage({
            id: `csvDialog_addCsvFile`,
        }),
        uploadSuccessMessage: intl.formatMessage({
            id: `uploadCsv_uploadSuccessMessage`,
        }),
        removeButtonTooltip: intl.formatMessage({
            id: `uploadCsv_removeButtonTooltip`,
        }),
        uploadButtonTooltip: intl.formatMessage({
            id: `uploadCsv_uploadButtonTooltip`,
        }),
        spreadsheetInvalidData: intl.formatMessage({
            id: `uploadCsv_invalidDataError`,
        }),
        typeRejectedError: intl.formatMessage({
            id: `uploadCsv_typeRejectedError`,
        }),
        allValidationsPassedMessage: intl.formatMessage({
            id: `uploadCsv_allValidationsPassedMessage`,
        }),
        validationInProgressMessage: intl.formatMessage({
            id: `uploadCsv_validationInProgressMessage`,
        }),
        maxFilesError: intl.formatMessage({
            id: `validation.error.file.maxCount`,
        }, {
            max: 1,
        }),
        exceedsMaxSizeError: (fileSize, maxSize) => intl.formatMessage({
            id: `validation.error.file.maxSize`,
        }, {
            size: `${(fileSize / 1000).toFixed(1)} kB`,
            max: `${(maxSize / 1000).toFixed(1)} kB`,
        }),
        numValidationsFailedMessage: (count) => intl.formatMessage({
            id: `uploadCsv_numValidationsFailedMessage`,
        }, {
            count,
        }),
        validationLocalization: {
            emptyFileError: intl.formatMessage({
                id: `validation.error.file.empty`,
            }),
            duplicateColumnError: (columnName) => intl.formatMessage({
                id: `validation.error.spreadsheet.duplicateColumn`,
            }, {
                columnName,
            }),
            missingColumnError: (columnName) => intl.formatMessage({
                id: `validation.error.spreadsheet.missingColumn`,
            }, {
                columnName,
            }),
        },
        onFileUploadError: handleFileUploadError(intl),
    };
}
