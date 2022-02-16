import EditDialog,
{ mapUserNodeToFormState } from "./Edit";
import { mockGetOrganizationMembership } from "@/api/__mocks__/organizationMemberships";
import { mockGetOrganizationRoles } from "@/api/__mocks__/roles";
import { mockUseGetPaginatedSchools } from "@/api/__mocks__/schools";
import {
    DeleteOrganizationMembershipRequest,
    DeleteOrganizationMembershipResponse,
    UpdateOrganizationMembershipRequest,
    UpdateOrganizationMembershipResponse,
    useGetOrganizationUserNode,
} from "@/api/organizationMemberships";
import { useGetOrganizationRoles } from "@/api/roles";
import { useGetPaginatedSchools } from "@/api/schools";
import {
    GetUserNodeRequest,
    GetUserNodeResponse,
} from "@/api/users";
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
import { usePermission } from "@/utils/permissions";
import { UserGenders } from "@/utils/users";
import {
    MutationTuple,
    QueryResult,
} from "@apollo/client";
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
import { mockSchoolsData } from "@tests/mockDataSchools";
import { mockOrg } from "@tests/mockOrganizationData";
import { mockRoles } from "@tests/mockRoles";
import { mockEnqueueSnackbar } from "@tests/mocks";
import { schoolA } from "@tests/mocks/mockSchools";
import {
    mockOrganizationMembership2,
    mockOrganizationMemberships,
    mockUserNode,
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
        useGetOrganizationUserNode: jest.fn(),
        useDeleteOrganizationMembership: () => [ mockDeleteOrganizationMembership ],
        useUpdateOrganizationMembership: () => [ mockUpdateOrganizationMembership ],
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

jest.mock(`@/utils/common`, () => {
    return {
        useDeleteEntityPrompt: () => mockDeletePrompt,
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

let mockUseGetOrganizationUserNode = (useGetOrganizationUserNode as jest.MockedFunction<typeof useGetOrganizationUserNode>);

beforeAll(() => {
    (useGetPaginatedSchools as jest.MockedFunction<typeof useGetPaginatedSchools>).mockReturnValue(mockUseGetPaginatedSchools);
    (useGetOrganizationRoles as jest.MockedFunction<typeof useGetOrganizationRoles>).mockReturnValue(mockGetOrganizationRoles);
    mockUseGetOrganizationUserNode = mockUseGetOrganizationUserNode.mockReturnValue(mockGetOrganizationMembership);
});

beforeEach(() => {
    mockUsePermission.mockReturnValue(true);
});

const mockOrganizationMembership = mockOrganizationMemberships[0];

describe(`mapOrganizationMembershipToFormState`, () => {
    test(`inactive schools are ignored`, () => {
        expect(mapUserNodeToFormState(mockUserNode).schools)
            .toEqual([ schoolA.school_id ]);
    });

    test(`inactive roles are ignored`, () => {
        expect(mapUserNodeToFormState(mockUserNode).roles)
            .toEqual(mockUserNode.roles?.filter(isActive).map(role => role.id));
    });

    test(`maps properties when all are specified`, () => {
        const expected: State = {
            alternativeEmail: mockUserNode.alternateContactInfo?.email ?? ``,
            alternativePhone: mockUserNode.alternateContactInfo?.phone ?? ``,
            birthday: mockUserNode.dateOfBirth ?? ``,
            contactInfo: mockUserNode.contactInfo?.email ?? ``,
            familyName: mockUserNode.familyName ?? ``,
            gender: mockUserNode.gender ?? ``,
            givenName: mockUserNode.givenName ?? ``,
            roles: mockUserNode.roles?.filter(isActive).map(role => role.id ?? ``) ?? [],
            schools: mockUserNode.schools?.filter(isActive).map(school => school.id ?? ``) ?? [],
            shortcode: mockUserNode.organizationMembershipsConnection?.edges[0]?.node.shortCode ?? ``,
        };
        expect(mapUserNodeToFormState(mockUserNode)).toEqual(expected);
    });

    test(`maps to defaults when the minimum is specified`, () => {
        expect(mapUserNodeToFormState({
            id: ``,
            givenName: ``,
            familyName: ``,
            gender: `female`,
        })).toEqual(defaultState);
    });
});

describe(`user edit form`, () => {
    const originalConsoleError = global.console.error;
    const mockOnClose = jest.fn();

    const render = () => {
        const view = renderWithIntl(<EditDialog
            open
            userId={mockUserNode.id}
            onClose={mockOnClose} />);

        const submitButton = screen.getByText(mockIntl.formatMessage({
            id: `editDialog_save`,
        })).closest(`button`);
        if (submitButton === null) {
            throw getElementError(`Unable to find submitButton`, view.container);
        }
        return {
            ...view,
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

    describe(`edit`, () => {
        test(`loads the OrganizationMembership into the form state`, () => {
            render();
            expect(inputs.givenName()).toHaveValue(mockUserNode.givenName);
            expect(inputs.familyName()).toHaveValue(mockUserNode.familyName);
            expect(inputs.contactInfo()).toHaveValue(mockUserNode.contactInfo?.email);
            expect(inputs.birthday()).toHaveValue(formatDateOfBirth(mockUserNode.dateOfBirth as string));
            expect(inputs.shortcode()).toHaveValue(mockUserNode.organizationMembershipsConnection?.edges[0]?.node.shortCode);
            expect(inputs.roles()).toHaveTextContent(mockRoles.organizationAdmin.role_name as string);
            expect(inputs.alternativeEmail()).toHaveValue(mockUserNode.alternateContactInfo?.email);
            expect(inputs.alternativePhone()).toHaveValue(mockUserNode.alternateContactInfo?.phone);
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
            mockUseGetOrganizationUserNode.mockReturnValue({
                data: {
                    userNode: {
                        ...mockUserNode,
                        gender,
                    },
                },
                loading: false,
            } as QueryResult<GetUserNodeResponse, GetUserNodeRequest>);

            render();

            expect(radio()).toBeChecked();
        });

        test(`an 'other' gender pre-selects the 'other' option and fills the text input`, () => {
            const customGender = `non-binary`;
            mockUseGetOrganizationUserNode.mockReturnValue({
                data: {
                    userNode: {
                        ...mockUserNode,
                        gender: customGender,
                    },
                },
                loading: false,
            } as QueryResult<GetUserNodeResponse, GetUserNodeRequest>);

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
                school_ids: [ mockSchoolsData.schoolsConnection.edges[1].node.id ],
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
                entityName: `${mockUserNode.givenName} ${mockUserNode.familyName}`,
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

        await waitForElementToBeRemoved(screen.getAllByRole(`presentation`, {
            hidden: true,
        })[0]);

        rerender(withMockIntl(<EditDialog
            open
            onClose={mockOnClose} />));

        expect(inputs.givenName()).toHaveValue(mockUserNode.givenName);
    });
});
