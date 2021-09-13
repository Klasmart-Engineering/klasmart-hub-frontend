import { throwMockApolloAPIError } from "@/api/__mocks__/errors";
import { APIErrorCode } from "@/api/errors";
import {
    buttons,
    inputs,
} from "@/components/User/Dialog/Form.test";
import { mockIntl } from "@/locale/__mocks__/locale";
import {
    getElementError,
    RenderResult,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    expectInputToHaveError,
    expectSnackbarError,
    TEXT_FIELD_NO_ERROR,
} from "@tests/expect";
import { mockEnqueueSnackbar } from "@tests/mocks";
import { getBackdrop } from "@tests/queries";
import { waitForButtonToLoad } from "@tests/waitFor";
import { utils } from "kidsloop-px";

interface DialogOptions {
    type: string;
    mockApi: jest.MockedFunction<any>;
    mockOnClose: jest.MockedFunction<any>;
    translations: {
        cancelButton: string;
        submitButton: string;
        genericError: string;
    };
    render: () => RenderResult;
    beforeSubmit?: () => Promise<void>;
}

export const commonDialogTests = (dialogOptions: DialogOptions) => {
    const {
        type,
        mockApi,
        mockOnClose,
        translations,
        render,
        beforeSubmit,
    } = dialogOptions;

    const getSubmitButton = () => {
        const submitButton = screen.getByText(mockIntl.formatMessage({
            id: translations.submitButton,
        })).closest(`button`);
        if (submitButton === null) {
            throw getElementError(`Unable to find submitButton`, document.body);
        }
        return submitButton;
    };

    describe(`common Dialog tests: ${type}UserDialog`, () => {
        const originalConsoleError = global.console.error;
        beforeEach(() => {
            global.console.error = jest.fn();
            mockApi.mockClear();
            mockOnClose.mockClear();
            mockEnqueueSnackbar.mockClear();
        });

        afterEach(() => {
            global.console.error = originalConsoleError;
        });

        test(`highlights Short Code when API returns duplicate Shortcode error code`, async () => {
            render();

            const submitButton = getSubmitButton();

            await beforeSubmit?.();

            mockApi.mockImplementationOnce(async () => {
                await utils.sleep(0);
                throwMockApolloAPIError([
                    {
                        code: APIErrorCode.ERR_DUPLICATE_CHILD_ENTITY,
                        message: `OrganizationMembership SHORTCODE1 already exists for Organization FakeOrg`,
                        entity: `OrganizationMembership`,
                        entityName: `SHORTCODE1`,
                        parentEntity: `Organization`,
                        parentName: `FakeOrg`,
                        variables: [ `shortcode` ],
                    },
                ]);
            });

            userEvent.click(submitButton);

            await waitForButtonToLoad(submitButton);

            expect(mockEnqueueSnackbar).not.toHaveBeenCalled();

            expectInputToHaveError(inputs.shortcode(), mockIntl.formatMessage({
                id: `validation.error.shortCode.duplicate`,
            }));

            expect(submitButton).toBeDisabled();
            expect(global.console.error).not.toHaveBeenCalled();
        });

        test.each([
            {
                code: APIErrorCode.ERR_DUPLICATE_CHILD_ENTITY,
                message: `User Joe Bloggs already exists for Organization FakeOrg.`,
                entity: `User`,
                entityName: `Joe Bloggs`,
                parentEntity: `Organization`,
                parentName: `FakeOrg`,
                variables: [
                    `given_name`,
                    `family_name`,
                    `email`,
                    `phone`,
                ],
            },
            {
                code: APIErrorCode.ERR_DUPLICATE_ENTITY,
                message: `User Joe Bloggs already exists.`,
                entity: `User`,
                entityName: `Joe Bloggs`,
                variables: [
                    `given_name`,
                    `family_name`,
                    `email`,
                    `phone`,
                ],
            },
        ])(`highlights given_name/family_name/contact_info when API returns duplicate User error code`, async (apiError) => {
            render();

            const submitButton = getSubmitButton();

            await beforeSubmit?.();

            mockApi.mockImplementationOnce(async () => {
                await utils.sleep(0);
                throwMockApolloAPIError([ apiError ]);
            });

            userEvent.click(submitButton);

            await waitForButtonToLoad(submitButton);

            expectSnackbarError(mockIntl.formatMessage({
                id: `validation.error.user.duplicate`,
            }));

            [
                inputs.givenName(),
                inputs.familyName(),
                inputs.contactInfo(),
            ].forEach((input) =>
                expectInputToHaveError(input, TEXT_FIELD_NO_ERROR));

            expect(submitButton).toBeDisabled();
            expect(global.console.error).not.toHaveBeenCalled();
        });

        test(`shows a generic error message when API returns another error code`, async () => {
            render();

            const submitButton = getSubmitButton();

            await beforeSubmit?.();

            const apiErrors = [
                {
                    code: APIErrorCode.ERR_INVALID_EMAIL,
                    message: `Invalid email`,
                    variables: [ `email` ],
                },
            ];

            mockApi.mockImplementationOnce(async () => {
                await utils.sleep(0);
                throwMockApolloAPIError(apiErrors);
            });

            userEvent.click(submitButton);

            await waitForButtonToLoad(submitButton);

            expectSnackbarError(mockIntl.formatMessage({
                id: translations.genericError,
            }));

            expect(submitButton).toBeEnabled();
            expect(global.console.error).toHaveBeenCalledTimes(1);
            expect(global.console.error).toHaveBeenCalledWith(apiErrors);
        });

        test(`calls onClose when cancel is clicked`, async () => {
            render();

            const cancelButton = screen.getByText(mockIntl.formatMessage({
                id: translations.cancelButton,
            }));

            userEvent.click(cancelButton);

            await waitFor(() => expect(mockOnClose).toHaveBeenCalledTimes(1));

            expect(mockOnClose).toHaveBeenCalledWith();
        });

        test(`calls onClose when the backdrop is clicked`, () => {
            render();

            userEvent.click(getBackdrop());

            expect(mockOnClose).toHaveBeenCalledTimes(1);
            expect(mockOnClose).toHaveBeenCalledWith();
        });

        test(`calls onClose when the close dialog button is clicked`, () => {
            render();

            userEvent.click(buttons.close());

            expect(mockOnClose).toHaveBeenCalledTimes(1);
            expect(mockOnClose).toHaveBeenCalledWith();
        });

    });
};
