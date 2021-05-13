import 'regenerator-runtime/runtime';
import ClassTable from './Table';
import { DELETE_CLASS } from "@/operations/mutations/deleteClass";
import { GET_ALL_CLASSES } from '@/operations/queries/getAllClasses';
import { userMembership } from "@/pages/admin/User/UserTable";
import {
    OrganizationMembership,
    Role,
    School,
    SchoolMembership,
} from "@/types/graphQL";
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

const classIdA = `a19de3cc-aa01-47f5-9f87-850eb70ae073`;
const classIdB = `b19de3cc-aa01-47f5-9f87-850eb70ae073`;
const orgId = `c19de3cc-aa01-47f5-9f87-850eb70ae073`;

let deleteCalled = false;
const classes = [
    {
        class_id: classIdA,
        class_name: `Math`,
        status: `active`,
        schools: [],
        age_ranges: [],
        programs: [],
        subjects: [],
        grades: [],
        students: [],
        teachers: [],
    },
    {
        class_id: classIdB,
        class_name: `English`,
        status: `active`,
        schools: [],
        age_ranges: [],
        programs: [],
        subjects: [],
        grades: [],
        students: [],
        teachers: [],
    },
];

const mocks: MockedResponse[] = [
    {
        request: {
            query: GET_ALL_CLASSES,
            variables: {
                organization_id: orgId,
            },
        },
        result: {
            data: {
                organization: {
                    classes,
                },
            },
        },
        newData: () => {
            if (!deleteCalled) {
                return {
                    data: {
                        organization: {
                            classes,
                        },
                    },
                };
            } else  {
                return {
                    data: {
                        organization: {
                            classes: classes.filter((cl) => cl.class_id !== classIdB),
                        },
                    },
                };
            }
        },
    },
    {
        request: {
            query: DELETE_CLASS,
            variables: {
                class_id: classIdB,
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

test(`Class page renders`, async () => {
    const locale = getLanguage(`en`);
    const { findByText } = qlRender(mocks, locale, <ClassTable />);

    await act(async () => {
        const title = await screen.findByText(`Classes`);
        const noRecords = await findByText(`No records to display`);
        await waitFor(() => {
            expect(title).toBeTruthy();
            expect(noRecords).toBeTruthy();
        });

        await utils.sleep(0);

        const math = await findByText(`Math`);

        await waitFor(() => {
            expect(math).toBeTruthy();
        });
    });
});

test(`Classes table properly updates records after delete`, async () => {
    const locale = getLanguage(`en`);
    const { findAllByTitle, queryByText } = await qlRender(mocks, locale, <ClassTable />);

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

const studentRole: Role = {
    role_id: `fd37310d-5ced-4dda-9968-c6cb084a542b`,
    role_name: `Student`,
    status: `active`,
};

const orgAdminRole: Role = {
    role_id: `23d899cd-862e-4bb6-8e57-761d701bc9fb`,
    role_name: `Organization Admin`,
    status: `active`,
};

const teacherRole: Role = {
    role_id: `893f28d2-69f1-4dc5-aa37-a04b9a8d90b9`,
    role_name: `Teacher`,
    status: `active`,
};

const customRoleA: Role = {
    role_id: `abbc8e9b-9e4b-43bb-95fb-61302ba7f398`,
    role_name: `Role 12`,
    status: `active`,
};

const schoolA: SchoolMembership = {
    school_id: `2b15bed3-d371-4837-bd4d-4b40068c7c51`,
    school_name: `BTS University`,
    status: `active`,
};

const schoolB: School = {
    school_id: `6c1523f8-43f2-4816-8036-93bf29da1018`,
    school_name: `San Javier University`,
    status: `active`,
};

const userA: OrganizationMembership = {
    organization_id: `bd07db26-340d-44f3-a98d-ab1435acdd3d`,
    user_id: `2128d1d6-16b9-5df2-927b-3f2b9ed947d4`,
    join_timestamp: `2020-12-09T23:40:14.595Z`,
    status: `active`,
    shortcode: null,
    schoolMemberships: [],
    user: {
        user_id: `2128d1d6-16b9-5df2-927b-3f2b9ed947d4`,
        given_name: `Andres 09`,
        family_name: `09`,
        email: `andresp+09@bluetrailsoft.com`,
        phone: null,
        avatar: null,
        full_name: `Andres 09 09`,
        gender: null,
        alternate_email: null,
        date_of_birth: null,
        alternate_phone: null,
    },
    roles: [ studentRole, orgAdminRole ],
};
const userB: OrganizationMembership = {
    organization_id: `bd07db26-340d-44f3-a98d-ab1435acdd3d`,
    user_id: `7f4d5778-f512-5253-b456-47c4e80f9cf6`,
    join_timestamp: `2020-12-10T19:03:14.417Z`,
    status: `active`,
    shortcode: `4AAXCY5C1584UKON`,
    schoolMemberships: [
        {
            user_id: `7f4d5778-f512-5253-b456-47c4e80f9cf6`,
            school: schoolA,
            roles: [],
            school_id: `2b15bed3-d371-4837-bd4d-4b40068c7c51`,
        },
        {
            user_id: `7f4d5778-f512-5253-b456-47c4e80f9cf6`,
            school: schoolB,
            roles: [],
            school_id: `6c1523f8-43f2-4816-8036-93bf29da1018`,
        },
    ],
    user: {
        user_id: `7f4d5778-f512-5253-b456-47c4e80f9cf6`,
        given_name: `John`,
        family_name: `Petrucci`,
        email: `john@09.com`,
        phone: null,
        avatar: null,
        full_name: `John Petrucci`,
        gender: `female`,
        alternate_email: null,
        date_of_birth: null,
        alternate_phone: `+52123488`,
    },
    roles: [ studentRole, customRoleA ],
};
const userC: OrganizationMembership = {
    organization_id: `bd07db26-340d-44f3-a98d-ab1435acdd3d`,
    user_id: `7a9e443c-d986-5cb0-94e5-30ed3f597ed3`,
    join_timestamp: `2020-12-10T19:32:35.376Z`,
    status: `inactive`,
    shortcode: null,
    schoolMemberships: [
        {
            user_id: `7a9e443c-d986-5cb0-94e5-30ed3f597ed3`,
            school: schoolA,
            roles: [],
            school_id: `2b15bed3-d371-4837-bd4d-4b40068c7c51`,
        },
        {
            user_id: `7a9e443c-d986-5cb0-94e5-30ed3f597ed3`,
            school: schoolB,
            roles: [],
            school_id: `6c1523f8-43f2-4816-8036-93bf29da1018`,
        },
    ],
    user: {
        user_id: `7a9e443c-d986-5cb0-94e5-30ed3f597ed3`,
        given_name: `Mike`,
        family_name: `Portnoy`,
        email: `mike@09.com`,
        phone: null,
        avatar: null,
        full_name: `Mike Portnoy`,
        gender: null,
        alternate_email: null,
        date_of_birth: null,
        alternate_phone: null,
    },
    roles: [ teacherRole, studentRole ],
};
const userD: OrganizationMembership = {
    organization_id: `bd07db26-340d-44f3-a98d-ab1435acdd3d`,
    user_id: `4b1503a1-1b0b-57ec-b05c-dddd8fe78bc9`,
    join_timestamp: `2020-12-11T17:11:11.992Z`,
    status: `inactive`,
    shortcode: null,
    schoolMemberships: [
        {
            user_id: `4b1503a1-1b0b-57ec-b05c-dddd8fe78bc9`,
            school: schoolA,
            roles: [],
            school_id: `2b15bed3-d371-4837-bd4d-4b40068c7c51`,
        },
    ],
    user: {
        user_id: `4b1503a1-1b0b-57ec-b05c-dddd8fe78bc9`,
        given_name: `Stephen `,
        family_name: `King`,
        email: `stephen@09.com`,
        phone: null,
        avatar: null,
        full_name: `Stephen  King`,
        gender: null,
        alternate_email: null,
        date_of_birth: null,
        alternate_phone: null,
    },
    roles: [ studentRole, teacherRole ],
};

const memberships: OrganizationMembership[] = [
    userA,
    userB,
    userC,
    userD,
];

test(`should create an array of objects that conforms the User Table UserRow interface`, () => {
    const rows = memberships.map(userMembership);

    const final = [
        {
            id: `2128d1d6-16b9-5df2-927b-3f2b9ed947d4`,
            name: `Andres 09 09`,
            avatar: ``,
            contactInfo: `andresp+09@bluetrailsoft.com`,
            roleNames: [ `Organization Admin`, `Student` ],
            schoolNames: [],
            status: `active`,
            joinDate: new Date(`2020-12-09T23:40:14.595Z`),
            gender: ``,
            alternate_email: ``,
            alternate_phone: ``,
            date_of_birth: ``,
            shortcode: null,
        },
        {
            id: `7f4d5778-f512-5253-b456-47c4e80f9cf6`,
            name: `John Petrucci`,
            avatar: ``,
            contactInfo: `john@09.com`,
            roleNames: [ `Role 12`, `Student` ],
            schoolNames: [ `BTS University`, `San Javier University` ],
            status: `active`,
            joinDate: new Date(`2020-12-10T19:03:14.417Z`),
            gender: `female`,
            alternate_email: ``,
            alternate_phone: `+52123488`,
            date_of_birth: ``,
            shortcode: `4AAXCY5C1584UKON`,
        },
        {
            id: `7a9e443c-d986-5cb0-94e5-30ed3f597ed3`,
            name: `Mike Portnoy`,
            avatar: ``,
            contactInfo: `mike@09.com`,
            roleNames: [ `Teacher`, `Student` ],
            schoolNames: [ `BTS University`, `San Javier University` ],
            status: `inactive`,
            joinDate: new Date(`2020-12-10T19:32:35.376Z`),
            gender: ``,
            alternate_email: ``,
            alternate_phone: ``,
            date_of_birth: ``,
            shortcode: null,
        },
        {
            id: `4b1503a1-1b0b-57ec-b05c-dddd8fe78bc9`,
            name: `Stephen  King`,
            avatar: ``,
            contactInfo: `stephen@09.com`,
            roleNames: [ `Teacher`, `Student` ],
            schoolNames: [ `BTS University` ],
            status: `inactive`,
            joinDate: new Date(`2020-12-11T17:11:11.992Z`),
            gender: ``,
            alternate_email: ``,
            alternate_phone: ``,
            date_of_birth: ``,
            shortcode: null,
        },
    ];

    expect(rows).toEqual(final);
});

test(`should return an empty array`, () => {
    const rows = [].map(userMembership);

    expect(rows).toEqual([]);
});
