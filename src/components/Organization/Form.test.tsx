import Form from './Form';
import { PRIMARY_THEME_COLOR } from '@/themeProvider';
import { getLanguage } from "@/utils/locale";
import {
    act,
    fireEvent,
    waitFor,
} from '@testing-library/react';
import {
    mockOrg,
    mockOrgId,
} from '@tests/mockOrganizationData';
import qlRender from '@tests/utils';
import { utils } from 'kidsloop-px';
import React from 'react';

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            organization_id: mockOrgId,
        }),
        useCurrentOrganizationMembership: () => ({
            organization_id: mockOrgId,
        }),
    };
});

jest.mock(`@/utils/checkAllowed`, () => {
    return {
        ...jest.requireActual(`@/utils/checkAllowed`),
        usePermission: () => true,
    };
});

test(`OrganizationForm renders correctly`, async () => {
    const locale = getLanguage(`en`);
    const {
        queryByText,
        queryAllByText,
    } = qlRender([], locale, <Form
        currentTab="organizationInfo"
        value={mockOrg}
        onValidation={jest.fn()}
        onChange={jest.fn()}/>);

    await act(async () => {
        const shortCodeLabel = queryAllByText(`Shortcode`, {
            exact: true,
        });

        const orgName = queryAllByText(`Organization Name`);
        const contactInfo = queryByText(`Contact Info`);
        const phoneNum = queryByText(`Phone Number`);
        const address1 = queryByText(`Address Line 1`);
        const address2 = queryByText(`Address Line 2`);
        await waitFor(async () => {
            expect(shortCodeLabel.length).toBeTruthy();
            expect(orgName.length).toBeTruthy();
            expect(contactInfo).toBeTruthy();
            expect(phoneNum).toBeTruthy();
            expect(address1).toBeTruthy();
            expect(address2).toBeTruthy();
        });
    });
});

test(`OrganizationForm renders correctly`, async () => {
    const locale = getLanguage(`en`);
    const {
        queryByText,
        queryAllByText,
    } = qlRender([], locale, <Form
        currentTab="organizationInfo"
        value={mockOrg}
        onValidation={jest.fn()}
        onChange={jest.fn()}/>);

    await act(async () => {
        const shortCodeLabel = queryAllByText(`Shortcode`, {
            exact: true,
        });

        const orgName = queryAllByText(`Organization Name`);
        const contactInfo = queryByText(`Contact Info`);
        const phoneNum = queryByText(`Phone Number`);
        const address1 = queryByText(`Address Line 1`);
        const address2 = queryByText(`Address Line 2`);
        await waitFor(async () => {
            expect(shortCodeLabel.length).toBeTruthy();
            expect(orgName.length).toBeTruthy();
            expect(contactInfo).toBeTruthy();
            expect(phoneNum).toBeTruthy();
            expect(address1).toBeTruthy();
            expect(address2).toBeTruthy();
        });
    });
});

test(`OrganizationForm updates correctly`, async () => {
    const locale = getLanguage(`en`);
    const { getByLabelText } = qlRender([], locale, <Form
        currentTab="organizationInfo"
        value={mockOrg}
        onValidation={jest.fn()}
        onChange={jest.fn()}/>);

    await act(async () => {
        const shortCode = await getByLabelText(`Shortcode`, {
            selector: `input`,
        });

        const orgName = await getByLabelText(`Organization Name`, {
            selector: `input`,
        });

        const phoneNum = await getByLabelText(`Phone Number`, {
            selector: `input`,
        });
        const address1 = await getByLabelText(`Address Line 1`, {
            selector: `input`,
        });
        const address2 = await getByLabelText(`Address Line 2`, {
            selector: `input`,
        });

        await waitFor(async () => {
            expect(shortCode).toBeTruthy();
        });

        fireEvent.change(shortCode, {
            target: {
                value: `Test Code`,
            },
        });

        await utils.sleep(0);

        await waitFor(() => {
            expect(shortCode.value).toBe(`Test Code`);
        });

        fireEvent.change(orgName, {
            target: {
                value: `Test Org`,
            },
        });

        await utils.sleep(0);

        await waitFor(() => {
            expect(orgName.value).toBe(`Test Org`);
        });

        fireEvent.change(phoneNum, {
            target: {
                value: `1112223344`,
            },
        });

        await utils.sleep(0);

        await waitFor(() => {
            expect(phoneNum.value).toBe(`1112223344`);
        });

        fireEvent.change(address1, {
            target: {
                value: `111 Test Ave`,
            },
        });

        await utils.sleep(0);

        await waitFor(() => {
            expect(address1.value).toBe(`111 Test Ave`);
        });

        fireEvent.change(address2, {
            target: {
                value: `222 Test Ave`,
            },
        });

        await utils.sleep(0);

        await waitFor(() => {
            expect(address2.value).toBe(`222 Test Ave`);
        });

    });
});

test(`OrganizationForm shows correct error labels.`, async () => {
    const locale = getLanguage(`en`);
    const {
        getByLabelText,
        queryByText,
        queryAllByText,
    } = qlRender([], locale, <Form
        currentTab="organizationInfo"
        value={mockOrg}
        onValidation={jest.fn()}
        onChange={jest.fn()}
    />);

    await act(async () => {
        const shortCode = await getByLabelText(`Shortcode`, {
            selector: `input`,
        });

        const orgName = await getByLabelText(`Organization Name`, {
            selector: `input`,
        });

        const phoneNum = await getByLabelText(`Phone Number`, {
            selector: `input`,
        });
        const address1 = await getByLabelText(`Address Line 1`, {
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

        utils.sleep(0);

        await waitFor(() => {
            expect(queryByText(`Shortcode must have a minimum of 3 characters`)).toBeTruthy();
            expect(queryByText(`The Organization Name must have a minimum of 3 characters`)).toBeTruthy();
            expect(queryByText(`Invalid phone number`)).toBeTruthy();
            expect(queryByText(`The first address must have a minimum of 3 characters`)).toBeTruthy();
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
            expect(queryAllByText(`Required`).length).toEqual(4);
        });
    });
});

test(`PersonalizationForm renders correctly`, async () => {
    const locale = getLanguage(`en`);
    const { queryByText } = qlRender([], locale, <Form
        currentTab="personalization"
        value={mockOrg}
        onValidation={jest.fn()}
        onChange={jest.fn()}/>);

    await act(async () => {
        const orgLogoLabel = queryByText(`Organization Logo`);
        const selectImageButton = queryByText(`Select Image`);
        const orgColorLabel = queryByText(`Organization Color`);
        const colorInputLabel = queryByText(`Color`);

        await waitFor(async () => {
            expect(orgLogoLabel).toBeTruthy();
            expect(selectImageButton).toBeTruthy();
            expect(orgColorLabel).toBeTruthy();
            expect(colorInputLabel).toBeTruthy();
        });
    });
});
