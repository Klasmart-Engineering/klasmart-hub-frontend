import SubjectsTable,
{ SubjectRow } from './Table';
import { GetAllSubjectsPaginatedResponse } from "@/api/subjects";
import { isActive } from "@/types/graphQL";
import { isUuid } from "@/utils/pagination";
import { mapSubjectNodeToSubjectRow } from "@/utils/subjects";
import {
    screen,
    waitFor,
} from '@testing-library/react';
import {
    mockOrgId,
    mockSubjects,
} from '@tests/mockDataSubjects';
import { render } from "@tests/utils/render";
import React from 'react';

const inputSearch = `Maths`;

test(`should return an empty array`, () => {
    const rows: SubjectRow[] = [];

    expect(rows).toEqual([]);
});

test(`should return a truthy boolean if is a well formed UUID`, () => {
    expect(isUuid(mockOrgId)).toBeTruthy();
    for(const mockSubject of mockSubjects.edges){
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
        edges: mockSubjects.edges,
    },
};

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => ({
            id: mockOrgId,
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
    render(component);

    expect(screen.queryByText(`Subjects`)).toBeInTheDocument();

    await waitFor(() => {
        for(const mockSubject of mockSubjects.edges){
            expect(screen.queryAllByText(mockSubject.node.name).length).toBeTruthy();
        }
    });
});
