import OrganizationMenuList from "./OrganizationMenuList";
import { fallbackLocale } from "@/locale/locale";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@tests/utils/render";
import React from "react";

const roleEdges = [
    {
        node: {
            id: `23d899cd-862e-4bb6-8e57-761d701bc9fc`,
            name: fallbackLocale.formatMessage({
                id: `roles_typeOrganizationAdmin`,
            }),
        },
    },
];
const mockOrgStack = [
    {
        organization: {
            id: `23d899cd-862e-4bb6-8e57-761d701bc9fa`,
            name: `Test Organization 1`,
            owners: [
                {
                    email: `test@organization1.com`,
                },
            ],
            branding: {
                iconImageURL: `https://kidsloop-alpha-account-asset-objects.s3.ap-northeast-2.amazonaws.com/organizations/49fbe89a-87bc-4159-8a8d-48bf151ba062/2022-02-07/icon/croppedImage`,
                primaryColor: `#7e5d19`,
            },
        },
        rolesConnection: {
            edges: roleEdges,
        },
    },
    {
        organization: {
            id: `23d899cd-862e-4bb6-8e57-761d701bc9fb`,
            name: `Test Organization 2`,
            owners: [
                {
                    email: `test@organization2.com`,
                },
            ],
            branding: {
                iconImageURL: `https://kidsloop-alpha-account-asset-objects.s3.ap-northeast-2.amazonaws.com/organizations/49fbe89a-87bc-4159-8a8d-48bf151ba062/2022-02-07/icon/croppedImage`,
                primaryColor: `#7e5d19`,
            },
        },
        rolesConnection: {
            edges: roleEdges,
        },
    },
];

jest.mock(`@/store/organizationMemberships`, () => ({
    useOrganizationStack: () => ([ mockOrgStack, jest.fn() ]),
}));

describe(`OrganizationMenuList`, () => {
    describe(`Render`, () => {
        test(`Default props`, () => {
            render(<OrganizationMenuList />);

            expect(screen.getAllByRole(`option`)).toHaveLength(mockOrgStack.length);
            expect(screen.getAllByRole(`option`, {
                selected: true,
            })).toHaveLength(1);
        });
    });

    describe(`Interact`, () => {
        test(`onClick same active list item`, () => {
            const mockOnOrganizationsChange = jest.fn();
            render(<OrganizationMenuList onOrganizationChange={mockOnOrganizationsChange} />);

            userEvent.click(screen.getByRole(`option`, {
                selected: true,
            }));

            expect(mockOnOrganizationsChange).toHaveBeenCalledTimes(0);
        });

        test(`onClick non-active list item`, () => {
            const mockOnOrganizationsChange = jest.fn();
            render(<OrganizationMenuList onOrganizationChange={mockOnOrganizationsChange} />);

            userEvent.click(screen.getByRole(`option`, {
                selected: false,
            }));

            expect(mockOnOrganizationsChange).toHaveBeenCalledTimes(1);
        });
    });
});
