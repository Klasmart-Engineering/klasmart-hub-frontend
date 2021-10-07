import ProgramInfoStep from "./ProgramInfo";
import { buildEmptyProgram } from "@/utils/programs";
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/render";
import React from 'react';

test(`ProgramInfo loads correctly`, () => {
    render(<ProgramInfoStep value={buildEmptyProgram()}/>);

    expect(screen.queryAllByText(`Program Name`).length).toBeTruthy();
    expect(screen.queryAllByText(`Grades`).length).toBeTruthy();
    expect(screen.queryAllByText(`Age Ranges`).length).toBeTruthy();
});
