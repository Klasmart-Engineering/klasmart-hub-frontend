/* eslint-disable react/jsx-closing-bracket-location */
import CreateDialog from "./Create";
import { commonDialogTests } from "./shared.test";
import { mockGetOrganizationRoles } from "@/api/__mocks__/roles";
import { mockUseGetPaginatedSchools } from "@/api/__mocks__/schools";
import {
    CreateOrganizationMembershipRequest,
    CreateOrganizationMembershipResponse,
} from "@/api/organizationMemberships";
import { useGetOrganizationRoles } from "@/api/roles";
import { useGetPaginatedSchools } from "@/api/schools";
import {
    enter,
    inputs,
} from "@/components/User/Dialog/Form.test";
import {
    mockIntl,
    renderWithIntl,
    withMockIntl,
} from "@/locale/__mocks__/locale";
import { usePermission } from "@/utils/permissions";
import { UserGenders } from "@/utils/users";
import { MutationTuple } from "@apollo/client";
import { utils } from "@kl-engineering/kidsloop-px";
import {
    getElementError,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectSnackbarSuccess } from "@tests/expect";
import { mockOrg } from "@tests/mockOrganizationData";
import { mockRoles } from "@tests/mockRoles";
import { mockEnqueueSnackbar } from "@tests/mocks";
import { waitForButtonToLoad } from "@tests/waitFor";
import React from "react";

const mockOnClose = jest.fn();

const mockCreateOrganizationMembership = jest.fn() as jest.Mocked<
    MutationTuple<
        CreateOrganizationMembershipResponse,
        CreateOrganizationMembershipRequest
    >
>[0];

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            id: mockOrg.organization_id,
        }),
    };
});

jest.mock(`@/api/organizationMemberships`, () => {
    return {
        useCreateOrganizationMembership: () => [ mockCreateOrganizationMembership ],
    };
});

jest.mock(`@/api/schools`, () => {
    return {
        useGetPaginatedSchools: jest.fn(),
    };
});

jest.mock(`@/api/roles`, () => {
    return {
        useGetOrganizationRoles: jest.fn(),
    };
});

jest.mock(`@/utils/permissions`, () => {
    return {
        usePermission: jest.fn(),
    };
});

const mockUsePermission = usePermission as jest.MockedFunction<
    typeof usePermission
>;

const validOrganizationMembership = {
    organization_id: mockOrg.organization_id,
    user_id: `720e17f0-39f1-4631-a27d-86e3a06126ff`,
    user: {
        given_name: `Joe`,
        family_name: `Bloggs`,
        email: `joe.bloggs@calmid.com`,
    },
    roles: [ mockRoles.student ],
};

const render = () => {

    const renderResult = renderWithIntl(<CreateDialog
        open
        onClose={mockOnClose}
    />);

    const submitButton = screen.getByText(mockIntl.formatMessage({
        id: `createUser_create`,
    }))
        .closest(`button`);
    if (submitButton === null) {
        throw getElementError(`Unable to find submitButton`, renderResult.container);
    }
    return {
        ...renderResult,
        submitButton,
    };
};

const fillValidForm = async () => {
    enter.givenName(validOrganizationMembership.user.given_name);
    enter.familyName(validOrganizationMembership.user.family_name);
    enter.contactInfo(validOrganizationMembership.user.email);
    await enter.roles(validOrganizationMembership.roles.map((role) => role.role_id));
};

beforeAll(() => {
    (useGetPaginatedSchools as jest.MockedFunction<typeof useGetPaginatedSchools>).mockReturnValue(mockUseGetPaginatedSchools);
    (
        useGetOrganizationRoles as jest.MockedFunction<
            typeof useGetOrganizationRoles
        >
    ).mockReturnValue(mockGetOrganizationRoles);
});

beforeEach(() => {
    mockOnClose.mockClear();
    mockCreateOrganizationMembership.mockClear();
    mockEnqueueSnackbar.mockClear();
    mockUsePermission.mockReturnValue({
        loading: false,
        hasPermission: true,
    });
});

commonDialogTests({
    type: `Create`,
    mockApi: mockCreateOrganizationMembership,
    mockOnClose,
    translations: {
        cancelButton: `createUser_cancel`,
        submitButton: `createUser_create`,
        genericError: `editDialog_savedError`,
    },
    render,
    beforeSubmit: fillValidForm,
});

describe(`submitting the form`, () => {
    const originalConsoleError = global.console.error;
    beforeEach(() => {
        global.console.error = jest.fn();
    });

    afterEach(() => {
        global.console.error = originalConsoleError;
    });

    test(`displays a success message when the API returns successfully`, async () => {
        const { submitButton } = render();

        await fillValidForm();

        mockCreateOrganizationMembership.mockImplementationOnce(async () => {
            await utils.sleep(0);
            return {};
        });

        userEvent.click(submitButton);

        await waitForButtonToLoad(submitButton);

        expect(mockCreateOrganizationMembership)
            .toHaveBeenCalledTimes(1);
        expect(mockCreateOrganizationMembership)
            .toHaveBeenCalledWith({
                variables: {
                    alternate_email: ``,
                    alternate_phone: ``,
                    date_of_birth: ``,
                    email: validOrganizationMembership.user.email,
                    family_name: validOrganizationMembership.user.family_name,
                    // Gender defaults to FEMALE
                    gender: UserGenders.FEMALE,
                    given_name: validOrganizationMembership.user.given_name,
                    organization_id: validOrganizationMembership.organization_id,
                    organization_role_ids: validOrganizationMembership.roles.map((role) => role.role_id),
                    phone: undefined,
                    school_ids: [],
                    shortcode: ``,
                },
            });

        expectSnackbarSuccess(mockIntl.formatMessage({
            id: `createUser_success`,
        }));

        expect(mockOnClose)
            .toHaveBeenCalledTimes(1);
        expect(mockOnClose)
            .toHaveBeenCalledWith(true);
        expect(global.console.error).not.toHaveBeenCalled();
    });
});

test(`clears the form after closing and reopening the dialog`, async () => {
    const { rerender } = render();

    enter.givenName(validOrganizationMembership.user.given_name);

    rerender(withMockIntl(<CreateDialog
        open={false}
        onClose={mockOnClose}
    />));

    await waitForElementToBeRemoved(screen.getAllByRole(`presentation`, {
        hidden: true,
    })[0]);

    rerender(withMockIntl(<CreateDialog
        open
        onClose={mockOnClose}
    />));

    expect(inputs.givenName())
        .toHaveValue(``);
});
