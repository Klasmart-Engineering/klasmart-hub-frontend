import AgeRangeForm from './Form';
import { buildEmptyAgeRange } from '@/utils/ageRanges';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from "@tests/utils/render";
import React from 'react';

test(`Age range form renders correctly`, () => {
    render((
        <AgeRangeForm
            value={buildEmptyAgeRange()}
            onChange={jest.fn()}
            onValidation={jest.fn()}
        />
    ));

    expect(screen.getByText(`Age Range`)).toBeInTheDocument();
    expect(screen.getByLabelText(`From`)).toBeInTheDocument();
    expect(screen.getByLabelText(`From`)).toHaveValue(0);
    expect(screen.getByLabelText(`From Unit`)).toBeInTheDocument();
    expect(screen.getByLabelText(`To`)).toBeInTheDocument();
    expect(screen.getByLabelText(`To`)).toHaveValue(1);
    expect(screen.getByLabelText(`To Unit`)).toBeInTheDocument();
});

test(`Age range form change values`, () => {
    render((
        <AgeRangeForm
            value={buildEmptyAgeRange()}
            onChange={jest.fn()}
            onValidation={jest.fn()}
        />
    ));

    userEvent.type(screen.getByLabelText(`From`), `{selectall}`);
    userEvent.type(screen.getByLabelText(`From`), `10`);
    userEvent.type(screen.getByLabelText(`To`), `{selectall}`);
    userEvent.type(screen.getByLabelText(`To`), `12`);

    expect(screen.getByLabelText(`From`)).toHaveValue(10);
    expect(screen.getByLabelText(`To`)).toHaveValue(12);
});
