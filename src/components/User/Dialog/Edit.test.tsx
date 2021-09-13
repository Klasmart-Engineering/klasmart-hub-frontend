import EditDialog from "./Edit";
import { commonDialogTests } from "./shared.test";
import { mockGetOrganizationMembership } from "@/api/__mocks__/organizationMemberships";
import { mockGetOrganizationRoles } from "@/api/__mocks__/roles";
import { mockUseGetSchools } from "@/api/__mocks__/schools";
import {
    DeleteOrganizationMembershipRequest,
    DeleteOrganizationMembershipResponse,
    UpdateOrganizationMembershipRequest,
    UpdateOrganizationMembershipResponse,
    useGetOrganizationMembership,
} from "@/api/organizationMemberships";
import { useGetOrganizationRoles } from "@/api/roles";
import { useGetSchools } from "@/api/schools";
import { mapOrganizationMembershipToFormState } from "@/components/User/Dialog/Edit";
import {
    defaultState,
    formatDateOfBirth,
    State,
} from "@/components/User/Dialog/Form";
import {
    clearAllInputs,
    enter,
    inputs,
} from "@/components/User/Dialog/Form.test";
import {
    mockIntl,
    renderWithIntl,
    withMockIntl,
} from "@/locale/__mocks__/locale";
import { isActive } from "@/types/graphQL";
import { useDeleteEntityPrompt } from "@/utils/common";
import { UserGenders } from "@/utils/users";
import { MutationTuple } from "@apollo/client";
import {
    getElementError,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    expectSnackbarError,
    expectSnackbarSuccess,
} from "@tests/expect";
import { mockOrg } from "@tests/mockOrganizationData";
import { mockRoles } from "@tests/mockRoles";
import { mockEnqueueSnackbar } from "@tests/mocks";
import {
    schoolA,
    schoolC,
} from "@tests/mocks/mockSchools";
import {
    mockOrganizationMembership2,
    mockOrganizationMemberships,
    mockSchoolMemberships,
    mockUser,
} from "@tests/mockUsers";
import { waitForButtonToLoad } from "@tests/waitFor";
import { utils } from 'kidsloop-px';
import { cloneDeep } from "lodash";
import React from "react";

const mockUpdateOrganizationMembership = jest.fn() as jest.Mocked<
    MutationTuple<
        UpdateOrganizationMembershipResponse,
        UpdateOrganizationMembershipRequest
    >
>[0];

const mockDeleteOrganizationMembership = jest.fn() as jest.Mocked<
    MutationTuple<
        DeleteOrganizationMembershipResponse,
        DeleteOrganizationMembershipRequest
    >
>[0];

const mockDeletePrompt = jest.fn().mockResolvedValue(true) as jest.MockedFunction<ReturnType<typeof useDeleteEntityPrompt>>;

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            organization_id: mockOrg.organization_id,
        }),
    };
});

jest.mock(`@/api/organizationMemberships`, () => {
    return {
        useGetOrganizationMembership: jest.fn(),
        useDeleteOrganizationMembership: () => [ mockDeleteOrganizationMembership ],
        useUpdateOrganizationMembership: () => [ mockUpdateOrganizationMembership ],
    };
});

jest.mock(`@/api/schools`, () => {
    return {
        useGetSchools: jest.fn(),
    };
});

jest.mock(`@/api/roles`, () => {
    return {
        useGetOrganizationRoles: jest.fn(),
    };
});

jest.mock(`@/utils/common`, () => {
    return {
        useDeleteEntityPrompt: () => mockDeletePrompt,
    };
});

let mockUseGetOrganizationMembership = (useGetOrganizationMembership as jest.MockedFunction<typeof useGetOrganizationMembership>);

beforeAll(() => {
    (useGetSchools as jest.MockedFunction<typeof useGetSchools>).mockReturnValue(mockUseGetSchools);
    (useGetOrganizationRoles as jest.MockedFunction<typeof useGetOrganizationRoles>).mockReturnValue(mockGetOrganizationRoles);
    mockUseGetOrganizationMembership = mockUseGetOrganizationMembership.mockReturnValue(mockGetOrganizationMembership);
});

const defaultMembership = {
    organization_id: mockOrg.organization_id,
    user_id: mockUser.user_id,
};

const mockOrganizationMembership = mockOrganizationMemberships[0];

describe(`mapOrganizationMembershipToFormState`, () => {
    test(`inactive schools are ignored`, () => {
        expect(mapOrganizationMembershipToFormState({
            ...defaultMembership,
            schoolMemberships: mockSchoolMemberships,
        }).schools).toEqual([ schoolA.school_id, schoolC.school_id ]);
    });

    test(`inactive roles are ignored`, () => {
        expect(mapOrganizationMembershipToFormState({
            ...defaultMembership,
            roles: mockOrganizationMembership.roles,
        }).roles).toEqual(mockOrganizationMembership.roles.filter(isActive).map(role => role.role_id));
    });

    test(`maps properties when all are specified`, () => {
        const expected: State = {
            alternativeEmail: mockUser.alternate_email,
            alternativePhone: mockUser.alternate_phone,
            birthday: mockUser.date_of_birth,
            contactInfo: mockUser.email,
            familyName: mockUser.family_name,
            gender: mockUser.gender,
            givenName: mockUser.given_name,
            roles: mockOrganizationMembership.roles.filter(isActive).map(role => role.role_id),
            schools: mockUser.school_memberships.filter(isActive).map(schoolMembership => schoolMembership.school_id),
            shortcode: mockOrganizationMembership.shortcode,
        };
        expect(mapOrganizationMembershipToFormState(mockOrganizationMembership)).toEqual(expected);
    });

    test(`maps to defaults when the minimum is specified`, () => {
        expect(mapOrganizationMembershipToFormState({
            ...defaultMembership,
            user: {
                user_id: defaultMembership.user_id,
                gender: UserGenders.FEMALE,
            },
        })).toEqual(defaultState);
    });
});

describe(`form`, () => {
    const originalConsoleError = global.console.error;
    const mockOnClose = jest.fn();

    const render = () => {
        const renderResult = renderWithIntl(<EditDialog
            open
            userId={mockUser.user_id}
            onClose={mockOnClose}/>);

        const submitButton = screen.getByText(mockIntl.formatMessage({
            id: `editDialog_save`,
        })).closest(`button`);
        if (submitButton === null) {
            throw getElementError(`Unable to find submitButton`, renderResult.container);
        }
        return {
            ...renderResult,
            submitButton,
        };
    };

    beforeEach(() => {
        global.console.error = jest.fn();
        mockOnClose.mockClear();
        mockUpdateOrganizationMembership.mockClear();
        mockEnqueueSnackbar.mockClear();
    });

    afterEach(() => {
        global.console.error = originalConsoleError;
    });

    commonDialogTests({
        type: `Edit`,
        mockApi: mockUpdateOrganizationMembership,
        translations: {
            submitButton: `editDialog_save`,
            cancelButton: `editDialog_cancel`,
            genericError: `editDialog_savedError`,
        },
        mockOnClose,
        render,
    });

    describe(`edit`, () => {
        test(`loads the OrganizationMembership into the form state`, () => {
            render();

            expect(inputs.givenName()).toHaveValue(mockOrganizationMembership.user.given_name);
            expect(inputs.familyName()).toHaveValue(mockOrganizationMembership.user.family_name);
            expect(inputs.contactInfo()).toHaveValue(mockOrganizationMembership.user.email);
            expect(inputs.birthday()).toHaveValue(formatDateOfBirth(mockOrganizationMembership.user.date_of_birth));
            expect(inputs.shortcode()).toHaveValue(mockOrganizationMembership.shortcode);

            expect(inputs.schools()).toHaveTextContent([ schoolA.school_name, schoolC.school_name ].join(`, `));
            expect(inputs.roles()).toHaveTextContent([ mockRoles.organizationAdmin.role_name, mockRoles.customRole.role_name ].join(`, `));

            expect(inputs.alternativeEmail()).toHaveValue(mockOrganizationMembership.user.alternate_email);
            expect(inputs.alternativePhone()).toHaveValue(mockOrganizationMembership.user.alternate_phone);
        });

        test(`disables the contactInfo field`, () => {
            render();

            expect(inputs.contactInfo()).toBeDisabled();
        });

        test.each([
            [ UserGenders.FEMALE, inputs.gender.radio.female ],
            [ UserGenders.MALE, inputs.gender.radio.male ],
            [ UserGenders.NOT_SPECIFIED, inputs.gender.radio.preferNotToSay ],
        ])(`gender=%s is pre-selected`, (gender, radio) => {
            const genderedMembership = cloneDeep(mockOrganizationMembership);
            genderedMembership.user.gender = gender;
            mockUseGetOrganizationMembership.mockReturnValue({
                data: {
                    user: {
                        membership: genderedMembership,
                    },
                },
                loading: false,
            });

            render();

            expect(radio()).toBeChecked();
        });

        test(`an 'other' gender pre-selects the 'other' option and fills the text input`, () => {
            const customGender = `Non-binary`;
            const genderedMembership = cloneDeep(mockOrganizationMembership);
            genderedMembership.user.gender = customGender;
            mockUseGetOrganizationMembership.mockReturnValue({
                data: {
                    user: {
                        membership: genderedMembership,
                    },
                },
                loading: false,
            });

            render();

            expect(inputs.gender.radio.other()).toBeChecked();
            expect(inputs.gender.other()).toHaveValue(customGender);
        });

        test.skip(`displays a success message when the API returns successfully`, async () => {
            const { submitButton } = render();

            mockUpdateOrganizationMembership.mockImplementationOnce(async () => {
                await utils.sleep(0);
                return {};
            });

            const expectedMembership = {
                // Defaults - from original membership (contactInfo is disabled)
                email: mockOrganizationMembership.user.email,
                phone: undefined,
                user_id: mockOrganizationMembership.user_id,
                organization_id: mockOrganizationMembership.organization_id,
                // Update all other properties to another valid OrganizationMembership
                alternate_email: mockOrganizationMembership2.user.alternate_email,
                alternate_phone: mockOrganizationMembership2.user.alternate_phone,
                date_of_birth: mockOrganizationMembership2.user.date_of_birth,
                family_name: mockOrganizationMembership2.user.family_name,
                gender: mockOrganizationMembership2.user.gender,
                given_name: mockOrganizationMembership2.user.given_name,
                organization_role_ids: mockOrganizationMembership2.roles.filter(isActive).map(role => role.role_id),
                school_ids: [ schoolC.school_id ],
                shortcode: mockOrganizationMembership2.shortcode,
            };

            await clearAllInputs();

            enter.alternativeEmail(expectedMembership.alternate_email);
            enter.alternativePhone(expectedMembership.alternate_phone);
            enter.birthday(formatDateOfBirth(expectedMembership.date_of_birth));
            enter.familyName(expectedMembership.family_name);
            userEvent.click(inputs.gender.radio.female());
            enter.givenName(expectedMembership.given_name);
            enter.shortcode(expectedMembership.shortcode);
            await enter.roles(expectedMembership.organization_role_ids);
            await enter.schools(expectedMembership.school_ids);

            userEvent.click(submitButton);

            await waitForButtonToLoad(submitButton);

            expect(mockUpdateOrganizationMembership).toHaveBeenCalledTimes(1);
            expect(mockUpdateOrganizationMembership).toHaveBeenCalledWith({
                variables: expectedMembership,
            });

            expectSnackbarSuccess(mockIntl.formatMessage({
                id: `editDialog_savedSuccess`,
            }));

            expect(mockOnClose).toHaveBeenCalledTimes(1);
            expect(mockOnClose).toHaveBeenCalledWith(true);
            expect(global.console.error).not.toHaveBeenCalled();
        });
    });

    describe(`delete`, () => {
        mockDeleteOrganizationMembership.mockResolvedValue({});

        beforeEach(() => {
            mockDeletePrompt.mockClear();
            mockDeleteOrganizationMembership.mockClear();
        });

        function expectDeleteCalled () {
            expect(mockDeletePrompt).toHaveBeenCalledTimes(1);
            expect(mockDeletePrompt).toHaveBeenCalledWith({
                title: mockIntl.formatMessage({
                    id: `users_deleteTitle`,
                }),
                entityName: `${mockOrganizationMembership.user.given_name} ${mockOrganizationMembership.user.family_name}`,
            });

            expect(mockDeleteOrganizationMembership).toHaveBeenCalledTimes(1);
            expect(mockDeleteOrganizationMembership).toHaveBeenCalledWith({
                variables: {
                    organization_id: mockOrganizationMembership.organization_id,
                    user_id: mockOrganizationMembership.user_id,
                },
            });
        }

        async function triggerDelete () {
            userEvent.click(screen.getByText(`Delete`));
            // Need to flush Promises, otherwise the snackbar hasn't had time to enqueue
            await utils.sleep(0);
        }

        test(`if confirmed deletes the OrganizationMembership of the current userId and organizationId`, async () => {
            render();

            await triggerDelete();

            expectDeleteCalled();

            expectSnackbarSuccess(mockIntl.formatMessage({
                id: `editDialog_deleteSuccess`,
            }));

            expect(mockOnClose).toHaveBeenCalledTimes(1);
            expect(mockOnClose).toHaveBeenCalledWith(true);
        });

        test(`if not confirmed, does not delete OrganizationMembership`, async () => {
            render();

            mockDeletePrompt.mockResolvedValueOnce(false);

            await triggerDelete();

            expect(mockDeleteOrganizationMembership).not.toHaveBeenCalled();
            expect(mockOnClose).not.toHaveBeenCalled();
            expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
        });

        test(`if confirmed but delete request errors, shows an error snackbar`, async () => {
            render();

            mockDeleteOrganizationMembership.mockImplementationOnce(async () => {throw new Error(`Failed`);});

            await triggerDelete();

            expectDeleteCalled();
            expect(mockOnClose).not.toHaveBeenCalled();
            expectSnackbarError(mockIntl.formatMessage({
                id: `editDialog_deleteError`,
            }));
        });
    });

    test(`clears the form after closing and reopening the dialog`, async () => {
        const { rerender } = render();

        enter.givenName(`Dave`);

        rerender(withMockIntl(<EditDialog
            open={false}
            onClose={mockOnClose} />));

        await waitForElementToBeRemoved(screen.getByRole(`presentation`, {
            hidden: true,
        }));

        rerender(withMockIntl(<EditDialog
            open
            onClose={mockOnClose} />));

        expect(inputs.givenName()).toHaveValue(mockOrganizationMembership.user.given_name);
    });

});
