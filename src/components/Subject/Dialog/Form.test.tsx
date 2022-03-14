import SubjectsForm from './Form';
import { Status } from "@/types/graphQL";
import {
    fireEvent,
    screen,
    waitFor,
    waitForElementToBeRemoved,
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

const formValue = {
    id: ``,
    name: ``,
    categories: mockCategories,
    status: Status.ACTIVE,
    system: false,
};

test(`Subject form renders correctly`, () => {
    render((
        <SubjectsForm
            value={formValue}
            onChange={jest.fn()}
            onValidation={jest.fn()}
        />
    ));

    expect(screen.getByLabelText(`Subject Name`)).toBeInTheDocument();
    expect(screen.getAllByText(`Category`)).toHaveLength(3);
    expect(screen.getAllByText(`Subcategories`)).toHaveLength(3);
    expect(screen.getByLabelText(`Subject Name`)).toHaveValue(``);
});

test(`Subjects form updates correct and opens categories selector`, async () => {
    render((
        <SubjectsForm
            value={formValue}
            onChange={jest.fn()}
            onValidation={jest.fn()}
        />
    ));

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
