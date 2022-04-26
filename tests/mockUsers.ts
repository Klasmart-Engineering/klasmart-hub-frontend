import {
    mockSchoolName1,
    mockSchoolName2,
} from "./mockDataSchools";
import { UserNode } from "@/api/users";
import { PickRequired } from "@/types/generics";
import {
    OrganizationMembership,
    SchoolMembership,
    Status,
    User,
} from "@/types/graphQL";
import { mockOrg } from "@tests/mockOrganizationData";
import { mockRoles } from "@tests/mockRoles";
import {
    schoolA,
    schoolB,
    schoolC,
} from "@tests/mocks/mockSchools";

type MockUser = PickRequired<
    User,
    | `user_id`
    | `given_name`
    | `family_name`
    | `email`
    | `phone`
    | `alternate_email`
    | `alternate_phone`
    | `date_of_birth`
    | `gender`
>;

const mockUserId = `c62dc8c3-b2f4-472e-872c-8c148361a2e8`;

const mockUserInfo: MockUser = {
    user_id: mockUserId,
    given_name: `Joe`,
    family_name: `Bloggs`,
    email: `joe.bloggs@calmid.com`,
    phone: `+44012345678910`,
    alternate_email: `joe.bloggs@gmail.com`,
    alternate_phone: `+8610987654321`,
    date_of_birth: `01-1990`,
    gender: `male`,
};

export const mockUserInfo2: MockUser = {
    user_id: `b7e3c7e8-e772-48d9-906e-aec39e3184d9`,
    given_name: `Jane`,
    family_name: `Smith`,
    email: `jane.smith@calmid.com`,
    phone: `+4412345654321`,
    alternate_email: `jane.smith@gmail.com`,
    alternate_phone: `+861231245645`,
    date_of_birth: `12-1999`,
    gender: `female`,
};

export const mockSchoolMemberships: SchoolMembership[] = [
    {
        user_id: mockUserId,
        school_id: schoolA.school_id,
        school: {
            school_id: schoolA.school_id,
            school_name: schoolA.school_name,
            status: Status.ACTIVE,
        },
        status: Status.ACTIVE,
    },
    {
        user_id: mockUserId,
        school_id: schoolB.school_id,
        school: {
            school_id: schoolB.school_id,
            school_name: schoolB.school_name,
            status: Status.INACTIVE,
        },
        status: Status.INACTIVE,
    },
    {
        user_id: mockUserId,
        school_id: schoolC.school_id,
        school: {
            school_id: schoolC.school_id,
            school_name: schoolC.school_name,
            status: Status.ACTIVE,
        },
        status: Status.ACTIVE,
    },
];

export const mockSchoolMemberships2: SchoolMembership[] = [
    {
        user_id: mockUserInfo2.user_id,
        school_id: schoolC.school_id,
        school: {
            school_id: schoolC.school_id,
            school_name: schoolC.school_name,
            status: Status.ACTIVE,
        },
    },
];

export type MockOrganizationMembership = PickRequired<
    OrganizationMembership,
    | `user_id`
    | `organization_id`
    | `roles`
    | `shortcode`
    | `status`
    | `schoolMemberships`
> & {
    user: MockUser;
};

export const mockOrganizationMemberships: MockOrganizationMembership[] = [
    {
        organization_id: mockOrg.organization_id,
        user_id: mockUserId,
        user: mockUserInfo,
        shortcode: `ABCDE12345`,
        status: Status.ACTIVE,
        roles: [
            mockRoles.organizationAdmin,
            mockRoles.inactiveRole,
            mockRoles.customRole,
        ],
        schoolMemberships: mockSchoolMemberships,
    },
];

export const mockUserNode: UserNode = {
    id: mockUserId,
    givenName: `John`,
    familyName: `Doe`,
    gender: `male`,
    dateOfBirth: `01-1995`,
    contactInfo: {
        email: `test@test.com`,
        phone: null,
        username: `username`,
    },
    alternateContactInfo: {
        email: `alt@alttest.com`,
        phone: `111-111-2222`,
    },
    organizationMembershipsConnection: {
        edges: [
            {
                node: {
                    shortCode: `abc123`,
                    userId: mockUserId,
                    rolesConnection: {
                        edges: [
                            {
                                node: {
                                    id: mockRoles.organizationAdmin.role_id,
                                    name: mockRoles.organizationAdmin.role_name as string,
                                    status: Status.ACTIVE,
                                },
                            },
                        ],
                    },
                },
            },
        ],
    },
    schoolMembershipsConnection: {
        edges: [
            {
                node: {
                    school: {
                        id: schoolA.school_id,
                        name: schoolA.school_name as string,
                        organizationId: mockOrg.organization_id,
                        status: Status.ACTIVE,
                    },
                },
            },
            {
                node: {
                    school: {
                        id: schoolB.school_id,
                        name: schoolB.school_name as string,
                        organizationId: mockOrg.organization_id,
                        status: Status.INACTIVE,
                    },
                },
            },
        ],
    },
};

export const mockOrganizationMembership2: MockOrganizationMembership = {
    organization_id: mockOrg.organization_id,
    user_id: mockUserInfo2.user_id,
    user: mockUserInfo2,
    shortcode: `FGH678`,
    status: Status.ACTIVE,
    roles: [ mockRoles.parent ],
    schoolMemberships: mockSchoolMemberships2,
};

export const mockUser: MockUser & {
    school_memberships: SchoolMembership[];
    memberships: MockOrganizationMembership[];
} = {
    ...mockUserInfo,
    school_memberships: mockSchoolMemberships,
    memberships: mockOrganizationMemberships,
};
