import { useGetOrganizationMembershipsPermissions } from "@/api/organizationMemberships";
import { Organization } from "@/types/graphQL";
import {
    PermissionId,
    PermissionOption,
    usePermission as realUsePermission,
} from "@/utils/permissions";
import { renderHook } from '@testing-library/react-hooks';

const usePermission = (permission: PermissionOption, wait?: boolean) => {
    const { result } = renderHook(() => realUsePermission(permission, wait));
    return result.current;
};

const mockOrganization: Organization = {
    organization_id: `17572dea-8773-43f8-b459-48c0fc9bce34`,
    organization_name: `Mock Organization`,
};

const mockPermissionsAPI = useGetOrganizationMembershipsPermissions as jest.MockedFunction<typeof useGetOrganizationMembershipsPermissions>;

jest.mock(`@/api/organizationMemberships`, () => {
    return {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __esModule: true,
        useGetOrganizationMembershipsPermissions: jest.fn(),
    };
});

jest.mock(`@/store/organizationMemberships`, () => {
    return {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __esModule: true,
        useCurrentOrganizationMembership: () => ({
            organization_id: mockOrganization.organization_id,
        }),
    };
});

function mockPermissions (perms?: PermissionId[], isLoading?: boolean) {
    mockPermissionsAPI.mockReturnValue({
        data: {
            me: {
                membership: {
                    organization_id: mockOrganization.organization_id,
                    roles: [
                        {
                            permissions: perms?.map((id) => ({
                                permission_id: id,
                            })) ?? [],
                        },
                    ],
                },
            },
        },
        loading: isLoading ?? false,
    });
}

beforeAll(mockPermissionsAPI.mockClear);

test(`single permission missing from User have returns false`, () => {
    mockPermissions();

    expect(usePermission(`library_200`)).toBe(false);
});

test(`single permission present for User returns true`, () => {
    mockPermissions([ `library_200` ]);

    expect(usePermission(`library_200`)).toBe(true);
});

test(`multiple permissions when the User only has some returns false`, () => {
    mockPermissions([ `library_200` ]);

    expect(usePermission([ `library_200`, `academic_profile_20100` ])).toBe(false);
});

test(`multiple permissions when the User has all returns true`, () => {
    mockPermissions([ `library_200`, `academic_profile_20100` ]);

    expect(usePermission([ `library_200`, `academic_profile_20100` ])).toBe(true);
});

test(`PermissionOption with OR and User has no permissions returns false`, () => {
    mockPermissions();

    expect(usePermission({
        OR: [ `library_200`, `academic_profile_20100` ],
    })).toBe(false);
});

test(`PermissionOption with OR and User has at least one permission returns true`, () => {
    mockPermissions([ `library_200` ]);

    expect(usePermission({
        OR: [ `library_200`, `academic_profile_20100` ],
    })).toBe(true);
});

test(`PermissionOption with AND and User has only one permission returns false`, () => {
    mockPermissions([ `library_200` ]);

    expect(usePermission({
        AND: [ `library_200`, `academic_profile_20100` ],
    })).toBe(false);
});

test(`PermissionOption with AND and User has both permissions returns true`, () => {
    mockPermissions([ `library_200`, `academic_profile_20100` ]);

    expect(usePermission({
        AND: [ `library_200`, `academic_profile_20100` ],
    })).toBe(true);
});

describe(`PermissionOption with AND and OR`, () => {
    const permissionOption: PermissionOption = {
        AND: [ `library_200` ],
        OR: [ `reports_600`, `academic_profile_20100` ],
    };

    test(`when User has the required and one optional permission returns true`, () => {
        mockPermissions([ `library_200`, `reports_600` ]);

        expect(usePermission(permissionOption)).toBe(true);
    });

    test(`when User doesn't have the required permission returns false`, () => {
        mockPermissions([ `reports_600` ]);

        expect(usePermission(permissionOption)).toBe(false);
    });

    test(`when User doesn't have either optional permission returns false`, () => {
        mockPermissions([ `library_200` ]);

        expect(usePermission(permissionOption)).toBe(false);
    });
});

describe(`PermissionOption with OR and nested ANDs`, () => {
    const permissionOption: PermissionOption = {
        OR: [
            {
                AND: [ `library_200`, `reports_600` ],
            },
            {
                AND: [ `assessments_400`, `academic_profile_20100` ],
            },
        ],
    };

    test(`when User doesn't have any permission returns false`, () => {
        mockPermissions();

        expect(usePermission(permissionOption)).toBe(false);
    });

    test(`when the User has some permissions on one AND branch returns false`, () => {
        mockPermissions([ `assessments_400` ]);

        expect(usePermission(permissionOption)).toBe(false);
    });

    test(`when the User has all permissions on one AND branch returns true`, () => {
        mockPermissions([ `assessments_400`, `academic_profile_20100` ]);

        expect(usePermission(permissionOption)).toBe(true);
    });

    test(`when the User has all permissions on both AND branches returns true`, () => {
        mockPermissions([
            `library_200`,
            `assessments_400`,
            `reports_600`,
            `academic_profile_20100`,
        ]);

        expect(usePermission(permissionOption)).toBe(true);
    });
});

test.each([ true, false ])(`wait=true when API response is loading returns loading UsePermissionResult when User hasPermission=%s`, (hasPermission) => {
    mockPermissions(hasPermission ? [ `library_200` ] : [], true);

    expect(usePermission(`library_200`, true)).toEqual({
        loading: true,
        hasPermission: undefined,
    });
});

test.each([ true, false ])(`wait=true when API response has loaded returns complete UsePermissionResult when User hasPermission=%s`, (hasPermission) => {
    mockPermissions(hasPermission ? [ `library_200` ] : [], false);

    expect(usePermission(`library_200`, true)).toEqual({
        loading: false,
        hasPermission,
    });
});
