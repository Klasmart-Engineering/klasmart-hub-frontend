import UsersTable from './Table';
import {
    buildOrganizationRoleFilter,
    GET_PAGINATED_ORGANIZATION_ROLES,
} from '@/operations/queries/getPaginatedOrganizationRoles';
import { Status } from "@/types/graphQL";
import { sortClassNames } from '@/utils/classes';
import { useGetTableFilters } from '@/utils/filters';
import { sortGradeNames } from '@/utils/grades';
import { sortSchoolNames } from '@/utils/schools';
import { sortRoleNames } from '@/utils/userRoles';
import {
    MockedProvider,
    MockedResponse,
} from '@apollo/client/testing';
import {
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import userEvent from '@testing-library/user-event';
import {
    mockOrgId,
    mockPaginatedUsers,
} from '@tests/mockDataUsers';
import { mockRolesConnection } from '@tests/mockRoles';
import { render } from "@tests/utils/render";

const rows = mockPaginatedUsers?.usersConnection?.edges?.map((edge) => ({
    id: edge.node.id,
    givenName: edge.node.givenName ?? ``,
    familyName: edge.node.familyName ?? ``,
    avatar: edge.node.avatar ?? ``,
    email: edge.node.contactInfo?.email ?? ``,
    phone: edge.node.contactInfo?.phone ?? ``,
    roleNames: edge.node.roles?.filter((role) => role.status === Status.ACTIVE)
        .map((role) => role.name)
        .sort(sortRoleNames) ?? [],
    schoolNames: edge.node.schools?.filter((school) => school.status === Status.ACTIVE)
        .map((school) => school.name)
        .sort(sortSchoolNames) ?? [],
    classNames: edge.node.classes?.filter((classObject) => classObject.status === Status.ACTIVE)
        .map((classObject) => classObject.name)
        .sort(sortClassNames) ?? [],
    gradeNames: edge.node.grades?.filter((grade) => grade.status === Status.ACTIVE)
        .map((grade) => grade.name)
        .sort(sortGradeNames) ?? [],
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
    const component = (<UsersTable
        order="asc"
        orderBy="name"
        rows={rows}
                       />);
    render(component);

    await waitFor(() => {
        expect(screen.queryByText(`Users`))
            .toBeInTheDocument();
        expect(screen.queryByText(`John`))
            .toBeInTheDocument();
    });
});

const mockQueryVariables = {
    direction: `FORWARD`,
    count: 50,
    order: `ASC`,
    orderBy: `name`,
    filter: buildOrganizationRoleFilter({
        organizationId: mockOrgId,
        search: ``,
        filters: [],
    }),
};

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_ROLES,
            variables: mockQueryVariables,
        },
        result: {
            data: {
                rolesConnection: {
                    ...mockRolesConnection,
                    pageInfo: {
                        hasNextPage: false,
                        hasPreviousPage: false,
                        startCursor: ``,
                        endCursor: ``,
                    },
                },
            },
        },
    },
];

test(`useGetTableFilters hook should return mapped user roles data for filter drop down in users`, async () => {
    const wrapper = ({ children }: { children: [] }) => (
        <MockedProvider
            mocks={mocks}
            addTypename={false}
        >
            {children}
        </MockedProvider>
    );

    const { result, waitFor } = renderHook(() => useGetTableFilters(mockOrgId, {
        queryUserRoles: true,
    }), {
        wrapper,
    });

    await waitFor(() => {
        expect(result.current.userRolesFilterValueOptions)
            .toHaveLength(7);
        expect(result.current.userRolesFilterValueOptions[0].label)
            .toBe(`Test Organization Admin`);
        expect(result.current.userRolesFilterValueOptions[1].label)
            .toBe(`Test School Admin`);
        expect(result.current.userRolesFilterValueOptions[0].value)
            .toBe(`87aca549-fdb6-4a63-97d4-d563d4a4690a`);
        expect(result.current.userRolesFilterValueOptions[1].value)
            .toBe(`87aca549-fdb6-4a63-97d4-d563d4a4690b`);
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
                expect(screen.queryByText(`John`))
                    .toBeInTheDocument();
            });
        });
    });

    describe(`Interact`, () => {
        test(`add filter`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component, {
                mockedResponses: mocks,
            });

            userEvent.click(screen.getByRole(`button`, {
                name: `Add Filter`,
            }));

            userEvent.click(screen.getByRole(`button`, {
                name: `Values ​`,
                hidden: true,
            }));

            userEvent.click(await screen.findByRole(`option`, {
                name: `Test Organization Admin`,
                hidden: true,
            }));

            userEvent.click(screen.getAllByText(`Add Filter`)[1]);

            expect(screen.getByRole(`button`, {
                name: `Organization Roles equals Test Organization Admin`,
                hidden: true,
            }))
                .toBeInTheDocument();
        });

        test(`edit filter`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component, {
                mockedResponses: mocks,
            });

            userEvent.click(screen.getByRole(`button`, {
                name: `Add Filter`,
            }));

            userEvent.click(screen.getByRole(`button`, {
                name: `Values ​`,
                hidden: true,
            }));

            userEvent.click(await screen.findByRole(`option`, {
                name: `Test Organization Admin`,
                hidden: true,
            }));

            userEvent.click(screen.getAllByText(`Add Filter`)[1]);

            userEvent.click(screen.getByRole(`button`, {
                name: `Organization Roles equals Test Organization Admin`,
            }));

            await screen.findByRole(`button`, {
                name: `Test Organization Admin`,
                hidden: true,
            });

            userEvent.click(screen.getByRole(`button`, {
                name: `Values Test Organization Admin`,
                hidden: true,
            }));

            userEvent.click(await screen.findByRole(`option`, {
                name: `Test Organization Admin`,
                hidden: true,
            }));

            userEvent.click(await screen.findByRole(`option`, {
                name: `Test School Admin`,
                hidden: true,
            }));

            userEvent.click(screen.getByRole(`button`, {
                name: `Save Filter`,
                hidden: true,
            }));

            expect(screen.getByRole(`button`, {
                name: `Organization Roles equals Test School Admin`,
                hidden: true,
            }))
                .toBeInTheDocument();

        });

        test(`remove filter`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component, {
                mockedResponses: mocks,
            });

            userEvent.click(screen.getByRole(`button`, {
                name: `Add Filter`,
            }));

            userEvent.click(screen.getByRole(`button`, {
                name: `Values ​`,
                hidden: true,
            }));

            userEvent.click(await screen.findByRole(`option`, {
                name: `Test Organization Admin`,
                hidden: true,
            }));

            userEvent.click(screen.getAllByText(`Add Filter`)[1]);

            expect(screen.getByRole(`button`, {
                name: `Organization Roles equals Test Organization Admin`,
            }))
                .toBeInTheDocument();

            userEvent.click(screen.getByTestId(`CancelIcon`));

            expect(screen.queryByRole(`button`, {
                name: `Organization Roles equals Organization Admin`,
            })).not.toBeInTheDocument();
        });

        test(`clear all filters`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component, {
                mockedResponses: mocks,
            });

            userEvent.click(screen.getByRole(`button`, {
                name: `Add Filter`,
            }));

            userEvent.click(screen.getByRole(`button`, {
                name: `Values ​`,
                hidden: true,
            }));

            userEvent.click(await screen.findByRole(`option`, {
                name: `Test Organization Admin`,
                hidden: true,
            }));

            userEvent.click(screen.getAllByText(`Add Filter`)[1]);

            expect(screen.getByRole(`button`, {
                name: `Organization Roles equals Test Organization Admin`,
            }))
                .toBeInTheDocument();

            userEvent.click(screen.getByRole(`button`, {
                name: `Clear filters`,
            }));

            expect(screen.queryByRole(`button`, {
                name: `Organization Roles equals Test Organization Admin`,
                hidden: true,
            })).not.toBeInTheDocument();
        });

        test(`input search text`, () => {
            const component = <UsersTable {...defaultProps} />;

            render(component);

            const searchInput = screen.getByPlaceholderText(`Search`);

            userEvent.type(searchInput, `Mike Portnoy`);

            expect(searchInput)
                .toHaveValue(`Mike Portnoy`);
        });

        test(`clear search text`, () => {
            const component = <UsersTable {...defaultProps} />;

            render(component);

            const searchInput = screen.getByPlaceholderText(`Search`);

            userEvent.type(searchInput, `Mike Portnoy`);

            expect(searchInput)
                .toHaveValue(`Mike Portnoy`);

            userEvent.click(screen.getAllByTestId(`CloseIcon`)[0]);

            expect(searchInput)
                .toHaveValue(``);
        });

        test(`sort givenName asc to desc`, async () => {
            const component = <UsersTable {...defaultProps} />;

            render(component);

            let userRows = screen.getAllByTestId(`tableRow`, {
                exact: false,
            });

            expect(userRows)
                .toHaveLength(2);
            expect(userRows[0])
                .toHaveTextContent(`Andrew`);
            expect(userRows[1])
                .toHaveTextContent(`John`);

            userEvent.click(screen.getByTestId(`givenNameSortHandler`));

            await waitFor(() => {
                userRows = screen.getAllByTestId(`tableRow`, {
                    exact: false,
                });
                expect(userRows)
                    .toHaveLength(2);
                expect(userRows[0])
                    .toHaveTextContent(`John`);
                expect(userRows[1])
                    .toHaveTextContent(`Andrew`);
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

            expect(userRows)
                .toHaveLength(2);
            expect(userRows[0])
                .toHaveTextContent(`John`);
            expect(userRows[1])
                .toHaveTextContent(`Andrew`);

            userEvent.click(screen.getByTestId(`givenNameSortHandler`));

            await waitFor(() => {
                userRows = screen.getAllByTestId(`tableRow`, {
                    exact: false,
                });
                expect(userRows)
                    .toHaveLength(2);
                expect(userRows[0])
                    .toHaveTextContent(`Andrew`);
                expect(userRows[1])
                    .toHaveTextContent(`John`);
            });
        });
    });
});
