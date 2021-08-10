import 'regenerator-runtime/runtime';
import AgeRanges from './Table';
import { buildAgeRangeLabel } from "@/utils/ageRanges";
import { getLanguage } from "@/utils/locale";
import {
    act,
    screen,
    waitFor,
} from '@testing-library/react';
import qlRender from '@tests/utils';
import { utils } from 'kidsloop-px';
import React from 'react';

const ageRangeId1 = `a19de3cc-aa01-47f5-9f87-850eb70ae073`;
const ageRangeId2 = `m19de3cc-aa01-47f5-9f87-850eb70ae073`;
const ageRangeId3 = `z19de3cc-aa01-47f5-9f87-850eb70ae073`;
const orgId = `b19de3cc-aa01-47f5-9f87-850eb70ae073`;

const ageRanges = [
    {
        id: ageRangeId1,
        low_value: 0,
        high_value: 2,
        low_value_unit: `year`,
        high_value_unit: `year`,
        system: false,
        status: `active`,
    },
    {
        id: ageRangeId2,
        low_value: 3,
        high_value: 4,
        low_value_unit: `year`,
        high_value_unit: `year`,
        system: false,
        status: `active`,
    },
    {
        id: ageRangeId3,
        low_value: 5,
        high_value: 6,
        low_value_unit: `year`,
        high_value_unit: `year`,
        system: false,
        status: `inactive`,
    },
];

const data = {
    ageRangesConnection: {
        totalCount: ageRanges.length,
        pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: ``,
            endCursor: ``,
        },
        edges: ageRanges,
    },
};

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

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

test(`Age ranges page renders with correct data`, async () => {
    const locale = getLanguage(`en`);

    const rows =
    data?.ageRangesConnection?.edges?.map((edge) => ({
        id: edge?.id as string,
        system: edge?.system,
        ageRange: buildAgeRangeLabel({
            high_value: edge?.high_value,
            high_value_unit: edge?.high_value_unit,
            low_value: edge?.low_value as number,
            low_value_unit: edge?.low_value_unit as string,
        }),
    })) ?? [];

    const component = <AgeRanges
        order="asc"
        orderBy="name"
        rows={rows}
    />;
    const {  queryAllByText } = qlRender([], locale, component);

    await act(async () => {

        const title = await screen.findByText(`Age Ranges`);

        await waitFor(() => {
            expect(title).toBeTruthy();
        });

        await utils.sleep(0);

        await waitFor(() => {
            expect(queryAllByText(`0 - 2 Year(s)`)).toHaveLength(1);

        });

        for (const ageRange of ageRanges) {
            const value = `${ageRange.low_value} - ${ageRange.high_value} Year(s)`;
            if (ageRange.status === `active`) {
                await waitFor(() => {
                    expect(queryAllByText(value)).toHaveLength(1);
                });
            } else {
                await waitFor(() => {
                    expect(queryAllByText(value)).toHaveLength(1);
                });
            }
        }
    });
});
