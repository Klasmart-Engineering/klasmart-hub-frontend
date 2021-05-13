import { getLanguage } from "../../../utils/locale";
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

const formValue = {
    id: ``,
    name: ``,
    categories: mockCategories,
    status: Status.ACTIVE,
    system: false,
};

test(`Subject form renders correctly`, async () => {
    const locale = getLanguage(`en`);
    const { getByLabelText } = qlRender([], locale, <SubjectsForm
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
    const locale = getLanguage(`en`);
    const {
        getByLabelText,
        findByText,
        queryAllByText,
    } = qlRender([], locale, <SubjectsForm
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

        await utils.sleep(200);
        const cancelButtonNone = await queryAllByText(/Cancel/gi);

        await waitFor(() => {
            expect(cancelButtonNone.length).toBeFalsy();
        });
    });
});
