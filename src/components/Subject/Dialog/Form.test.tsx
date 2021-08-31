import SubjectsForm from './Form';
import { Status } from "@/types/graphQL";
import {
    act,
    fireEvent,
    screen,
    waitFor,
} from '@testing-library/react';
import {
    mockCategories,
    mockOrgId,
} from '@tests/mockDataSubjects';
import { render } from "@tests/utils/render";
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

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

const formValue = {
    id: ``,
    name: ``,
    categories: mockCategories,
    status: Status.ACTIVE,
    system: false,
};

test(`Subject form renders correctly`, async () => {
    const { getByLabelText } = render(<SubjectsForm
        value={formValue}
        onChange={jest.fn()}
        onValidation={jest.fn()}/>);

    await act(async () => {
        const name = await getByLabelText(`Subject Name`);
        const categoryLabels = await screen.findAllByText(/category/gi);
        const subcategoryLabels = await screen.findAllByText(/subcategories/gi);
        const nonSpecified = await screen.findAllByText(/specified/gi);

        await waitFor(() => {
            expect(name).toBeTruthy();
            expect(categoryLabels.length).toBeTruthy();
            expect(subcategoryLabels.length).toBeTruthy();
            expect(name.value).toBe(``);
            expect(nonSpecified.length).toEqual(2);
        });
    });
});

test(`Subjects form updates correct and opens categories selector`, async () => {
    const {
        getByLabelText,
        findByText,
        queryAllByText,
    } = render(<SubjectsForm
        value={formValue}
        onChange={jest.fn()}
        onValidation={jest.fn()}/>);

    await act(async () => {
        const name = await getByLabelText(`Subject Name`, {
            selector: `input`,
        });

        const nonSpec = await screen.getAllByText(/None Specified/gi, {
            selector: `span`,
        });
        fireEvent.change(name, {
            target: {
                value: `Test Subject`,
            },
        });

        const notFoundInit = await queryAllByText(/Select Category/gi);

        await utils.sleep(0);

        // Grade name
        await waitFor(() => {
            expect(name.value).toBe(`Test Subject`);
            expect(notFoundInit.length).toBeFalsy();
        });

        fireEvent.click(nonSpec[0]);
        await utils.sleep(0);

        const selectTitle = await findByText(`Select Category`);
        const subTitle = await findByText(`Categories`);
        const fineMotor = await findByText(/Fine Motor Skills/gi);
        const createCategoryButton = await screen.findByText(/Programs using/gi, {
            selector: `div`,
        });

        const selectButton = await findByText(`Select`);
        const cancelButton = await findByText(`Cancel`);

        await waitFor(() => {
            expect(selectTitle).toBeTruthy();
            expect(subTitle).toBeTruthy();
            expect(fineMotor).toBeTruthy();
            expect(createCategoryButton).toBeTruthy();
            expect(selectButton).toBeTruthy();
            expect(cancelButton).toBeTruthy();
        });

        fireEvent(cancelButton, new MouseEvent(`click`, {
            bubbles: true,
            cancelable: true,
        }));

        await waitFor(() => {
            expect(queryAllByText(/Cancel/gi).length).toBeFalsy();
        });
    });
});
