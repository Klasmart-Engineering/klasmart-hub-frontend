import SchoolsPage from "./index";
import { useGetPaginatedSchools } from "@/api/schools";
import SchoolTable from "@/components/School/Table";
import { usePermission } from "@/utils/permissions";
import { QueryHookOptions } from "@apollo/client";
import { render } from "@testing-library/react";
import {
    schoolA,
    schoolC,
} from "@tests/mockDataSchools";
import { mockOrgId } from "@tests/mockOrganizationData";
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
        useCurrentOrganization: () => ({
            id: mockOrgId,
        }),
    };
});

const schoolNodes = [ schoolA, schoolC ];

const schoolRows = schoolNodes.map(({ node }) => {
    const {
        id,
        name,
        status,
        shortCode,
    } = node;
    const academicTermNames = node.academicTermsConnection?.edges.map((edgeNode) => edgeNode.node.name);
    return {
        id,
        name,
        status,
        shortCode,
        academicTermNames,
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
                    edges: schoolNodes,
                },
            },
        };
    });
});

beforeEach(() => {
    mockSchoolTable.mockClear();
    mockUsePermission.mockReturnValue(true);
});

test(`if User doesn't have view_school or view_my_school Permission no rows are shown`, async () => {

    mockUsePermission.mockImplementation((perm) => {
        return (perm.OR.includes(`view_school_20110`) || perm.OR.includes(perm === `view_my_school_20119`)) ? false : true;
    });

    render(<SchoolsPage />);

    expect(mockSchoolTable)
        .toHaveBeenLastCalledWith(expect.objectContaining({
            rows: [],
            loading: false,
        }), expect.anything());
});

test(`if User has view_school or view_my_school Permission the table contains active Schools`, () => {

    mockUsePermission.mockImplementation((perm) => {
        return (perm.OR.includes(`view_school_20110`) || perm.OR.includes(perm === `view_my_school_20119`)) ? true : false;
    });
    render(<SchoolsPage />);

    expect(mockSchoolTable)
        .toHaveBeenLastCalledWith(expect.objectContaining({
        // Only School A is active
            rows: [ schoolRows[0] ],
            loading: false,
        }), expect.anything());
});
