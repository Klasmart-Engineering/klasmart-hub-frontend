import ProgramInfoStep from "./ProgramInfo";
import { ProgramNode } from "@/api/programs";
import {
    buildEmptyProgram,
    mapProgramNodeToProgramForm,
} from "@/utils/programs";
import { screen } from "@testing-library/react";
import { mockProgramInfoData } from "@tests/mockDataPrograms";
import { render } from "@tests/utils/render";
import React from 'react';

jest.mock(`@/utils/programFormDropdownValues`, () => {
    return {
        useGetProgramFormDropdowns: () => ({
            ageRangesLoading: false,
            gradesLoading: false,
            customAgeRanges: [ {} ],
            systemAgeRanges: [
                {
                    value:`fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
                    label: `5 - 6 Year(s)`,
                },
            ],
            nonSpecifiedAgeRange: [ {} ],
            customGrades: [],
            systemGrades: [
                {
                    value: `100f774a-3d7e-4be5-9c2c-ae70f40f0b50`,
                    label: `Grade 1`,
                },
            ],
            nonSpecifiedGrade: {},
        }),
    };
});

test(`ProgramInfo component loads correctly`, () => {
    render(<ProgramInfoStep value={buildEmptyProgram()}/>);

    expect(screen.queryAllByText(`Program Name`).length).toBeTruthy();
    expect(screen.queryAllByText(`Grades`).length).toBeTruthy();
    expect(screen.queryAllByText(`Age Ranges`).length).toBeTruthy();
});

test(`ProgramInfo component loads data correctly`, () => {
    render(<ProgramInfoStep value={mapProgramNodeToProgramForm(mockProgramInfoData.programNode as ProgramNode)}/>);

    expect(screen.queryAllByText(`5 - 6 Year(s)`).length).toBeTruthy();
    expect(screen.queryAllByText(`Grade 1`).length).toBeTruthy();
});
