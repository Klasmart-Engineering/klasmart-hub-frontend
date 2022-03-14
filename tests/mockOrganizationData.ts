import { Status } from "@/types/graphQL";

export const mockOrgId = `ca5c4f8d-aa60-43e4-9347-dc9e209fba30`;
export const mockUserId = `f6d5a6e2-ebb2-5b0b-836d-2731b2594500`;

export const mockOrgStack = [
    {
        organization: {
            id: mockOrgId,
            name: `KidsLoop Miracle Squad`,
            owners: [
                {
                    email: `owneremail@testing.com`,
                },
            ],
        },
        rolesConnection: {
            edges: [
                {
                    node: {
                        id: `23d899cd-862e-4bb6-8e57-761d701bc9fb`,
                        name: `Organization Admin`,
                    },
                },
                {
                    node: {
                        id: `23d899cd-862e-4bb6-8e57-761d701bc9fc`,
                        name: `School Admin`,
                    },
                },
            ],
        },
    },
];

export const mockOrg = {
    organization_id: mockOrgId,
    organization_name: `My Mock Org`,
    status: Status.ACTIVE,
    address1: `1000 Acres Rd`,
    address2: null,
    shortCode: `MMO`,
    phone: `1112223344`,
    roles: null,
    students: [],
    primary_contact: null,
    classes: [],
    schools: [],
    memberships: [],
    ageRanges: [],
    programs: [],
    subjects: [],
    grades: [],
    categories: [],
    subcategories: [],
    color: `#334455`,
    alternateText: ``,
    organizationLogo: null,
};
