import SubjectsForm from './Form';
import { Status } from "@/types/graphQL";
import {
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
    render(<SubjectsForm
        value={formValue}
        onChange={jest.fn()}
        onValidation={jest.fn()}/>);

    await waitFor(() => {
        expect(screen.getByLabelText(`Subject Name`)).toBeInTheDocument();
        expect(screen.getAllByText(/category/gi).length).toBeTruthy();
        expect(screen.getAllByText(/subcategories/gi).length).toBeTruthy();
        expect(screen.getByLabelText(`Subject Name`).value).toBe(``);
    });
});

test(`Subjects form updates correct and opens categories selector`, async () => {
    render(<SubjectsForm
        value={formValue}
        onChange={jest.fn()}
        onValidation={jest.fn()}/>);

    const name = screen.getByLabelText(`Subject Name`, {
        selector: `input`,
    });

    const nonSpec = screen.getAllByText(/None Specified/gi, {
        selector: `p`,
    });
    fireEvent.change(name, {
        target: {
            value: `Test Subject`,
        },
    });

    const notFoundInit = screen.queryAllByText(/Select Category/gi);

    await utils.sleep(0);

    // Grade name
    await waitFor(() => {
        expect(name.value).toBe(`Test Subject`);
        expect(notFoundInit.length).toBeFalsy();
    });

    fireEvent.click(nonSpec[0]);
    await utils.sleep(0);

    await waitFor(() => {
        expect(screen.getByText(`Select Category`)).toBeInTheDocument();
        expect(screen.getByText(`Categories`)).toBeInTheDocument();
        expect(screen.getByText(/Fine Motor Skills/gi)).toBeInTheDocument();
        expect(screen.getByText(/Programs using/gi, {
            selector: `div`,
        })).toBeInTheDocument();
        expect(screen.getByText(`Select`)).toBeInTheDocument();
        expect(screen.getByText(`Cancel`)).toBeInTheDocument();
    });

    fireEvent(screen.getByText(`Cancel`), new MouseEvent(`click`, {
        bubbles: true,
        cancelable: true,
    }));

    await waitFor(() => {
        expect(screen.queryAllByText(/Cancel/gi).length).toBeFalsy();
    });
});
