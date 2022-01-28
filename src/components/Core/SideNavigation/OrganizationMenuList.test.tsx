import OrganizationMenuList from "./OrganizationMenuList";
import { fallbackLocale } from "@/locale/locale";
import { Status } from "@/types/graphQL";
import {
    fireEvent,
    screen,
} from "@testing-library/react";
import {
    mockOrgId,
    mockUserId,
} from "@tests/mockOrganizationData";
import { render } from "@tests/utils/render";
import React from "react";

const roles = [
    {
        role_id: `23d899cd-862e-4bb6-8e57-761d701bc9fc`,
        role_name: fallbackLocale.formatMessage({
            id: `roles_typeOrganizationAdmin`,
        }),
        status: Status.ACTIVE,
    },
];
const mockOrgStack = [
    {
        organization: {
            organization_id: `23d899cd-862e-4bb6-8e57-761d701bc9fa`,
            organization_name: `Test Organization 1`,
            phone: `+1111111111`,
            status: Status.ACTIVE,
            roles,
            primary_contact: {
                email: `test@organization1.com`,
            },
        },
        organization_id: `23d899cd-862e-4bb6-8e57-761d701bc9fa`,
        status: Status.ACTIVE,
        user_id: mockUserId,
        roles,
    },
    {
        organization: {
            organization_id: `23d899cd-862e-4bb6-8e57-761d701bc9fb`,
            organization_name: `Test Organization 2`,
            phone: `+2222222222`,
            status: Status.ACTIVE,
            roles,
            primary_contact: {
                email: `test@organization2.com`,
            },
        },
        organization_id: `23d899cd-862e-4bb6-8e57-761d701bc9fb`,
        status: Status.ACTIVE,
        user_id: mockUserId,
        roles,
    },
];

jest.mock(`@/store/organizationMemberships`, () => ({
    useCurrentOrganization: () => ({
        organization_id: mockOrgId,
    }),
    useCurrentOrganizationMembership: () => ({
        organization_id: mockOrgId,
    }),
    useOrganizationStack: () => ([ mockOrgStack, jest.fn() ]),
}));

describe(`OrganizationMenuList`, () => {
    const defaultMockOnOrganizationsChange = jest.fn();

    describe(`Render`, () => {
        test(`Default props`, () => {
            const { container } = render(<OrganizationMenuList
                onOrganizationChange={defaultMockOnOrganizationsChange}
            />);
            expect(container.querySelectorAll(`*[class*="selectedOrganization"]`)).toHaveLength(1);
            expect(screen.getByText(mockOrgStack[0].organization.organization_name)).toBeInTheDocument();
            expect(screen.getByText(mockOrgStack[1].organization.organization_name)).toBeInTheDocument();
            expect(screen.getAllByText(fallbackLocale.formatMessage({
                id: `roles_typeOrganizationAdmin`,
            }))).toHaveLength(2);
        });
    });

    describe(`Interact`, () => {
        test(`onClick same active list item`, () => {
            const mockOnOrganizationsChange = jest.fn();
            const { container } = render(<OrganizationMenuList onOrganizationChange={mockOnOrganizationsChange} />);
            const selectedListItem = container.querySelector(`*[class*="selectedOrganization"]`);
            expect(selectedListItem).toBeInTheDocument();
            if (!selectedListItem) throw Error(`selectedListItem is in the document, but is null`);
            fireEvent.click(selectedListItem);
            expect(mockOnOrganizationsChange).toHaveBeenCalledTimes(0);
        });

        test(`onClick non-active list item`, () => {
            const mockOnOrganizationsChange = jest.fn();
            const { container } = render(<OrganizationMenuList onOrganizationChange={mockOnOrganizationsChange} />);
            const listItems = container.querySelectorAll(`.MuiListItem-root`);
            const selectedListItem = [ ...listItems.values() ].find((element) => !element.className.includes(`selectedOrganization`));
            expect(selectedListItem).toBeInTheDocument();
            if (!selectedListItem) throw Error(`selectedListItem is in the document, but is null`);
            fireEvent.click(selectedListItem);
            expect(mockOnOrganizationsChange).toHaveBeenCalledTimes(1);
        });
    });
});
