import UsersTable from './Table';
import { GET_ORGANIZATION_ROLES } from '@/operations/queries/getOrganizationRoles';
import { Status } from "@/types/graphQL";
import { useGetTableFilters } from '@/utils/filters';
import { sortSchoolNames } from '@/utils/schools';
import { sortRoleNames } from '@/utils/userRoles';
import { MockedProvider } from '@apollo/client/testing';
import {
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import {
    mockOrgId,
    mockPaginatedUsers,
    mockRolesFilterList,
} from '@tests/mockDataUsers';
import { render } from "@tests/utils/render";
import React from 'react';

const rows = mockPaginatedUsers?.usersConnection?.edges?.map((edge) => ({
    id: edge.node.id,
    givenName: edge.node.givenName ?? ``,
    familyName: edge.node.familyName ?? ``,
    avatar: edge.node.avatar ?? ``,
    email: edge.node.contactInfo?.email ?? ``,
    phone: edge.node.contactInfo?.phone ?? ``,
    roleNames: edge.node.roles?.filter((role) => role.status === Status.ACTIVE).map((role) => role.name).sort(sortRoleNames) ?? [],
    schoolNames: edge.node.schools?.filter((school) => school.status === Status.ACTIVE).map((school) => school.name).sort(sortSchoolNames) ?? [],
    status: edge.node.organizations?.[0].userStatus ?? Status.INACTIVE,
    joinDate: edge.node.organizations ? new Date(edge.node.organizations?.[0].joinDate) : new Date(),
})) ?? [];

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            id: mockOrgId,
        }),
    };
});

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

test(`Users table page renders correctly`, async () => {
    const component = <UsersTable
        order="asc"
        orderBy="name"
        rows={rows}
    />;
    render(component);

    await waitFor(() => {
        expect(screen.queryByText(`Users`)).toBeInTheDocument();
        expect(screen.queryByText(`John`)).toBeInTheDocument();
    });
});

const mocks = [
    {
        request: {
            query: GET_ORGANIZATION_ROLES,
            variables: {
                organization_id: mockOrgId,
            },
        },
        result: {
            data: mockRolesFilterList,
        },
    },
];

test(`useGetTableFilters hook should return mapped user roles data for filter drop down in users`, async () => {
    const wrapper = ({ children }: { children: [] }) => (
        <MockedProvider
            mocks={mocks}
            addTypename={false}>
            {children}
        </MockedProvider>
    );

    const { result, waitFor } = renderHook(() => useGetTableFilters(mockOrgId, {
        queryUserRoles: true,
    }), {
        wrapper,
    });

    await waitFor(() => {
        expect(result.current.userRolesFilterValueOptions).toHaveLength(5);
        expect(result.current.userRolesFilterValueOptions[0].label).toBe(`Test Organization Admin`);
        expect(result.current.userRolesFilterValueOptions[1].label).toBe(`Test School Admin`);
        expect(result.current.userRolesFilterValueOptions[0].value).toBe(`87aca549-fdb6-4a63-97d4-d563d4a4690a`);
        expect(result.current.userRolesFilterValueOptions[1].value).toBe(`87aca549-fdb6-4a63-97d4-d563d4a4690b`);
    });
});

const defaultProps = {
    order: `asc`,
    orderBy: `givenName`,
    rows: rows,
};

describe(`Users Table`, () => {
    describe(`Render`, () => {
        test(`default props`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component);

            await waitFor(() => {
                expect(screen.queryByText(`John`)).toBeInTheDocument();
            });
        });
    });

    describe(`Interact`, () => {
        test(`add filter`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component, {
                mockedResponses: mocks,
            });

            fireEvent.click(screen.getByText(`Add Filter`));

            await waitFor(() => {
                expect(screen.queryAllByText(`Organization Roles`)).toHaveLength(3);
                expect(screen.queryAllByText(`Organization Roles`, {
                    selector: `span`,
                })).toHaveLength(1);
                expect(screen.queryAllByText(`Column`)).toHaveLength(2);
            });

            const valueSelectInput = screen.getByTestId(`ValuesSelectTextInput`) as HTMLInputElement;
            expect(valueSelectInput.value).toEqual(``);

            fireEvent.mouseDown(screen.getAllByRole(`button`, {
                hidden: true,
            })[6]);

            await waitFor(() => {
                expect(screen.getByRole(`listbox`, {
                    hidden: true,
                })).not.toBeNull();
                expect(screen.queryAllByText(`Test Organization Admin`, {
                    selector: `span`,
                })).toHaveLength(1);
            });

            const valueOptions = screen.getAllByRole(`option`, {
                hidden: true,
            });
            fireEvent.click(valueOptions[2]);

            await waitFor(() => {
                expect(valueSelectInput.value).toEqual(`87aca549-fdb6-4a63-97d4-d563d4a4690a`);
                expect(screen.queryAllByText(`Test Organization Admin`, {
                    selector: `span`,
                })).toHaveLength(1);
            });

            fireEvent.click(screen.getAllByText(`Add Filter`)[1]);

            await waitFor(() => {
                expect(screen.getByTestId(`roleNamesChipLabel`)).toHaveTextContent(`Organization Roles equals "Test Organization Admin"`);
            });
        });

        test(`edit filter`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component, {
                mockedResponses: mocks,
            });

            fireEvent.click(screen.getByText(`Add Filter`));

            await waitFor(() => {
                expect(screen.queryAllByText(`Organization Roles`)).toHaveLength(3);
                expect(screen.queryAllByText(`Organization Roles`, {
                    selector: `span`,
                })).toHaveLength(1);
                expect(screen.queryAllByText(`Column`)).toHaveLength(2);
            });

            let valueSelectInput = screen.getByTestId(`ValuesSelectTextInput`) as HTMLInputElement;
            expect(valueSelectInput.value).toEqual(``);

            fireEvent.mouseDown(screen.getAllByRole(`button`, {
                hidden: true,
            })[6]);

            await waitFor(() => {
                expect(screen.getByRole(`listbox`, {
                    hidden: true,
                })).not.toBeNull();
                expect(screen.queryAllByText(`Test Organization Admin`, {
                    selector: `span`,
                })).toHaveLength(1);
            });

            let valueOptions = screen.getAllByRole(`option`, {
                hidden: true,
            });
            fireEvent.click(valueOptions[2]);

            await waitFor(() => {
                expect(valueSelectInput.value).toEqual(`87aca549-fdb6-4a63-97d4-d563d4a4690a`);
                expect(screen.queryAllByText(`Test Organization Admin`, {
                    selector: `span`,
                })).toHaveLength(1);
            });

            fireEvent.click(screen.getAllByText(`Add Filter`)[1]);

            await waitFor(() => {
                expect(screen.getByTestId(`roleNamesChipLabel`)).toHaveTextContent(`Organization Roles equals "Test Organization Admin"`);
            });

            fireEvent.click(screen.getByTestId(`roleNamesChipLabel`));

            valueSelectInput = screen.getByTestId(`ValuesSelectTextInput`) as HTMLInputElement;
            expect(valueSelectInput.value).toEqual(`87aca549-fdb6-4a63-97d4-d563d4a4690a`);

            fireEvent.mouseDown(screen.getAllByRole(`button`, {
                hidden: true,
            })[8]);

            await waitFor(() => {
                expect(screen.getByRole(`listbox`, {
                    hidden: true,
                })).not.toBeNull();
                expect(screen.queryAllByText(`Test Organization Admin`, {
                    selector: `span`,
                })).toHaveLength(1);
            });

            valueOptions = screen.getAllByRole(`option`, {
                hidden: true,
            });
            fireEvent.click(valueOptions[2]);
            fireEvent.click(valueOptions[3]);

            await waitFor(() => {
                expect(valueSelectInput.value).toEqual(`87aca549-fdb6-4a63-97d4-d563d4a4690b`);
                expect(screen.queryAllByText(`Test School Admin`, {
                    selector: `span`,
                })).toHaveLength(1);
            });

            fireEvent.click(screen.getByText(`Save Filter`));

            await waitFor(() => {
                expect(screen.getByTestId(`roleNamesChipLabel`)).toHaveTextContent(`Organization Roles equals "Test School Admin"`);
            });
        });

        test(`remove filter`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component, {
                mockedResponses: mocks,
            });

            fireEvent.click(screen.getByText(`Add Filter`));

            await waitFor(() => {
                expect(screen.queryAllByText(`Organization Roles`)).toHaveLength(3);
                expect(screen.queryAllByText(`Organization Roles`, {
                    selector: `span`,
                })).toHaveLength(1);
                expect(screen.queryAllByText(`Column`)).toHaveLength(2);
            });

            const valueSelectInput = screen.getByTestId(`ValuesSelectTextInput`) as HTMLInputElement;
            expect(valueSelectInput.value).toEqual(``);

            fireEvent.mouseDown(screen.getAllByRole(`button`, {
                hidden: true,
            })[6]);

            await waitFor(() => {
                expect(screen.getByRole(`listbox`, {
                    hidden: true,
                })).not.toBeNull();
                expect(screen.queryAllByText(`Test Organization Admin`, {
                    selector: `span`,
                })).toHaveLength(1);
            });

            const valueOptions = screen.getAllByRole(`option`, {
                hidden: true,
            });
            fireEvent.click(valueOptions[2]);

            await waitFor(() => {
                expect(valueSelectInput.value).toEqual(`87aca549-fdb6-4a63-97d4-d563d4a4690a`);
                expect(screen.queryAllByText(`Test Organization Admin`, {
                    selector: `span`,
                })).toHaveLength(1);
            });

            fireEvent.click(screen.getAllByText(`Add Filter`)[1]);

            await waitFor(() => {
                expect(screen.getByTestId(`roleNamesChipLabel`)).toHaveTextContent(`Organization Roles equals "Test Organization Admin"`);
            });

            const deleteIcon = document.querySelector(`.MuiChip-deleteIcon`) as HTMLElement;

            await waitFor(() => {
                fireEvent.click(deleteIcon);
            });

            await waitFor(() => {
                expect(screen.queryAllByText(`Organization Roles`, {
                    selector: `span`,
                })).toHaveLength(0);
                expect(screen.queryAllByText(`equals`, {
                    selector: `span`,
                })).toHaveLength(0);
                expect(screen.queryAllByText(`"Test Organization Admin"`, {
                    selector: `span`,
                })).toHaveLength(0);
            });
        });

        test(`clear all filters`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component, {
                mockedResponses: mocks,
            });

            fireEvent.click(screen.getByText(`Add Filter`));

            await waitFor(() => {
                expect(screen.queryAllByText(`Organization Roles`)).toHaveLength(3);
                expect(screen.queryAllByText(`Organization Roles`, {
                    selector: `span`,
                })).toHaveLength(1);
                expect(screen.queryAllByText(`Column`)).toHaveLength(2);
            });

            const valueSelectInput = screen.getByTestId(`ValuesSelectTextInput`) as HTMLInputElement;
            expect(valueSelectInput.value).toEqual(``);

            fireEvent.mouseDown(screen.getAllByRole(`button`, {
                hidden: true,
            })[6]);

            await waitFor(() => {
                expect(screen.getByRole(`listbox`, {
                    hidden: true,
                })).not.toBeNull();
                expect(screen.queryAllByText(`Test Organization Admin`, {
                    selector: `span`,
                })).toHaveLength(1);
            });

            const valueOptions = screen.getAllByRole(`option`, {
                hidden: true,
            });
            fireEvent.click(valueOptions[2]);

            await waitFor(() => {
                expect(valueSelectInput.value).toEqual(`87aca549-fdb6-4a63-97d4-d563d4a4690a`);
                expect(screen.queryAllByText(`Test Organization Admin`, {
                    selector: `span`,
                })).toHaveLength(1);
            });

            fireEvent.click(screen.getAllByText(`Add Filter`)[1]);

            await waitFor(() => {
                expect(screen.getByTestId(`roleNamesChipLabel`)).toHaveTextContent(`Organization Roles equals "Test Organization Admin"`);
            });

            fireEvent.click(screen.getByTestId(`clearFilters`));

            await waitFor(() => {
                expect(screen.queryAllByText(`Organization Roles`, {
                    selector: `span`,
                })).toHaveLength(0);
                expect(screen.queryAllByText(`equals`, {
                    selector: `span`,
                })).toHaveLength(0);
                expect(screen.queryAllByText(`"Test Organization Admin"`, {
                    selector: `span`,
                })).toHaveLength(0);
            });
        });

        test(`input search text`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component);

            const searchInput = screen.getByPlaceholderText(`Search`) as HTMLInputElement;

            fireEvent.change(searchInput, {
                target: {
                    value: `Mike Portnoy`,
                },
            });

            await waitFor(() => {
                expect(searchInput.value).toEqual(`Mike Portnoy`);
            });
        });

        test(`clear search text`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component);

            const searchInput = screen.getByPlaceholderText(`Search`) as HTMLInputElement;

            fireEvent.change(searchInput, {
                target: {
                    value: ``,
                },
            });

            await waitFor(() => {
                expect(searchInput.value).toEqual(``);
            });
        });

        test(`sort givenName asc to desc`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component);

            let userRows = screen.getAllByTestId(`tableRow`, {
                exact: false,
            });

            expect(userRows).toHaveLength(2);
            expect(userRows[0]).toHaveTextContent(`Andrew`);
            expect(userRows[1]).toHaveTextContent(`John`);

            fireEvent.click(screen.getByTestId(`givenNameSortHandler`));

            await waitFor(() => {
                userRows = screen.getAllByTestId(`tableRow`, {
                    exact: false,
                });
                expect(userRows).toHaveLength(2);
                expect(userRows[0]).toHaveTextContent(`John`);
                expect(userRows[1]).toHaveTextContent(`Andrew`);
            });
        });

        test(`sort givenName desc to asc`, async () => {
            const mockedProps = {
                ...defaultProps,
                order: `desc`,
            };

            const component = <UsersTable {...mockedProps} />;

            render(component);

            let userRows = screen.getAllByTestId(`tableRow`, {
                exact: false,
            });

            expect(userRows).toHaveLength(2);
            expect(userRows[0]).toHaveTextContent(`John`);
            expect(userRows[1]).toHaveTextContent(`Andrew`);

            fireEvent.click(screen.getByTestId(`givenNameSortHandler`));

            await waitFor(() => {
                userRows = screen.getAllByTestId(`tableRow`, {
                    exact: false,
                });
                expect(userRows).toHaveLength(2);
                expect(userRows[0]).toHaveTextContent(`Andrew`);
                expect(userRows[1]).toHaveTextContent(`John`);
            });
        });
    });
});
