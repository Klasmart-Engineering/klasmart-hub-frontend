import SchoolsPage from "./index";
import { useGetPaginatedSchools } from "@/api/schools";
import SchoolTable from "@/components/School/Table";
import { usePermission } from "@/utils/permissions";
import { QueryHookOptions } from "@apollo/client";
import { render } from "@testing-library/react";
import { mockOrg } from "@tests/mockOrganizationData";
import {
    schoolA,
    schoolB,
} from "@tests/mocks/mockSchools";
import React from "react";

jest.mock(`@/utils/permissions`, () => {
    return {
        usePermission: jest.fn(),
    };
});

jest.mock(`@/components/School/Table`, () => {
    return {
        __esModule: true,
        default: jest.fn(() => null),
    };
});

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        useCurrentOrganization: () => mockOrg,
    };
});

const schoolNodes = [ schoolA, schoolB ].map((school) => {
    const {
        school_id: id,
        school_name: name,
        status,
        shortcode: shortCode,
    } = school;
    return {
        id,
        name,
        status,
        shortCode,
    };
});

jest.mock(`@/api/schools`, () => {
    return {
        useGetPaginatedSchools: jest.fn(),
    };
});

const mockSchoolAPI = useGetPaginatedSchools as jest.MockedFunction<typeof useGetPaginatedSchools>;

const mockSchoolTable = SchoolTable as jest.MockedFunction<typeof SchoolTable>;

const mockUsePermission = usePermission as jest.MockedFunction<
    typeof usePermission
>;

beforeAll(() => {
    mockSchoolAPI.mockImplementation((options?: QueryHookOptions) => {
        const defaultResponse = {
            data: undefined,
            loading: false,
            refetch: jest.fn(),
            fetchMore: jest.fn(),
        };

        if (options?.skip) {
            return defaultResponse;
        }
        return {
            ...defaultResponse,
            data: {
                schoolsConnection: {
                    totalCount: schoolNodes.length,
                    pageInfo: {
                        hasNextPage: false,
                        hasPreviousPage: false,
                        startCursor: `X`,
                        endCursor: `Y`,
                    },
                    edges: schoolNodes.map((node) => {
                        return {
                            node,
                        };
                    }),
                },
            },
        };
    });
});

beforeEach(() => {
    mockSchoolTable.mockClear();
    mockUsePermission.mockReturnValue(true);
});

test(`if User doesn't have view_school Permission no rows are shown`, async () => {
    mockUsePermission.mockImplementation((perm) => {
        return perm === `view_school_20110` ? false : true;
    });

    render(<SchoolsPage/>);

    expect(mockSchoolTable).toHaveBeenLastCalledWith(expect.objectContaining({
        rows: [],
        loading: false,
    }), expect.anything());
});

test(`if User has view_school Permission the table contains active Schools`, async () => {
    render(<SchoolsPage/>);

    expect(mockSchoolTable).toHaveBeenLastCalledWith(expect.objectContaining({
        // Only School A is active
        rows: [ schoolNodes[0] ],
        loading: false,
    }), expect.anything());
});