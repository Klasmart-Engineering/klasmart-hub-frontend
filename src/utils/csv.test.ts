import { mockCSVErrors } from "@/api/__mocks__/errors";
import {
    mockIntl,
    mockOnTranslationError,
} from "@/locale/__mocks__/locale";
import {
    codeToTranslatedError,
    CsvBadInputErrorDetails,
} from "@/utils/csv";
import { OnErrorFn } from "@formatjs/intl";

beforeEach(() => (mockOnTranslationError as jest.MockedFunction<OnErrorFn>).mockClear());

describe(`codeToTranslatedError`, () => {
    test.each(Object.values(mockCSVErrors))(`successfully applies localization for APIErrorCode %s`, (csvError: CsvBadInputErrorDetails) => {
        const message = codeToTranslatedError(csvError, mockIntl);
        expect(message).not.toContain(`undefined`);
        expect(mockOnTranslationError).not.toHaveBeenCalled();
        // message should only be used as a fallback (as it's not translated)
        expect(message).not.toBe(csvError.message);
    });
});
