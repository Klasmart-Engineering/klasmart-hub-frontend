import Form,
{
    defaultState,
    Props,
} from "./Form";
import { mockGetOrganizationRoles } from "@/api/__mocks__/roles";
import { mockUseGetPaginatedSchools } from "@/api/__mocks__/schools";
import { APIErrorCode } from "@/api/errors";
import { useGetOrganizationRoles } from "@/api/roles";
import { useGetPaginatedSchools } from "@/api/schools";
import {
    mockIntl,
    renderWithIntl,
    withMockIntl,
} from "@/locale/__mocks__/locale";
import { usePermission } from "@/utils/permissions";
import { UserGenders } from "@/utils/users";
import {
    fireEvent,
    screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    deselectAll,
    selectAccordionOptions,
    toggleAccordion,
} from "@tests/events";
import {
    expectAccordionExpanded,
    expectFormControlToHaveError,
    expectInputNotToHaveError,
    expectInputToHaveError,
} from "@tests/expect";
import { mockSchoolsData } from "@tests/mockDataSchools";
import { mockOrg } from "@tests/mockOrganizationData";
import { mockRoles } from "@tests/mockRoles";
import {
    getAccordionByLabelText,
    getFormControl,
} from "@tests/queries";
import React from "react";

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            id: mockOrg.organization_id,
        }),
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

beforeAll(() => {
    Object.defineProperty(window, `matchMedia`, {
        writable: true,
        value: (query: string): MediaQueryList => ({
            media: query,
            // this is the media query that @material-ui/pickers uses to determine if a device is a desktop device
            matches: query === `(pointer: fine)`,
            onchange: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: () => false,
        }),
    });
    (useGetPaginatedSchools as jest.MockedFunction<typeof useGetPaginatedSchools>).mockReturnValue(mockUseGetPaginatedSchools);
    (useGetOrganizationRoles as jest.MockedFunction<typeof useGetOrganizationRoles>).mockReturnValue(mockGetOrganizationRoles);
});

beforeEach(() => {
    mockOnChange.mockClear();
    mockOnValidation.mockClear();
    mockUsePermission.mockReturnValue({
        loading: false,
        hasPermission: true,
    });
});

const mockOnChange = jest.fn();
const mockOnValidation = jest.fn();
const defaultProps = {
    initialState: defaultState,
    isExistingUser: false,
    onChange: mockOnChange,
    onValidation: mockOnValidation,
};

const render = (props?: Partial<Props>) => {
    return renderWithIntl(<Form
        {...defaultProps}
        {...props}
    />);
};

function expectOtherGender (value: string) {
    expect(inputs.gender.radio.other())
        .toBeChecked();

    const otherGender = inputs.gender.other();

    expect(otherGender)
        .toBeVisible();
    expect(otherGender.value)
        .toBe(value);
}

export const inputs = {
    givenName: () => {
        return screen.getByLabelText(mockIntl.formatMessage({
            id: `createUser_givenNameLabel`,
        }));
    },
    familyName: () => {
        return screen.getByLabelText(mockIntl.formatMessage({
            id: `createUser_familyNameLabel`,
        }));
    },
    contactInfo: () => {
        return screen.getByLabelText(mockIntl.formatMessage({
            id: `createUser_contactInfoLabel`,
        }));
    },
    gender: {
        radio: {
            male: () => {
                return screen.getByLabelText(mockIntl.formatMessage({
                    id: `user.gender.male`,
                }));
            },
            female: () => {
                return screen.getByLabelText(mockIntl.formatMessage({
                    id: `user.gender.female`,
                }));
            },
            preferNotToSay: () => {
                return screen.getByLabelText(mockIntl.formatMessage({
                    id: `user.gender.preferNotToSay`,
                }));
            },
            other: () => {
                return screen.getByLabelText(mockIntl.formatMessage({
                    id: `common.other`,
                }));
            },
        },
        other: () => {
            return screen.getByLabelText(mockIntl.formatMessage({
                id: `user.gender.pleaseSpecify`,
            })) as HTMLInputElement;
        },
    },
    birthday: () => {
        return screen.getByLabelText(mockIntl.formatMessage({
            id: `user.birthday`,
        }));
    },
    shortcode: () => {
        return screen.getByLabelText(mockIntl.formatMessage({
            id: `common.shortCode`,
        }));
    },
    roles: () => {
        return screen.getByLabelText(mockIntl.formatMessage({
            id: `createUser_rolesLabel`,
        }));
    },
    schools: () => {
        return screen.getByLabelText(mockIntl.formatMessage({
            id: `common.inputField.optional`,
        }, {
            inputField: mockIntl.formatMessage({
                id: `createUser_schoolsLabel`,
            }),
        }));
    },
    alternativeEmail: () => {
        return screen.getByLabelText(mockIntl.formatMessage({
            id: `common.email.alternative`,
        }));
    },
    alternativePhone: () => {
        return screen.getByLabelText(mockIntl.formatMessage({
            id: `common.phone.alternative`,
        }));
    },
};

export async function clearAllInputs () {
    [
        inputs.alternativeEmail(),
        inputs.alternativePhone(),
        inputs.birthday(),
        inputs.contactInfo(),
        inputs.familyName(),
        inputs.givenName(),
        inputs.shortcode(),
    ].forEach(input => userEvent.clear(input));
    await deselectAll(inputs.roles());
    await deselectAll(inputs.schools());
}

export const enter = {
    alternativeEmail: (value: string) => {
        userEvent.type(inputs.alternativeEmail(), value);
    },
    alternativePhone: (value: string) => {
        userEvent.type(inputs.alternativePhone(), value);
    },
    birthday: (value: string) => {
        // NB: can't use userEvent.type here, as it seems to not work with the `type="month"` input
        fireEvent.change(inputs.birthday(), {
            target: {
                value,
            },
        });
    },
    gender: (value: string) => {
        userEvent.click(inputs.gender.radio.other());
        userEvent.type(inputs.gender.other(), value);
    },
    givenName: (value: string) => {
        userEvent.type(inputs.givenName(), value);
    },
    familyName: (value: string) => {
        userEvent.type(inputs.familyName(), value);
    },
    contactInfo: (value: string) => {
        userEvent.type(inputs.contactInfo(), value);
    },
    roles: async (values: string[]) => {
        await selectAccordionOptions(inputs.roles(), values);
    },
    schools: async (values: string[]) => {
        await selectAccordionOptions(inputs.schools(), values);
    },
    shortcode: (value: string) => {
        userEvent.type(inputs.shortcode(), value);
    },
};

export const buttons = {
    close: () => screen.getByTestId(`CloseIcon`),
};

test(`givenName, familyName, contactInfo and roles are required`, async () => {
    render();

    expect(mockOnValidation)
        .toHaveBeenLastCalledWith(false);

    const fields = {
        givenName: {
            input: inputs.givenName(),
            attributeName: `Given Name`,
        },
        familyName: {
            input: inputs.familyName(),
            attributeName: `Family Name`,
        },
        contactInfo: {
            input: inputs.contactInfo(),
            attributeName: `Email/Phone`,
        },
        roles: {
            input: inputs.roles(),
            attributeName: `Organization Role`,
        },
    };

    Object.values(fields)
        .forEach(value => {
            expectInputToHaveError(value.input, mockIntl.formatMessage({
                id: `validation.error.attribute.required`,
            }, {
                attribute: value.attributeName,
            }));
        });

    enter.givenName(`Joe`);
    enter.familyName(`Bloggs`);
    enter.contactInfo(`joe.bloggs@calmid.com`);
    await enter.roles([ mockRoles.student.role_id ]);

    Object.values(fields)
        .map(value => {
            expectInputNotToHaveError(value.input);
        });

    expect(mockOnValidation)
        .toHaveBeenLastCalledWith(true);
});

test(`non-empty errors makes validation fail`, () => {
    const validState = {
        ...defaultState,
        givenName: `Joe`,
        familyName: `Bloggs`,
        contactInfo: `joe.bloggs@calmid.com`,
        roles: [ mockRoles.student.role_id ],
    };
    const { rerender } = render({
        initialState: validState,
    });

    expect(mockOnValidation)
        .toHaveBeenLastCalledWith(true);

    rerender(withMockIntl(<Form
        {...defaultProps}
        initialState={validState}
        errors={{
            givenName: {
                code: APIErrorCode.ERR_INVALID_MAX_LENGTH,
                message: `Too Long`,
            },
        }}
    />));

    expect(mockOnValidation)
        .toHaveBeenLastCalledWith(false);
});

test(`opens alternateContactInfo when clicked`, () => {
    render();

    const accordion = getAccordionByLabelText(`Alternative Contact Info`);

    toggleAccordion(accordion);

    expectAccordionExpanded(accordion);
});

test.each([
    {
        alternativeEmail: `joe.bloggs@calmid.com`,
    },
    {
        alternativePhone: `+447726930934`,
    },
])(`automatically opens alternateContactInfo if the initial state includes %s`, (alternateContactInfo) => {
    render({
        initialState: {
            ...defaultState,
            ...alternateContactInfo,
        },
    });

    const accordion = getAccordionByLabelText(`Alternative Contact Info`);

    expectAccordionExpanded(accordion);
});

test(`preserves MM-YYYY format of birthday from initial render`, () => {
    render({
        initialState: {
            ...defaultState,
            birthday: `01-2000`,
        },
    });

    expect(mockOnChange)
        .toHaveBeenLastCalledWith(expect.objectContaining({
            birthday: `01-2000`,
        }));
});

test(`user interaction correctly updates birthday input`, () => {
    render();
    const element = screen.getByTestId(`CalendarIcon`);
    userEvent.click(element);

    expect(screen.getAllByText(`2022`).length)
        .toBeGreaterThanOrEqual(1);
    const buttonYear = screen.getByRole(`button`, {
        name: `2022`,
    });
    userEvent.click(buttonYear);

    expect(screen.getAllByText(`Jan`).length)
        .toBeGreaterThanOrEqual(1);

    const buttonMonth = screen.getByRole(`button`, {
        name: `Jan`,
    });
    userEvent.click(buttonMonth);

    expect(inputs.birthday())
        .toHaveValue(`January 2022`);
    expect(mockOnChange)
        .toHaveBeenLastCalledWith(expect.objectContaining({
            birthday: `01-2022`,
        }));
});

test(`fails validation if birthday input is in the future`, () => {
    render();

    enter.birthday(`May 2040`);

    expectInputToHaveError(inputs.birthday(), /^The date must be on or before/);
});

test(`fails validation if birthday input is over 100 years ago`, () => {
    render();

    enter.birthday(`May 1900`);

    expectInputToHaveError(inputs.birthday(), /^The date must be on or after/);
});

test(`it disables contactInfo if isExistingUser=true`, () => {
    render({
        isExistingUser: true,
    });

    expect(inputs.contactInfo())
        .toBeDisabled();
});

test(`it enables contactInfo if isExistingUser=false`, () => {
    render({
        isExistingUser: false,
    });

    expect(inputs.contactInfo())
        .toBeEnabled();
});

test(`allows input of custom gender if 'Other' is selected`, () => {
    render();

    const otherGenderOption = inputs.gender.radio.other();

    userEvent.click(otherGenderOption);

    expectOtherGender(``);

    userEvent.type(inputs.gender.other(), `New gender`);

    expectOtherGender(`New gender`);
});

test.each([ inputs.gender.radio.male, inputs.gender.radio.preferNotToSay ])(`allows selection of gender=%s from the radio`, (labelCallback) => {
    render();

    // defaults to Female
    expect(inputs.gender.radio.female())
        .toBeChecked();

    const genderOption = labelCallback();

    userEvent.click(genderOption);

    expect(genderOption)
        .toBeChecked();
});

test.each([
    [ UserGenders.FEMALE, inputs.gender.radio.female ],
    [ UserGenders.MALE, inputs.gender.radio.male ],
    [ UserGenders.NOT_SPECIFIED, inputs.gender.radio.preferNotToSay ],
    // TODO remove this case once corner case handling is removed from `genderHandler() - (UD-852)`
    [ `not_specified`, inputs.gender.radio.preferNotToSay ],
])(`preselects radio input if initial state contains a valid option (gender=%s)`, (gender, radioOption) => {
    render({
        initialState: {
            ...defaultState,
            gender,
        },
    });

    expect(radioOption())
        .toBeChecked();
});

test(`preselects 'Other' and shows a text input if initial state doesn't match a radio option`, () => {
    const customGender = `Custom gender`;

    render({
        initialState: {
            ...defaultState,
            gender: customGender,
        },
    });

    expectOtherGender(customGender);
});

test(`fails validation of alternativeEmail if identical to contactInfo`, () => {
    const email = `joe.bloggs@calmid.com`;
    render({
        initialState: {
            ...defaultState,
            contactInfo: email,
            alternativeEmail: email,
        },
    });

    expectFormControlToHaveError({
        formControl: getFormControl({
            container: document.body,
            label: mockIntl.formatMessage({
                id: `common.email.alternative`,
            }),
        }),
        error: mockIntl.formatMessage({
            id: `users_alternativeEmailValidation`,
        }),
    });
});

test(`multiple schools selected in initial state`, () => {
    render({
        initialState: {
            ...defaultState,
            schools: [ mockSchoolsData.schoolsConnection.edges[0].node.id, mockSchoolsData.schoolsConnection.edges[1].node.id ],
        },
    });
    expect(screen.getByText(mockSchoolsData.schoolsConnection.edges[0].node.name))
        .toBeInTheDocument();
    expect(screen.getByText(mockSchoolsData.schoolsConnection.edges[1].node.name))
        .toBeInTheDocument();
});

test(`schools use 'id' as the value of the <Select>`, async () => {
    render();

    const schools = [ mockSchoolsData.schoolsConnection.edges[0].node.id ];

    await enter.schools(schools);

    expect(mockOnChange)
        .toHaveBeenLastCalledWith(expect.objectContaining({
            schools,
        }));
});

test(`schools use 'name' as the text of the <Select>`, () => {
    render();

    userEvent.click(inputs.schools());

    expect(screen.getByText(mockSchoolsData.schoolsConnection.edges[0].node.name as string))
        .toBeInTheDocument();
});

test(`multiple roles selected in initial state`, () => {
    render({
        initialState: {
            ...defaultState,
            roles: [ mockRoles.student.role_id, mockRoles.parent.role_id ],
        },
    });

    expect(screen.getByText(`Student`))
        .toBeInTheDocument();
    expect(screen.getByText(`Parent`))
        .toBeInTheDocument();
});

test(`roles use 'role_id' as the value of the <Select>`, async () => {
    render();

    const roles = [ mockRoles.student.role_id ];

    await enter.roles(roles);

    expect(mockOnChange)
        .toHaveBeenLastCalledWith(expect.objectContaining({
            roles,
        }));
});

test(`roles use 'role_name' as the text of the <Select>`, () => {
    render();

    userEvent.click(inputs.roles());

    expect(screen.getByText(mockRoles.student.role_name as string))
        .toBeInTheDocument();
});

test(`if the user has no full permissions some roles are restricted`, () => {
    mockUsePermission.mockReturnValue({
        loading: false,
        hasPermission: false,
    });
    render();

    userEvent.click(inputs.roles());

    expect(screen.queryByText(mockRoles.organizationAdmin.role_name as string)).not.toBeInTheDocument();
    expect(screen.queryByText(mockRoles.customRole.role_name as string)).not.toBeInTheDocument();
});
