import 'regenerator-runtime/runtime';
import ClassTable from './Table';
import { DELETE_CLASS } from "@/operations/mutations/deleteClass";
import { GET_ALL_CLASSES } from '@/operations/queries/getAllClasses';
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from '@apollo/client/testing';
import {
    act,
    screen,
    waitFor,
} from '@testing-library/react';
import qlRender from '@tests/utils';
import { utils } from 'kidsloop-px';
import React from 'react';

const classIdA = `a19de3cc-aa01-47f5-9f87-850eb70ae073`;
const classIdB = `b19de3cc-aa01-47f5-9f87-850eb70ae073`;
const orgId = `c19de3cc-aa01-47f5-9f87-850eb70ae073`;

let deleteCalled = false;
const classes = [
    {
        class_id: classIdA,
        class_name: `Math`,
        status: `active`,
        schools: [],
        age_ranges: [],
        programs: [],
        subjects: [],
        grades: [],
        students: [],
        teachers: [],
    },
    {
        class_id: classIdB,
        class_name: `English`,
        status: `active`,
        schools: [],
        age_ranges: [],
        programs: [],
        subjects: [],
        grades: [],
        students: [],
        teachers: [],
    },
];

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_ALL_CLASSES,
            variables: {
                organization_id: orgId,
            },
        },
        result: {
            data: {
                organization: {
                    classes,
                },
            },
        },
        newData: () => {
            if (!deleteCalled) {
                return {
                    data: {
                        organization: {
                            classes,
                        },
                    },
                };
            } else  {
                return {
                    data: {
                        organization: {
                            classes: classes.filter((cl) => cl.class_id !== classIdB),
                        },
                    },
                };
            }
        },
    },
    {
        request: {
            query: DELETE_CLASS,
            variables: {
                class_id: classIdB,
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
            organization_id: orgId,
        }),
        useCurrentOrganizationMembership: () => ({
            organization_id: orgId,
        }),
    };
});

jest.mock(`@/utils/checkAllowed`, () => {
    return {
        ...jest.requireActual(`@/utils/checkAllowed`),
        usePermission: () => true,
    };
});

test(`Class page renders`, async () => {
    const locale = getLanguage(`en`);
    const { findByText } = qlRender(mocks, locale, <ClassTable />);

    await act(async () => {
        const title = await screen.findByText(`Classes`);
        const noRecords = await findByText(`No records to display`);
        await waitFor(() => {
            expect(title).toBeTruthy();
            expect(noRecords).toBeTruthy();
        });

        await utils.sleep(0);

        const math = await findByText(`Math`);

        await waitFor(() => {
            expect(math).toBeTruthy();
        });
    });
});

test(`Classes table properly updates records after delete`, async () => {
    const locale = getLanguage(`en`);
    const { findAllByTitle, queryByText } = await qlRender(mocks, locale, <ClassTable />);

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

        await utils.sleep(100);
        const rowsUpdate = await findAllByTitle(`More actions`);

        await waitFor(() => {
            expect(rowsUpdate.length).toEqual(1);
        });
    });
});
