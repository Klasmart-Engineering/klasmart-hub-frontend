import 'regenerator-runtime/runtime';
import AgeRanges from './Table';
import { DELETE_AGE_RANGE } from '@/operations/mutations/deleteAgeRange';
import { GET_AGE_RANGES  } from '@/operations/queries/getAgeRange';
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

let deleteCalled = false;
const ageRangeId1 = `a19de3cc-aa01-47f5-9f87-850eb70ae073`;
const ageRangeId2 = `m19de3cc-aa01-47f5-9f87-850eb70ae073`;
const ageRangeId3 = `z19de3cc-aa01-47f5-9f87-850eb70ae073`;
const orgId = `b19de3cc-aa01-47f5-9f87-850eb70ae073`;

const ageRanges = [
    {
        id: ageRangeId1,
        name: `0 - 2 years`,
        low_value: 0,
        high_value: 2,
        low_value_unit: `year`,
        high_value_unit: `year`,
        system: false,
        status: `active`,
    },
    {
        id: ageRangeId2,
        name: `3 - 4 years`,
        low_value: 3,
        high_value: 4,
        low_value_unit: `year`,
        high_value_unit: `year`,
        system: false,
        status: `active`,
    },
    {
        id: ageRangeId3,
        name: `5 - 6 years`,
        low_value: 5,
        high_value: 6,
        low_value_unit: `year`,
        high_value_unit: `year`,
        system: false,
        status: `inactive`,
    },
];

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_AGE_RANGES,
            variables: {
                organization_id: orgId,
            },
        },
        result: {
            data: {
                organization: {
                    ageRanges,
                },
            },
        },
        newData: () => {
            if (!deleteCalled) {
                return {
                    data: {
                        organization: {
                            ageRanges,
                        },
                    },
                };
            } else  {
                return {
                    data: {
                        organization: {
                            ageRanges: ageRanges.filter((ageRange) => ageRange.id !== ageRangeId2),
                        },
                    },
                };
            }
        },
    },
    {
        request: {
            query: DELETE_AGE_RANGE,
            variables: {
                id: ageRangeId2,
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

test(`Age ranges page renders with correct data`, async () => {
    const locale = getLanguage(`en`);
    const { findByText, queryByText } = qlRender(mocks, locale, <AgeRanges />);

    await act(async () => {
        const noRecords = await findByText(`No data found`);

        await waitFor(() => {
            expect(noRecords).toBeTruthy();
        });

        await utils.sleep(0);

        const values = mocks[0].result?.data.organization.ageRanges;
        let i = 0;
        const l = values.length;

        for (i; i < l; i++) {
            if (values[i].status === `active`) {
                const value = await screen.getByText(`${values[i].low_value} - ${values[i].high_value} Year(s)`);
                await waitFor(() => {
                    expect(value).toBeTruthy();
                });
            } else {
                await waitFor(() => {
                    expect(queryByText(`${values[i].low_value} - ${values[i].high_value} Year(s)`)).toBeNull();
                });
            }
        }
    });
});

test(`Age range table properly updates records after delete`, async () => {
    const locale = getLanguage(`en`);
    const { findAllByTitle, queryByText } = await qlRender(mocks, locale, <AgeRanges />);

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
