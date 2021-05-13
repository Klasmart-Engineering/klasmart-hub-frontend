import 'regenerator-runtime/runtime';
import Grades from './Table';
import { DELETE_GRADE } from '@/operations/mutations/deleteGrade';
import { GET_GRADES  } from '@/operations/queries/getGrades';
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    screen,
    waitFor,
} from '@testing-library/react';
import {
    grade1,
    grades,
    mockOrgId,
} from '@tests/mockDataGrades';
import qlRender from '@tests/utils';
import { utils } from 'kidsloop-px';
import React from 'react';

let deleteCalled = false;

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_GRADES,
            variables: {
                organization_id: mockOrgId,
            },
        },
        result: {
            data: {
                organization: {
                    grades,
                },
            },
        },
        newData: () => {
            if (!deleteCalled) {
                return {
                    data: {
                        organization: {
                            grades,
                        },
                    },
                };
            } else  {
                return {
                    data: {
                        organization: {
                            grades: grades.filter((grade) => grade.id !== grade1),
                        },
                    },
                };
            }
        },
    },
    {
        request: {
            query: DELETE_GRADE,
            variables: {
                id: grade1,
            },
        },
        result: () => {
            deleteCalled = true;
            return {};
        },
    },
];

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

test(`Grades page renders with correct data`, async () => {
    const locale = getLanguage(`en`);
    const { findByText, queryByText } = qlRender(mocks, locale, <Grades />);

    await act(async () => {
        const noRecords = await findByText(`No data found`);

        await waitFor(() => {
            expect(noRecords).toBeTruthy();
        });

        await utils.sleep(0);

        const grades = mocks[0].result?.data.organization.grades;

        for (const grade of grades) {
            if (grade.status === `active`) {
                const gradeName = await screen.getAllByText(grade.name as string);
                await waitFor(() => {
                    expect(gradeName.length).toBeTruthy();
                });
            } else {
                await waitFor(() => {
                    expect(queryByText(grade.name as string)).toBeNull();
                });
            }
        }
    });
});

test(`Grades table properly updates records after delete`, async () => {
    const locale = getLanguage(`en`);
    const { findAllByTitle, queryByText } = await qlRender(mocks, locale, <Grades />);

    await act(async () => {
        await utils.sleep(0);
        const rows = await findAllByTitle(`More actions`);

        await waitFor(() => {
            expect(rows.length).toEqual(3);
            expect(queryByText(`Delete`)).toBeNull();
        });

        await waitFor(() => {
            rows[0].click();
        });

        const deleteSpan = await queryByText(`Delete`);

        await waitFor(() => {
            deleteSpan?.click();
        });

        await utils.sleep(100);
        const rowsUpdate = await findAllByTitle(`More actions`);

        await waitFor(() => {
            expect(rowsUpdate.length).toEqual(2);
        });
    });
});
