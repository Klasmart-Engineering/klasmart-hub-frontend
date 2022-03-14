import Form from './Form';
import {
    fireEvent,
    screen,
    waitFor,
} from '@testing-library/react';
import {
    mockOrg,
    mockOrgId,
} from '@tests/mockOrganizationData';
import { render } from "@tests/utils/render";
import React from 'react';

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

test(`OrganizationForm renders correctly`, () => {
    render(<Form
        currentTab="organizationInfo"
        value={mockOrg}
        onValidation={jest.fn()}
        onChange={jest.fn()}/>);

    expect(screen.queryAllByText(`Shortcode`, {
        exact: true,
    }).length).toBeTruthy();
    expect(screen.queryAllByText(`Organization Name`).length).toBeTruthy();
    expect(screen.queryByText(`Contact Info`)).toBeInTheDocument();
    expect(screen.queryByText(`Phone Number`)).toBeInTheDocument();
    expect(screen.queryByText(`Address Line 1`)).toBeInTheDocument();
    expect(screen.queryByText(`Address Line 2`)).toBeInTheDocument();
});

test(`OrganizationForm updates correctly`, async () => {
    render(<Form
        currentTab="organizationInfo"
        value={mockOrg}
        onValidation={jest.fn()}
        onChange={jest.fn()}/>);

    const shortCode = screen.getByLabelText(`Shortcode`, {
        selector: `input`,
    });

    const orgName = screen.getByLabelText(`Organization Name`, {
        selector: `input`,
    });

    const phoneNum = screen.getByLabelText(`Phone Number`, {
        selector: `input`,
    });
    const address1 = screen.getByLabelText(`Address Line 1`, {
        selector: `input`,
    });
    const address2 = screen.getByLabelText(`Address Line 2`, {
        selector: `input`,
    });

    await waitFor(() => {
        expect(shortCode).toBeTruthy();
    });

    fireEvent.change(shortCode, {
        target: {
            value: `Test Code`,
        },
    });

    await waitFor(() => {
        expect((shortCode as HTMLInputElement).value).toBe(`Test Code`);
    });

    fireEvent.change(orgName, {
        target: {
            value: `Test Org`,
        },
    });

    await waitFor(() => {
        expect((orgName as HTMLInputElement).value).toBe(`Test Org`);
    });

    fireEvent.change(phoneNum, {
        target: {
            value: `1112223344`,
        },
    });

    await waitFor(() => {
        expect((phoneNum as HTMLInputElement).value).toBe(`1112223344`);
    });

    fireEvent.change(address1, {
        target: {
            value: `111 Test Ave`,
        },
    });

    await waitFor(() => {
        expect((address1 as HTMLInputElement).value).toBe(`111 Test Ave`);
    });

    fireEvent.change(address2, {
        target: {
            value: `222 Test Ave`,
        },
    });

    await waitFor(() => {
        expect((address2 as HTMLInputElement).value).toBe(`222 Test Ave`);
    });

});

test(`OrganizationForm shows correct error labels.`, async () => {
    render(<Form
        currentTab="organizationInfo"
        value={mockOrg}
        onValidation={jest.fn()}
        onChange={jest.fn()}
    />);

    const shortCode = screen.getByLabelText(`Shortcode`, {
        selector: `input`,
    });

    const orgName = screen.getByLabelText(`Organization Name`, {
        selector: `input`,
    });

    const phoneNum = screen.getByLabelText(`Phone Number`, {
        selector: `input`,
    });
    const address1 = screen.getByLabelText(`Address Line 1`, {
        selector: `input`,
    });

    fireEvent.change(shortCode, {
        target: {
            value: `a`,
        },
    });

    fireEvent.change(orgName, {
        target: {
            value: `a`,
        },
    });

    fireEvent.change(phoneNum, {
        target: {
            value: `1acdi34455`,
        },
    });

    fireEvent.change(address1, {
        target: {
            value: `a`,
        },
    });

    await waitFor(() => {
        expect(screen.queryByText(`Shortcode must have a minimum of 3 characters`)).toBeInTheDocument();
        expect(screen.queryByText(`The Organization Name must have a minimum of 3 characters`)).toBeInTheDocument();
        expect(screen.queryByText(`Invalid phone number`)).toBeInTheDocument();
        expect(screen.queryByText(`The first address must have a minimum of 3 characters`)).toBeInTheDocument();
    });

    fireEvent.change(shortCode, {
        target: {
            value: ``,
        },
    });

    fireEvent.change(orgName, {
        target: {
            value: ``,
        },
    });

    fireEvent.change(phoneNum, {
        target: {
            value: ``,
        },
    });

    fireEvent.change(address1, {
        target: {
            value: ``,
        },
    });

    await waitFor(() => {
        expect(screen.queryAllByText(`Required`)).toHaveLength(4);
    });
});

test(`PersonalizationForm renders correctly`, () => {
    render(<Form
        currentTab="personalization"
        value={mockOrg}
        onValidation={jest.fn()}
        onChange={jest.fn()}/>);

    expect(screen.queryByText(`Organization Logo`)).toBeInTheDocument();
    expect(screen.queryByText(`Select Image`)).toBeInTheDocument();
    expect(screen.queryByText(`Organization Color`)).toBeInTheDocument();
    expect(screen.queryByText(`Color`)).toBeInTheDocument();
});
