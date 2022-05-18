export class SPRAPIError extends Error {
    private type: SPRAPIErrorType;
    private body: { [key: string]: any };
    constructor (type: SPRAPIErrorType, body: { [key: string]: any }) {
        super();
        if (typeof SPRAPIErrorType[type] === `undefined`) {
            this.type = SPRAPIErrorType.UNKNOWN;
        } else {
            this.type = type;
        }
        this.body = body;
    }
    public getBody () { return this.body; }
    public getErrorMessageType () {
        return this.type;
    }
    public getErrorMessageID () {
        return errorCodeToMessageID[this.type];
    }
}
export enum SPRAPIErrorType {
    MOCK = -2,
    UNKNOWN = -1,
    INTERNAL_SERVER_ERROR = 1,
    FUNCTION_NOT_FOUND = 2,
    BAD_REQUEST_METHOD = 3,
    BAD_REQUEST_BODY = 4,
    INVALID_PARAMETERS = 5,
    EXPIRED_ACCESS_TOKEN = 6,
    FUNCTION_TIMEOUT = 7,
    TOO_MANY_REQUESTS = 8,
    ITEM_NOT_FOUND = 9,
    REACHED_MAX_LIMIT = 10,
    UNAUTHORIZED = 11,
    ITEM_ALREADY_EXISTS = 12,
    ITEM_NOT_READY = 13,

    // Login
    INVALID_LOGIN = 20,
    INVALID_PASSWORD = 21,
    EMAIL_NOT_VERIFIED = 22,
    ACCOUNT_BANNED = 23,
    DEVICE_NOT_FOUND = 24,
    EXPIRED_REFRESH_TOKEN = 25,
    PHONE_NUMBER_NOT_VERIFIED = 26,

    // Sign Up
    INVALID_EMAIL_FORMAT = 40,
    INVALID_EMAIL_HOST = 41,
    EMAIL_ALREADY_USED = 42,
    PASSWORD_TOO_SHORT = 43,
    PASSWORD_TOO_LONG = 44,
    PASSWORD_NUMBER_MISSING = 45,
    PASSWORD_UPPERCASE_MISSING = 46,
    PASSWORD_LOWERCASE_MISSING = 47,

    // Verification
    INVALID_VERIFICATION_CODE = 60,
    VERIFICATION_NOT_FOUND = 61,
    ALREADY_VERIFIED = 62,

    INPUT_INVALID_FORMAT = 262,
    INPUT_TOO_LONG = 261,
    INPUT_TOO_SHORT = 260,
}

const errorCodeToMessageID = {
    [SPRAPIErrorType.MOCK]: `ERROR_MOCK`,
    [SPRAPIErrorType.UNKNOWN]: `ERROR_UNKOWN`,
    // General
    [SPRAPIErrorType.INTERNAL_SERVER_ERROR]: `ERROR_INTERNAL_SERVER_ERROR`,
    [SPRAPIErrorType.FUNCTION_NOT_FOUND]: `ERROR_FUNCTION_NOT_FOUND`,
    [SPRAPIErrorType.BAD_REQUEST_METHOD]: `ERROR_BAD_REQUEST_METHOD`,
    [SPRAPIErrorType.BAD_REQUEST_BODY]: `ERROR_BAD_REQUEST_BODY`,
    [SPRAPIErrorType.INVALID_PARAMETERS]: `ERROR_INVALID_PARAMETERS`,
    [SPRAPIErrorType.EXPIRED_ACCESS_TOKEN]: `ERROR_EXPIRED_ACCESS_TOKEN`,
    [SPRAPIErrorType.FUNCTION_TIMEOUT]: `ERROR_FUNCTION_TIMEOUT`,
    [SPRAPIErrorType.TOO_MANY_REQUESTS]: `ERROR_TOO_MANY_REQUESTS`,
    [SPRAPIErrorType.ITEM_NOT_FOUND]: `ERROR_ITEM_NOT_FOUND`,
    [SPRAPIErrorType.REACHED_MAX_LIMIT]: `ERROR_REACHED_MAX_LIMIT`,
    [SPRAPIErrorType.UNAUTHORIZED]: `ERROR_UNAUTHORIZED`,
    [SPRAPIErrorType.ITEM_ALREADY_EXISTS]: `ERROR_ITEM_ALREADY_EXISTS`,
    [SPRAPIErrorType.ITEM_NOT_READY]: `ERROR_ITEM_NOT_READY`,

    // Login
    [SPRAPIErrorType.INVALID_LOGIN]: `ERROR_INVALID_LOGIN`,
    [SPRAPIErrorType.INVALID_PASSWORD]: `ERROR_INVALID_PASSWORD`,
    [SPRAPIErrorType.EMAIL_NOT_VERIFIED]: `ERROR_EMAIL_NOT_VERIFIED`,
    [SPRAPIErrorType.ACCOUNT_BANNED]: `ERROR_ACCOUNT_BANNED`,
    [SPRAPIErrorType.DEVICE_NOT_FOUND]: `ERROR_DEVICE_NOT_FOUND`,
    [SPRAPIErrorType.EXPIRED_REFRESH_TOKEN]: `ERROR_EXPIRED_REFRESH_TOKEN`,
    [SPRAPIErrorType.PHONE_NUMBER_NOT_VERIFIED]: `PHONE_NUMBER_NOT_VERIFIED`,

    // Sign Up
    [SPRAPIErrorType.INVALID_EMAIL_FORMAT]: `sign_up_error_INVALID_EMAIL`,
    [SPRAPIErrorType.INVALID_EMAIL_HOST]: `sign_up_error_INVALID_EMAIL`,
    [SPRAPIErrorType.EMAIL_ALREADY_USED]: `sign_up_error_EMAIL_ALREADY_USED`,
    [SPRAPIErrorType.PASSWORD_TOO_SHORT]: `sign_up_error_PASSWORD_TOO_SHORT`,
    [SPRAPIErrorType.PASSWORD_TOO_LONG]: `sign_up_error_PASSWORD_TOO_LONG`,
    [SPRAPIErrorType.PASSWORD_NUMBER_MISSING]: `sign_up_error_PASSWORD_NUMBER_MISSING`,
    [SPRAPIErrorType.PASSWORD_UPPERCASE_MISSING]: `sign_up_error_PASSWORD_UPPERCASE_MISSING`,
    [SPRAPIErrorType.PASSWORD_LOWERCASE_MISSING]: `sign_up_error_PASSWORD_LOWERCASE_MISSING`,

    // Verification
    [SPRAPIErrorType.INVALID_VERIFICATION_CODE]: `ERROR_INVALID_VERIFICATION_CODE`,
    [SPRAPIErrorType.VERIFICATION_NOT_FOUND]: `ERROR_VERIFICATION_NOT_FOUND`,
    [SPRAPIErrorType.ALREADY_VERIFIED]: `ERROR_ALREADY_VERIFIED`,

    // Input
    [SPRAPIErrorType.INPUT_TOO_SHORT]: `ERROR_INPUT_TOO_SHORT`,
    [SPRAPIErrorType.INPUT_TOO_LONG]: `ERROR_INPUT_TOO_LONG`,
    [SPRAPIErrorType.INPUT_INVALID_FORMAT]: `ERROR_INPUT_INVALID_FORMAT`,
};