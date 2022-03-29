import { UserEdge } from "@/api/organizationMemberships";
import { UserRow } from "@/components/User/Table";
import { mapUserRow } from "@/pages/admin/users";
import { Status } from "@/types/graphQL";

const organizationId = `217466ed-3020-4117-b922-b8339c61573e`;

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

const gradeA = {
    id: `781e8a08-29e8-4171-8392-7e8ac9f183a0`,
    name: `Grade 1`,
    status: Status.ACTIVE,
};

const gradeB = {
    id: `100f774a-3d7e-4be5-9c2c-ae70f40f0b50`,
    name: `Grade 2`,
    status: Status.ACTIVE,
};

const classA = {
    id: `b7fe12e7-7b80-46ba-8759-7b97b3dbf513`,
    name: `Sunshine`,
    status: Status.ACTIVE,
};

const classB = {
    id: `1a4cbef2-f836-476e-9a2d-2de7b5ee089a`,
    name: `Moon Light`,
    status: Status.ACTIVE,
};

const userA: UserEdge = {
    node: {
        id: `2128d1d6-16b9-5df2-927b-3f2b9ed947d4`,
        avatar: undefined,
        contactInfo: {
            email: `john@09.com`,
            phone: null,
        },
        givenName: `Andres 09`,
        familyName: `09`,
        organizationMembershipsConnection: {
            edges: [
                {
                    node: {
                        status: Status.ACTIVE,
                        joinTimestamp: `2020-12-10T19:03:14.417Z`,
                        rolesConnection: {
                            edges: [
                                {
                                    node: {
                                        ...orgAdminRole,

                                    },
                                },
                                {

                                    node: {
                                        ...studentRole,
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        },
        schoolMembershipsConnection: {
            edges: [],
        },
        classesStudyingConnection: {
            edges: [],
        },
        classesTeachingConnection: {
            edges: [],
        },
    },
};
const userB: UserEdge = {
    node: {
        id: `7f4d5778-f512-5253-b456-47c4e80f9cf6`,
        avatar: undefined,
        contactInfo: {
            email: `andresp+09@bluetrailsoft.com`,
            phone: null,
            username: null,
        },
        givenName: `John`,
        familyName: `Petrucci`,
        organizationMembershipsConnection: {
            edges: [
                {
                    node: {
                        status: Status.ACTIVE,
                        joinTimestamp: `2020-12-10T19:03:14.417Z`,
                        rolesConnection: {
                            edges: [
                                {
                                    node: {
                                        ...customRoleA,
                                    },
                                },
                                {

                                    node: {
                                        ...studentRole,
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
                            ...schoolA,
                        },
                    },
                },
                {

                    node: {
                        school: {
                            ...schoolB,
                        },
                    },
                },
            ],
        },
        classesTeachingConnection: {
            edges: [],
        },
        classesStudyingConnection: {
            edges: [
                {
                    node: {
                        ...classA,
                        gradesConnection: {
                            edges: [
                                {
                                    node: {
                                        ...gradeA,
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        },
    },
};
const userC: UserEdge = {
    node: {
        id: `7a9e443c-d986-5cb0-94e5-30ed3f597ed3`,
        avatar: undefined,
        contactInfo: {
            email: `mike@09.com`,
            phone: null,
            username: null,
        },
        givenName: `Mike`,
        familyName: `Portnoy`,
        organizationMembershipsConnection: {
            edges: [
                {
                    node: {
                        status: Status.INACTIVE,
                        joinTimestamp: `2020-12-10T19:32:35.376Z`,
                        rolesConnection: {
                            edges: [
                                {
                                    node: {
                                        ...teacherRole,
                                    },
                                },
                                {

                                    node: {
                                        ...studentRole,
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
                            ...schoolA,
                        },
                    },
                },
                {

                    node: {
                        school: {
                            ...schoolB,
                        },
                    },
                },
            ],
        },
        classesTeachingConnection: {
            edges: [
                {
                    node: {
                        ...classB,
                        gradesConnection: {
                            edges: [
                                {
                                    node: {
                                        ...gradeB,
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        },
        classesStudyingConnection: {
            edges: [],
        },
    },
};
const userD: UserEdge = {
    node: {
        id: `4b1503a1-1b0b-57ec-b05c-dddd8fe78bc9`,
        avatar: undefined,
        contactInfo: {
            email: `stephen@09.com`,
            phone: null,
            username: null,
        },
        givenName: `Stephen`,
        familyName: `King`,
        organizationMembershipsConnection: {
            edges: [
                {
                    node: {
                        status: Status.INACTIVE,
                        joinTimestamp: `2020-12-11T17:11:11.992Z`,
                        rolesConnection: {
                            edges: [
                                {
                                    node: {
                                        ...teacherRole,
                                    },
                                },
                                {

                                    node: {
                                        ...studentRole,
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
                            ...schoolA,
                        },
                    },
                },
            ],
        },
        classesTeachingConnection: {
            edges: [
                {
                    node: {
                        ...classB,
                        gradesConnection: {
                            edges: [
                                {
                                    node: {
                                        ...gradeB,
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        },
        classesStudyingConnection: {
            edges: [
                {
                    node: {
                        ...classA,
                        gradesConnection: {
                            edges: [
                                {
                                    node: {
                                        ...gradeA,
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        },
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

    const final: UserRow[] = [
        {
            id: `2128d1d6-16b9-5df2-927b-3f2b9ed947d4`,
            givenName: `Andres 09`,
            familyName: `09`,
            avatar: ``,
            email: `john@09.com`,
            phone: ``,
            roleNames: [ `Organization Admin`, `Student` ],
            schoolNames: [],
            classNames: [],
            gradeNames: [],
            status: `active`,
            joinDate: new Date(`2020-12-10T19:03:14.417Z`),
        },
        {
            id: `7f4d5778-f512-5253-b456-47c4e80f9cf6`,
            givenName: `John`,
            familyName: `Petrucci`,
            avatar: ``,
            email: `andresp+09@bluetrailsoft.com`,
            phone: ``,
            roleNames: [ `Role 12`, `Student` ],
            schoolNames: [ `BTS University`, `San Javier University` ],
            classNames: [ `Sunshine` ],
            gradeNames: [ `Grade 1` ],
            status: `active`,
            joinDate: new Date(`2020-12-10T19:03:14.417Z`),
        },
        {
            id: `7a9e443c-d986-5cb0-94e5-30ed3f597ed3`,
            givenName: `Mike`,
            familyName: `Portnoy`,
            avatar: ``,
            email: `mike@09.com`,
            phone: ``,
            roleNames: [ `Teacher`, `Student` ],
            schoolNames: [ `BTS University`, `San Javier University` ],
            classNames: [ `Moon Light` ],
            gradeNames: [ `Grade 2` ],
            status: `inactive`,
            joinDate: new Date(`2020-12-10T19:32:35.376Z`),
        },
        {
            id: `4b1503a1-1b0b-57ec-b05c-dddd8fe78bc9`,
            givenName: `Stephen`,
            familyName: `King`,
            avatar: ``,
            email: `stephen@09.com`,
            phone: ``,
            roleNames: [ `Teacher`, `Student` ],
            schoolNames: [ `BTS University` ],
            classNames: [ `Sunshine`, `Moon Light` ],
            gradeNames: [ `Grade 1`, `Grade 2` ],
            status: `inactive`,
            joinDate: new Date(`2020-12-11T17:11:11.992Z`),
        },
    ];

    expect(rows).toEqual(final);
});

test(`filters out inactive roles`, () => {
    expect([
        {
            node: {
                ...userA.node,
                organizationMembershipsConnection: {
                    edges: [
                        {
                            node: {
                                status: Status.ACTIVE,
                                joinTimestamp: `2020-12-11T17:11:11.992Z`,
                                rolesConnection: {
                                    edges: [
                                        {
                                            node: {
                                                id: `aadb5b12-b8fe-424d-854f-8e87b1a6885e`,
                                                status: Status.INACTIVE,
                                                name: `Inactive Role`,
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                },
            },
        },
    ].map(mapUserRow).map(userRow => userRow.roleNames)[0]).toEqual([]);
});

test(`should return an empty array`, () => {
    const rows = [].map(mapUserRow);

    expect(rows).toEqual([]);
});
