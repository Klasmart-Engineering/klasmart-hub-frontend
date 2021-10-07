import AgeRangeForm from './Form';
import { buildEmptyAgeRange } from '@/utils/ageRanges';
import {
    fireEvent,
    screen,
    waitFor,
} from '@testing-library/react';
import { render } from "@tests/utils/render";
import React from 'react';

test(`Age range form renders correctly`, async () => {
    render(<AgeRangeForm
        value={buildEmptyAgeRange()}
        onChange={jest.fn()}
        onValidation={jest.fn()}/>);

    expect(screen.queryByText(`Age Range`)).toBeInTheDocument();
    expect(screen.getByLabelText(`From`)).toBeTruthy();
    expect(screen.queryAllByText(`From Unit`).length).toBeTruthy();
    expect(screen.queryAllByText(`To`).length).toBeTruthy();
    expect(screen.queryAllByText(`To Unit`).length).toBeTruthy();
    expect(screen.queryAllByText(`Year(s)`).length).toBeTruthy();

    fireEvent.change(screen.getByLabelText(`From`), {
        target: {
            value: `10`,
        },
    });

    fireEvent.change(screen.getByLabelText(`To`), {
        target: {
            value: `12`,
        },
    });

    await waitFor(() => {
        expect((screen.getByLabelText(`From`) as HTMLInputElement)?.value).toBe(`10`);
        expect((screen.getByLabelText(`To`) as HTMLInputElement)?.value).toBe(`12`);
    });
});
