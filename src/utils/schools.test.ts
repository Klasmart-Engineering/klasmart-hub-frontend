import {
    buildEmptySchool,
    mapSchoolNodeToSchoolRow,
    mapSchoolNodeToSchoolStepper,
    sortSchoolNames,
} from "./schools";
import { SchoolNode } from "@/api/schools";
import { SchoolStepper } from "@/components/School/Dialog/Steps/shared";
import { SchoolRow } from "@/components/School/Table";
import { Status } from "@/types/graphQL";
import { schoolB } from "@tests/mocks/mockSchools";
import { AcademicTermA, AcademicTermB } from "@tests/mockAcademicTerms";

describe(`schools utilities functions`, () => {

    test(`buildEmptySchool`, () => {
        const newEmptySchool = buildEmptySchool();
        const emptySchool = {
            school_id: ``,
            school_name: ``,
            classes: [],
            memberships: undefined,
            programs: undefined,
            shortcode: undefined,
            status: undefined,
        };
        expect(newEmptySchool)
            .toStrictEqual(emptySchool);
    });

    test(`buildEmptySchool with existing school`, () => {
        const copiedSchool = buildEmptySchool(schoolB);
        const school = {
            school_id: `b3ce8cc0-616b-43cc-b4a8-adae9b5c6940`,
            school_name: `Unam University`,
            classes: [],
            memberships: undefined,
            programs: [],
            shortcode: null,
            status: Status.INACTIVE,
        };
        expect(copiedSchool)
            .toStrictEqual(school);
    });

    test(`mapSchoolNodeToSchool`, () => {
        const schoolNode: SchoolNode = {
            id: `8850c355-84eb-4244-b7f3-cd4aa1f85973`,
            name: `awdawd`,
            status: Status.ACTIVE,
            shortCode: `4L5QHEV0NO`,
        };
        const school: SchoolStepper = {
            id: `8850c355-84eb-4244-b7f3-cd4aa1f85973`,
            name: `awdawd`,
            status: Status.ACTIVE,
            shortcode: `4L5QHEV0NO`,
            programIds: [],
        };
        expect(mapSchoolNodeToSchoolStepper(schoolNode))
            .toStrictEqual(school);
    });

    test(`mapSchoolNodeToSchoolRow`, () => {
        const schoolNode: SchoolNode = {
            id: `8850c355-84eb-4244-b7f3-cd4aa1f85973`,
            name: `awdawd`,
            status: Status.ACTIVE,
            shortCode: `4L5QHEV0NO`,
            academicTermsConnection: {
                edges: [
                    AcademicTermA,
                    AcademicTermB
                ],
            },
        };
        const school: SchoolRow = {
            id: `8850c355-84eb-4244-b7f3-cd4aa1f85973`,
            name: `awdawd`,
            status: Status.ACTIVE,
            shortCode: `4L5QHEV0NO`,
            academicTermNames: [ `Term 1`, `Term 2` ],
        };
        expect(mapSchoolNodeToSchoolRow(schoolNode))
            .toStrictEqual(school);
    });

    test(`sort English school names`, () => {
        const schoolNames = [
            `School 1`,
            `School 3`,
            `School 2`,
        ].sort(sortSchoolNames);
        const sortedSchoolNames = [
            `School 1`,
            `School 2`,
            `School 3`,
        ];
        expect(schoolNames)
            .toStrictEqual(sortedSchoolNames);
    });

    test(`sort Vietnamese school names`, () => {
        const schoolNames = [
            `đại học`,
            `Trường Đại học`,
            `Đại học`,
        ].sort((a, b) => sortSchoolNames(a, b, `vn`, {
            caseFirst: `upper`,
        }));
        const sortedSchoolNames = [
            `Đại học`,
            `đại học`,
            `Trường Đại học`,
        ];
        expect(schoolNames)
            .toStrictEqual(sortedSchoolNames);
    });
});
