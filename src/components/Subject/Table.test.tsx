import 'regenerator-runtime/runtime';
import SubjectTable from './Table';
import { DELETE_SUBJECT } from '@/operations/mutations/deleteSubject';
import { GET_ALL_SUBJECTS } from '@/operations/queries/getAllSubjects';
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    screen,
    waitFor,
} from '@testing-library/react';
import {
    mathId1,
    mockOrgId,
    mockPrograms,
    mockSubjects,
} from '@tests/mockDataSubjects';
import qlRender from '@tests/utils';
import { utils } from 'kidsloop-px';
import React from 'react';

let deleteCalled = false;
const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_ALL_SUBJECTS,
            variables: {
                organization_id: mockOrgId,
            },
        },
        result: {
            data: {
                organization: {
                    subjects: mockSubjects,
                    programs: mockPrograms,
                },
            },
        },
        newData: () => {
            if (!deleteCalled) {
                return {
                    data: {
                        organization: {
                            subjects: mockSubjects,
                            programs: mockPrograms,
                        },
                    },
                };
            } else  {
                return {
                    data: {
                        organization: {
                            subjects: mockSubjects.filter((sub) => sub.id !== mathId1),
                            programs: [],
                        },
                    },
                };
            }
        },
    },
    {
        request: {
            query: DELETE_SUBJECT,
            variables: {
                id: mathId1,
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

test(`Subjects table page renders`, async () => {
    const locale = getLanguage(`en`);
    const { findByText } = qlRender([], locale, <SubjectTable />);

    await act(async () => {
        const title = await screen.findByText(`Subjects`);
        const noRecords = await findByText(`No records to display`);
        await waitFor(() => {
            expect(title).toBeTruthy();
            expect(noRecords).toBeTruthy();
        });

        await utils.sleep(0);

        const subjectLabel = await findByText(`Subjects`);

        await waitFor(() => {
            expect(subjectLabel).toBeTruthy();
        });
    });
});

test(`Subjects page renders data`, async () => {
    const locale = getLanguage(`en`);
    const { findByText, queryAllByText } = qlRender(mocks, locale, <SubjectTable />);

    await act(async () => {
        const title = await screen.findByText(`Subjects`);
        const noRecords = await findByText(`No records to display`);
        await waitFor(() => {
            expect(title).toBeTruthy();
            expect(noRecords).toBeTruthy();
        });

        await utils.sleep(0);

        await waitFor(() => {
            expect(queryAllByText(/Math/gi).length).toEqual(2);
            expect(queryAllByText(/Elementary/gi).length).toEqual(1);
            expect(queryAllByText(/Algebra/gi).length).toEqual(1);
        });
    });
});

test(`Subjects table properly updates records after delete`, async () => {
    const locale = getLanguage(`en`);
    const {
        findAllByTitle,
        queryByText,
        queryAllByTitle,
    } = await qlRender(mocks, locale, <SubjectTable />);

    await act(async () => {
        await utils.sleep(0);
        const rows = await findAllByTitle(`More actions`);

        await waitFor(() => {
            expect(rows.length).toEqual(2);
            expect(queryByText(`Delete`)).toBeNull();
        });

        await waitFor(() => {
            rows[0].click();
        });

        const deleteSpan = await queryByText(`Delete`);

        await waitFor(() => {
            deleteSpan?.click();
        });

        await waitFor(() => {
            expect(queryAllByTitle(`More actions`).length).toEqual(1);
        });
    });
});
