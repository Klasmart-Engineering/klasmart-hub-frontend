import TeacherFeedback from './Table';
import {
    screen,
    waitFor,
} from "@testing-library/react";
import { mockHomeCardData } from "@tests/mockHomeCard";
import { render } from '@tests/utils/render';
import React from 'react';

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => undefined,
    };
});

jest.mock(`@/api/restapi`, () => {
    return {
        ...jest.requireActual(`@/api/restapi`),
        useRestAPI: () => ({
            getAssessmentsForStudent: () => (new Promise((resolve) => {
                resolve(mockHomeCardData);
            })),
        }),
    };
});

jest.mock(`react-redux`, () => {
    return {
        ...jest.requireActual(`react-redux`),
        useStore: () => ({}),
    };
});

test(`Home feedback card loads data correctly`, async () => {
    const component = <TeacherFeedback
    />;
    render(component);

    await waitFor(() => {
        expect(screen.queryByText(`Testing Fun`)).toBeInTheDocument();
        expect(screen.queryByText(`Test 12345`)).toBeInTheDocument();
        expect(screen.queryByText(`Average`)).toBeInTheDocument();
        expect(screen.queryByText(`Good`)).toBeInTheDocument();
        expect(screen.queryByText(`This was excellent.`)).toBeInTheDocument();
        expect(screen.queryByText(`The task was ok.`)).toBeInTheDocument();
    });
});
