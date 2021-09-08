import {  GetAllSubjectsPaginatedResponse } from "@/api/subjects";
import { GET_PAGINATED_ORGANIZATION_SUBJECTS } from "@/operations/queries/getPaginatedOrganizationSubjects";
import { mapSubjectNodeToSubjectRow } from "@/utils/subjects";
import 'regenerator-runtime/runtime';
import { SubjectRow } from './Table';
import { getLanguage } from "@/utils/locale";
import {
    act,
    screen,
    waitFor,
} from '@testing-library/react';
import {
    mockOrgId,
    mockSubjects,
} from '@tests/mockDataSubjects';
import { render } from "@tests/utils/render";
import { utils } from 'kidsloop-px';
import React from 'react';
import { isUuid } from "@/utils/pagination";
import SubjectsTable from "./Table";
import { isActive } from "@/types/graphQL";
export const inputSearch = `Maths`;

test(`should return an empty array`, () => {
    const rows: SubjectRow[] = [];

    expect(rows).toEqual([]);
});

test(`should return a truthy boolean if is a well formed UUID`, () => {
    expect(isUuid(mockOrgId)).toBeTruthy();
    for(let mockSubject of mockSubjects){
        expect(isUuid(mockSubject.node.id)).toBeTruthy();
    }
    expect(isUuid(inputSearch)).toBeFalsy();
});

const data: GetAllSubjectsPaginatedResponse = {
    subjectsConnection: {
        totalCount: 4,
        pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: ``,
            endCursor: ``,
        },
        edges: mockSubjects,
    },
};

const mocks = [
    {
        request: {
            query: GET_PAGINATED_ORGANIZATION_SUBJECTS,
            variables: {
                direction: `FORWARD`,
                count: 100,
                orderBy: [ `given_name` ],
                order: `ASC`,
            },
        },
        result: {
            data: mockSubjects,
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

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

test(`Subjects table page renders data`, async () => {
    
    const component = <SubjectsTable
        order="asc"
        orderBy="name"
        loading={false}
        rows={data.subjectsConnection.edges.filter((edge) => isActive(edge.node)).map((edge) => mapSubjectNodeToSubjectRow(edge.node)) ?? []}
    />;
    const { queryAllByText } = render(component);

    await act(async () => {
        const title = await screen.findByText(`Subjects`);

        await waitFor(() => {
            expect(title).toBeTruthy();
        });

        await utils.sleep(0);

        await waitFor(() => {
            for(let mockSubject of mockSubjects){
                expect(queryAllByText(mockSubject.node.name)).toBeTruthy();
            }
        });
    });
});
