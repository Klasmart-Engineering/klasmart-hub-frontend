import "regenerator-runtime/runtime";
import ClassTable from "./Table";
import {
    isActive,
    organizationClasses,
} from "@/components/Class/Table";
import { DELETE_CLASS } from "@/operations/mutations/deleteClass";
import { GET_ALL_CLASSES } from "@/operations/queries/getAllClasses";
import { Class } from "@/types/graphQL";
import { getLanguage } from "@/utils/locale";
import { MockedResponse } from "@apollo/client/testing";
import {
    act,
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import qlRender from "@tests/utils";
import { utils } from "kidsloop-px";
import React from "react";

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
            } else {
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

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
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

        await waitForElementToBeRemoved(() => queryByText(`English`));
        const rowsUpdate = await findAllByTitle(`More actions`);

        await waitFor(() => {
            expect(rowsUpdate.length).toEqual(1);
        });
    });
});

const classA: Class = {
    class_id: `fe8d14d5-2ef0-4dd2-bf72-8dc3cfce9ff8`,
    class_name: `Class for Roberto`,
    status: `active`,
    schools: [
        {
            school_id: `2b15bed3-d371-4837-bd4d-4b40068c7c51`,
            school_name: `BTS University`,
        },
        {
            school_id: `6c1523f8-43f2-4816-8036-93bf29da1018`,
            school_name: `San Javier University`,
        },
        {
            school_id: `61e2e4d8-54ee-4499-8251-fb6795016da6`,
            school_name: `School with code`,
        },
        {
            school_id: `ef37c995-c7c1-42f5-8c0d-9bb0a91cd6ec`,
            school_name: `School for CSV`,
        },
        {
            school_id: `596cf57e-4365-40fd-94f8-6f080fc761dc`,
            school_name: `School Unique`,
        },
        {
            school_id: `44869cf9-4b27-4225-83a5-b119682a5ac7`,
            school_name: `School Unique 2`,
        },
        {
            school_id: `ef3f3132-16a2-411e-9b1b-9d71b252ddad`,
            school_name: `School Unique 3`,
        },
    ],
    age_ranges: [
        {
            id: `48ae4957-fd81-469c-a032-5f08459efcd6`,
            name: `Age Range 1`,
            high_value: 8,
            high_value_unit: `month`,
            low_value: 1,
            low_value_unit: `month`,
            status: `active`,
            system: false,
        },
        {
            id: `fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
            name: `5 - 6 year(s)`,
            high_value: 6,
            high_value_unit: `year`,
            low_value: 5,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `4cb0ad2f-2c4a-4120-a9d4-7c874bda717a`,
            name: `Age Range 3`,
            high_value: 10,
            high_value_unit: `month`,
            low_value: 2,
            low_value_unit: `month`,
            status: `active`,
            system: false,
        },
        {
            id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
            name: `3 - 4 year(s)`,
            high_value: 4,
            high_value_unit: `year`,
            low_value: 3,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `bb7982cd-020f-4e1a-93fc-4a6874917f07`,
            name: `4 - 5 year(s)`,
            high_value: 5,
            high_value_unit: `year`,
            low_value: 4,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
    ],
    programs: [
        {
            id: `0a54c6b4-b051-4503-a4fd-f7b8b4f88aa6`,
            name: `My Second Program`,
            status: `active`,
            subjects: [
                {
                    id: `69d0cfca-4e7d-408b-96cc-53814b7a45d2`,
                    name: `My second subject`,
                    status: `active`,
                },
            ],
        },
        {
            id: `c1887918-0cb6-46f7-a8a9-80d4324c1147`,
            name: `My Third Program`,
            status: `active`,
            subjects: [
                {
                    id: `c85a80ab-0e57-48f1-8b2d-280c8f79c664`,
                    name: `My third subject`,
                    status: `active`,
                },
            ],
        },
        {
            id: `b39edb9a-ab91-4245-94a4-eb2b5007c033`,
            name: `Bada Genius`,
            status: `active`,
            subjects: [
                {
                    id: `66a453b0-d38f-472e-b055-7a94a94d66c4`,
                    name: `Language/Literacy`,
                    status: `active`,
                },
            ],
        },
    ],
    subjects: [
        {
            id: `69d0cfca-4e7d-408b-96cc-53814b7a45d2`,
            name: `My second subject`,
            status: `active`,
        },
        {
            id: `c85a80ab-0e57-48f1-8b2d-280c8f79c664`,
            name: `My third subject`,
            status: `active`,
        },
        {
            id: `66a453b0-d38f-472e-b055-7a94a94d66c4`,
            name: `Language/Literacy`,
            status: `active`,
        },
    ],
    grades: [
        {
            id: `a2f468d0-dd09-426a-8d33-009aa5dc6674`,
            name: `My second Grade`,
            status: `active`,
        },
        {
            id: `e81e245c-336a-4138-b57d-2bef03c3b1cb`,
            name: `My third Grade`,
            status: `active`,
        },
        {
            id: `98461ca1-06a1-432a-97d0-4e1dff33e1a5`,
            name: `None Specified`,
            status: `active`,
        },
    ],
    students: [],
    teachers: [
        {
            user_id: `5509ea94-ed32-537d-a8db-051d8fd5e897`,
            given_name: `Custom Teacher`,
            membership: {
                status: `active`,
            },
        },
    ],
};
const classB: Class = {
    class_id: `e92b3f2e-7792-4039-b3ad-89077a9824ec`,
    class_name: `Class Custom Teacher 2`,
    status: `active`,
    schools: [
        {
            school_id: `2b15bed3-d371-4837-bd4d-4b40068c7c51`,
            school_name: `BTS University`,
        },
        {
            school_id: `6c1523f8-43f2-4816-8036-93bf29da1018`,
            school_name: `San Javier University`,
        },
        {
            school_id: `61e2e4d8-54ee-4499-8251-fb6795016da6`,
            school_name: `School with code`,
        },
        {
            school_id: `ef37c995-c7c1-42f5-8c0d-9bb0a91cd6ec`,
            school_name: `School for CSV`,
        },
        {
            school_id: `596cf57e-4365-40fd-94f8-6f080fc761dc`,
            school_name: `School Unique`,
        },
        {
            school_id: `44869cf9-4b27-4225-83a5-b119682a5ac7`,
            school_name: `School Unique 2`,
        },
        {
            school_id: `ef3f3132-16a2-411e-9b1b-9d71b252ddad`,
            school_name: `School Unique 3`,
        },
    ],
    age_ranges: [
        {
            id: `48ae4957-fd81-469c-a032-5f08459efcd6`,
            name: `Age Range 1`,
            high_value: 8,
            high_value_unit: `month`,
            low_value: 1,
            low_value_unit: `month`,
            status: `active`,
            system: false,
        },
        {
            id: `fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
            name: `5 - 6 year(s)`,
            high_value: 6,
            high_value_unit: `year`,
            low_value: 5,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `4cb0ad2f-2c4a-4120-a9d4-7c874bda717a`,
            name: `Age Range 3`,
            high_value: 10,
            high_value_unit: `month`,
            low_value: 2,
            low_value_unit: `month`,
            status: `active`,
            system: false,
        },
        {
            id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
            name: `3 - 4 year(s)`,
            high_value: 4,
            high_value_unit: `year`,
            low_value: 3,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `bb7982cd-020f-4e1a-93fc-4a6874917f07`,
            name: `4 - 5 year(s)`,
            high_value: 5,
            high_value_unit: `year`,
            low_value: 4,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
    ],
    programs: [
        {
            id: `0a54c6b4-b051-4503-a4fd-f7b8b4f88aa6`,
            name: `My Second Program`,
            status: `active`,
            subjects: [
                {
                    id: `69d0cfca-4e7d-408b-96cc-53814b7a45d2`,
                    name: `My second subject`,
                    status: `active`,
                },
            ],
        },
        {
            id: `c1887918-0cb6-46f7-a8a9-80d4324c1147`,
            name: `My Third Program`,
            status: `active`,
            subjects: [
                {
                    id: `c85a80ab-0e57-48f1-8b2d-280c8f79c664`,
                    name: `My third subject`,
                    status: `active`,
                },
            ],
        },
        {
            id: `b39edb9a-ab91-4245-94a4-eb2b5007c033`,
            name: `Bada Genius`,
            status: `active`,
            subjects: [
                {
                    id: `66a453b0-d38f-472e-b055-7a94a94d66c4`,
                    name: `Language/Literacy`,
                    status: `active`,
                },
            ],
        },
    ],
    subjects: [
        {
            id: `69d0cfca-4e7d-408b-96cc-53814b7a45d2`,
            name: `My second subject`,
            status: `active`,
        },
        {
            id: `c85a80ab-0e57-48f1-8b2d-280c8f79c664`,
            name: `My third subject`,
            status: `active`,
        },
        {
            id: `66a453b0-d38f-472e-b055-7a94a94d66c4`,
            name: `Language/Literacy`,
            status: `active`,
        },
    ],
    grades: [
        {
            id: `a2f468d0-dd09-426a-8d33-009aa5dc6674`,
            name: `My second Grade`,
            status: `active`,
        },
        {
            id: `e81e245c-336a-4138-b57d-2bef03c3b1cb`,
            name: `My third Grade`,
            status: `active`,
        },
        {
            id: `98461ca1-06a1-432a-97d0-4e1dff33e1a5`,
            name: `None Specified`,
            status: `active`,
        },
    ],
    students: [],
    teachers: [
        {
            user_id: `437b864a-6662-5bcc-8403-182fab2317c8`,
            given_name: `Custom Teacher`,
            membership: {
                status: `active`,
            },
        },
    ],
};
const classC: Class = {
    class_id: `a210ecae-11e7-4f7e-aed6-9217e834f419`,
    class_name: `csv Class 3`,
    status: `active`,
    schools: [
        {
            school_id: `ef37c995-c7c1-42f5-8c0d-9bb0a91cd6ec`,
            school_name: `School for CSV`,
        },
    ],
    age_ranges: [],
    programs: [
        {
            id: `b39edb9a-ab91-4245-94a4-eb2b5007c033`,
            name: `Bada Genius`,
            status: `active`,
            subjects: [
                {
                    id: `66a453b0-d38f-472e-b055-7a94a94d66c4`,
                    name: `Language/Literacy`,
                    status: `active`,
                },
            ],
        },
    ],
    subjects: [],
    grades: [],
    students: [],
    teachers: [],
};

const classD: Class = {
    class_id: `a8b802f6-e29e-4eb7-8dc7-798012d7b8e4`,
    class_name: `csv Class 4`,
    status: `active`,
    schools: [
        {
            school_id: `ef37c995-c7c1-42f5-8c0d-9bb0a91cd6ec`,
            school_name: `School for CSV`,
        },
    ],
    age_ranges: [],
    programs: [
        {
            id: `b39edb9a-ab91-4245-94a4-eb2b5007c033`,
            name: `Bada Genius`,
            status: `active`,
            subjects: [
                {
                    id: `66a453b0-d38f-472e-b055-7a94a94d66c4`,
                    name: `Language/Literacy`,
                    status: `active`,
                },
            ],
        },
    ],
    subjects: [],
    grades: [],
    students: [],
    teachers: [],
};

const schoolClasses: Class[] = [
    classA,
    classB,
    classC,
    classD,
];

test(`should create an array of objects that conforms the Classes Table ClassRow interface`, () => {
    const rows = schoolClasses.filter(isActive).map(organizationClasses);

    const final = [
        {
            id: `fe8d14d5-2ef0-4dd2-bf72-8dc3cfce9ff8`,
            name: `Class for Roberto`,
            schoolNames: [
                `BTS University`,
                `San Javier University`,
                `School with code`,
                `School for CSV`,
                `School Unique`,
                `School Unique 2`,
                `School Unique 3`,
            ],
            programs: [
                `My Second Program`,
                `My Third Program`,
                `Bada Genius`,
            ],
            subjects: [
                `My second subject`,
                `My third subject`,
                `Language/Literacy`,
            ],
            grades: [
                `My second Grade`,
                `My third Grade`,
                `None Specified`,
            ],
            ageRanges: [
                `1 - 8 Month(s)`,
                `5 - 6 Year(s)`,
                `2 - 10 Month(s)`,
                `3 - 4 Year(s)`,
                `4 - 5 Year(s)`,
            ],
            students: [],
            teachers: [ `Custom Teacher` ],
            status: `active`,
            programSubjects: [
                {
                    programName: `My Second Program`,
                    subjects: [
                        {
                            id: `69d0cfca-4e7d-408b-96cc-53814b7a45d2`,
                            name: `My second subject`,
                            status: `active`,
                        },
                    ],
                },
                {
                    programName: `My Third Program`,
                    subjects: [
                        {
                            id: `c85a80ab-0e57-48f1-8b2d-280c8f79c664`,
                            name: `My third subject`,
                            status: `active`,
                        },
                    ],
                },
                {
                    programName: `Bada Genius`,
                    subjects: [
                        {
                            id: `66a453b0-d38f-472e-b055-7a94a94d66c4`,
                            name: `Language/Literacy`,
                            status: `active`,
                        },
                    ],
                },
            ],
        },
        {
            id: `e92b3f2e-7792-4039-b3ad-89077a9824ec`,
            name: `Class Custom Teacher 2`,
            schoolNames: [
                `BTS University`,
                `San Javier University`,
                `School with code`,
                `School for CSV`,
                `School Unique`,
                `School Unique 2`,
                `School Unique 3`,
            ],
            programs: [
                `My Second Program`,
                `My Third Program`,
                `Bada Genius`,
            ],
            subjects: [
                `My second subject`,
                `My third subject`,
                `Language/Literacy`,
            ],
            grades: [
                `My second Grade`,
                `My third Grade`,
                `None Specified`,
            ],
            ageRanges: [
                `1 - 8 Month(s)`,
                `5 - 6 Year(s)`,
                `2 - 10 Month(s)`,
                `3 - 4 Year(s)`,
                `4 - 5 Year(s)`,
            ],
            students: [],
            teachers: [ `Custom Teacher` ],
            status: `active`,
            programSubjects: [
                {
                    programName: `My Second Program`,
                    subjects: [
                        {
                            id: `69d0cfca-4e7d-408b-96cc-53814b7a45d2`,
                            name: `My second subject`,
                            status: `active`,
                        },
                    ],
                },
                {
                    programName: `My Third Program`,
                    subjects: [
                        {
                            id: `c85a80ab-0e57-48f1-8b2d-280c8f79c664`,
                            name: `My third subject`,
                            status: `active`,
                        },
                    ],
                },
                {
                    programName: `Bada Genius`,
                    subjects: [
                        {
                            id: `66a453b0-d38f-472e-b055-7a94a94d66c4`,
                            name: `Language/Literacy`,
                            status: `active`,
                        },
                    ],
                },
            ],
        },
        {
            id: `a210ecae-11e7-4f7e-aed6-9217e834f419`,
            name: `csv Class 3`,
            schoolNames: [ `School for CSV` ],
            programs: [ `Bada Genius` ],
            subjects: [],
            grades: [],
            ageRanges: [],
            students: [],
            teachers: [],
            status: `active`,
            programSubjects: [
                {
                    programName: `Bada Genius`,
                    subjects: [
                        {
                            id: `66a453b0-d38f-472e-b055-7a94a94d66c4`,
                            name: `Language/Literacy`,
                            status: `active`,
                        },
                    ],
                },
            ],
        },
        {
            id: `a8b802f6-e29e-4eb7-8dc7-798012d7b8e4`,
            name: `csv Class 4`,
            schoolNames: [ `School for CSV` ],
            programs: [ `Bada Genius` ],
            subjects: [],
            grades: [],
            ageRanges: [],
            students: [],
            teachers: [],
            status: `active`,
            programSubjects: [
                {
                    programName: `Bada Genius`,
                    subjects: [
                        {
                            id: `66a453b0-d38f-472e-b055-7a94a94d66c4`,
                            name: `Language/Literacy`,
                            status: `active`,
                        },
                    ],
                },
            ],
        },
    ];
    expect(rows).toEqual(final);
});

test(`should return an empty array`, () => {
    const rows = [].filter(isActive).map(organizationClasses);

    expect(rows).toEqual([]);
});
