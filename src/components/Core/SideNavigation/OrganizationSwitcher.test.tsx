import OrganizationSwitcher from "./OrganizationSwitcher";
import { fallbackLocale } from "@/locale/locale";
import {
    fireEvent,
    screen,
} from "@testing-library/react";
import { render } from "@tests/utils/render";
import each from "jest-each";
import React from "react";

describe(`OrganizationSwitcher`, () => {
    const defaultMockShowOrganizations = false;
    const defaultMockOnShowOrganizationsChange = jest.fn();

    describe(`Render`, () => {
        test(`Default props`, () => {
            const { container } = render(<OrganizationSwitcher
                showOrganizations={defaultMockShowOrganizations}
                onShowOrganizationsChange={defaultMockOnShowOrganizationsChange}
            />);
            expect(container.getElementsByClassName(`MuiAvatar-root`).length).toEqual(1);
            expect(screen.getByText(fallbackLocale.formatMessage({
                id: `organization.unknown`,
            }))).toBeInTheDocument();
            expect(screen.getByText(fallbackLocale.formatMessage({
                id: `role.unknown`,
            }))).toBeInTheDocument();
        });

        test(`showOrganizations prop = true`, () => {
            const mockShowOrganizations = true;
            const { container } = render(<OrganizationSwitcher
                showOrganizations={mockShowOrganizations}
                onShowOrganizationsChange={defaultMockOnShowOrganizationsChange}
            />);
            expect(container.querySelector(`*[class*="showOrganizationsMenuButtonOpen"]`)).toBeInTheDocument();
        });

        each([
            0,
            1,
            2,
            3,
            5,
        ]).test.skip(`with organizationMembershipStack of length = %s`, () => undefined);

        test.todo(`with previewOrganizationColor`);
    });
    describe(`Interact`, () => {
        test(`onClick recent organization`, () => {
            render(<OrganizationSwitcher
                showOrganizations={defaultMockShowOrganizations}
                onShowOrganizationsChange={defaultMockOnShowOrganizationsChange}
            />);
        });

        test(`onClick toggle organization list visibility`, () => {
            render(<OrganizationSwitcher
                showOrganizations={defaultMockShowOrganizations}
                onShowOrganizationsChange={defaultMockOnShowOrganizationsChange}
            />);
            fireEvent.click(screen.getByRole(`button`));
            expect(defaultMockOnShowOrganizationsChange).toHaveBeenCalledTimes(1);
        });
    });
});
