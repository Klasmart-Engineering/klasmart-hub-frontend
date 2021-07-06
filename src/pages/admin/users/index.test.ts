import { UserEdge } from "@/api/organizationMemberships";
import { UserItem } from "@/components/User/Table";
import { mapUserRow } from "@/pages/admin/users";
import { Status } from "@/types/graphQL";

const studentRole = {
    id: `fd37310d-5ced-4dda-9968-c6cb084a542b`,
    name: `Student`,
    status: Status.ACTIVE,
};

const orgAdminRole = {
    id: `23d899cd-862e-4bb6-8e57-761d701bc9fb`,
    name: `Organization Admin`,
    status: Status.ACTIVE,
};

const teacherRole = {
    id: `893f28d2-69f1-4dc5-aa37-a04b9a8d90b9`,
    name: `Teacher`,
    status: Status.ACTIVE,
};

const customRoleA = {
    id: `abbc8e9b-9e4b-43bb-95fb-61302ba7f398`,
    name: `Role 12`,
    status: Status.ACTIVE,
};

const schoolA = {
    id: `2b15bed3-d371-4837-bd4d-4b40068c7c51`,
    name: `BTS University`,
    status: Status.ACTIVE,
};

const schoolB = {
    id: `6c1523f8-43f2-4816-8036-93bf29da1018`,
    name: `San Javier University`,
    status: Status.ACTIVE,
};

const userA: UserEdge = {
    node: {
        id: `2128d1d6-16b9-5df2-927b-3f2b9ed947d4`,
        avatar: null,
        contactInfo: {
            email: `john@09.com`,
            phone: null,
        },
        givenName: `Andres 09`,
        familyName: `09`,
        organizations: [
            {
                userStatus: Status.ACTIVE,
                joinDate: `2020-12-09T23:40:14.595Z`,
            },
        ],
        roles: [ studentRole, orgAdminRole ],
        schools: [],
    },
};
const userB: UserEdge = {
    node: {
        id: `7f4d5778-f512-5253-b456-47c4e80f9cf6`,
        avatar: null,
        contactInfo: {
            email: `andresp+09@bluetrailsoft.com`,
            phone: null,
        },
        givenName: `John`,
        familyName: `Petrucci`,
        organizations: [
            {
                userStatus: Status.ACTIVE,
                joinDate: `2020-12-10T19:03:14.417Z`,
            },
        ],
        roles: [ studentRole, customRoleA ],
        schools: [ schoolA, schoolB ],
    },
};
const userC: UserEdge = {
    node: {
        id: `7a9e443c-d986-5cb0-94e5-30ed3f597ed3`,
        avatar: null,
        contactInfo: {
            email: `mike@09.com`,
            phone: null,
        },
        givenName: `Mike`,
        familyName: `Portnoy`,
        organizations: [
            {
                userStatus: Status.INACTIVE,
                joinDate: `2020-12-10T19:32:35.376Z`,
            },
        ],
        roles: [ teacherRole, studentRole ],
        schools: [ schoolA, schoolB ],
    },
};
const userD: UserEdge = {
    node: {
        id: `4b1503a1-1b0b-57ec-b05c-dddd8fe78bc9`,
        avatar: null,
        contactInfo: {
            email: `stephen@09.com`,
            phone: null,
        },
        givenName: `Stephen`,
        familyName: `King`,
        organizations: [
            {
                userStatus: Status.INACTIVE,
                joinDate: `2020-12-11T17:11:11.992Z`,
            },
        ],
        roles: [ studentRole, teacherRole ],
        schools: [ schoolA ],
    },
};

const userEdges: UserEdge[] = [
    userA,
    userB,
    userC,
    userD,
];

test(`map server users to table users`, () => {
    const rows = userEdges.map(mapUserRow);

    const final: UserItem[] = [
        {
            id: `2128d1d6-16b9-5df2-927b-3f2b9ed947d4`,
            givenName: `Andres 09`,
            familyName: `09`,
            avatar: ``,
            contactInfo: `john@09.com`,
            roleNames: [ `Organization Admin`, `Student` ],
            schoolNames: [],
            status: `active`,
            joinDate: new Date(`2020-12-09T23:40:14.595Z`),
        },
        {
            id: `7f4d5778-f512-5253-b456-47c4e80f9cf6`,
            givenName: `John`,
            familyName: `Petrucci`,
            avatar: ``,
            contactInfo: `andresp+09@bluetrailsoft.com`,
            roleNames: [ `Role 12`, `Student` ],
            schoolNames: [ `BTS University`, `San Javier University` ],
            status: `active`,
            joinDate: new Date(`2020-12-10T19:03:14.417Z`),
        },
        {
            id: `7a9e443c-d986-5cb0-94e5-30ed3f597ed3`,
            givenName: `Mike`,
            familyName: `Portnoy`,
            avatar: ``,
            contactInfo: `mike@09.com`,
            roleNames: [ `Teacher`, `Student` ],
            schoolNames: [ `BTS University`, `San Javier University` ],
            status: `inactive`,
            joinDate: new Date(`2020-12-10T19:32:35.376Z`),
        },
        {
            id: `4b1503a1-1b0b-57ec-b05c-dddd8fe78bc9`,
            givenName: `Stephen`,
            familyName: `King`,
            avatar: ``,
            contactInfo: `stephen@09.com`,
            roleNames: [ `Teacher`, `Student` ],
            schoolNames: [ `BTS University` ],
            status: `inactive`,
            joinDate: new Date(`2020-12-11T17:11:11.992Z`),
        },
    ];

    expect(rows).toEqual(final);
});

test(`should return an empty array`, () => {
    const rows = [].map(mapUserRow);

    expect(rows).toEqual([]);
});
