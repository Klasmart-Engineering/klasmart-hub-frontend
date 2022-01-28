import {
    AddBox,
    ArrowDownward,
    Check,
    ChevronLeft,
    ChevronRight,
    Clear,
    DeleteOutline,
    Edit,
    FilterList,
    FirstPage,
    LastPage,
    SaveAlt,
    Search,
} from "@material-ui/icons";
import React,
{ forwardRef } from "react";

export const constantValues = {
    menuLabel: [
        {
            name: `View Org`,
            path: `/allOrganization`,
            id: `header_viewOrg`,
        },
        {
            name: `View Users`,
            path: `/user`,
            id: `header_viewUsers`,
        },
        {
            name: `View Roles`,
            path: `/roles`,
            id: `header_viewGroups`,
        },
        {
            name: `View Schools`,
            path: `/school`,
            id: `header_viewSchools`,
        },
        {
            name: `Classes`,
            path: `/classes`,
            id: `header_classes`,
        },
        {
            name: `Programs`,
            path: `/programs`,
            id: `header_programs`,
        },
        {
            name: `Grades`,
            path: `/grades`,
            id: `header_grades`,
        },
    ],
    groupData: [
        {
            id: `Seed Admin`,
            name: `Seed Admin`,
        },
        {
            id: `Admin`,
            name: `Admin`,
        },
        {
            id: `Teacher`,
            name: `Teacher`,
        },
        {
            id: `Student`,
            name: `Student`,
        },
        {
            id: `Parent`,
            name: `Parent`,
        },
    ],
    joinedOrganizationData: [
        {
            name: `Calm Island`,
            phone: `01055551234`,
            role: `admin`,
            email: `admin@email.com`,
            status: 1,
        },
        {
            name: `Calm Island Vietnam`,
            phone: `01055551234`,
            role: `parent`,
            email: `parent@email.com`,
            status: 0,
        },
    ],
    emailValidation: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    tableIcons: {
        Add: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <AddBox
                {...props}
                ref={ref} />
        )),
        Check: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <Check
                {...props}
                ref={ref} />
        )),
        Clear: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <Clear
                {...props}
                ref={ref} />
        )),
        Delete: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <DeleteOutline
                {...props}
                ref={ref} />
        )),
        DetailPanel: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <ChevronRight
                {...props}
                ref={ref} />
        )),
        Edit: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <Edit
                {...props}
                ref={ref} />
        )),
        Export: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <SaveAlt
                {...props}
                ref={ref} />
        )),
        Filter: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <FilterList
                {...props}
                ref={ref} />
        )),
        FirstPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <FirstPage
                {...props}
                ref={ref} />
        )),
        LastPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <LastPage
                {...props}
                ref={ref} />
        )),
        NextPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <ChevronRight
                {...props}
                ref={ref} />
        )),
        PreviousPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <ChevronLeft
                {...props}
                ref={ref} />
        )),
        ResetSearch: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <Clear
                {...props}
                ref={ref} />
        )),
        Search: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <Search
                {...props}
                ref={ref} />
        )),
        SortArrow: forwardRef((props, ref: React.Ref<SVGSVGElement>) => (
            <ArrowDownward
                {...props}
                ref={ref} />
        )),
    },
    userNamesData: [
        {
            id: `0f69eeb2-5b1a-4407-94b1-7451fd59f4f6`,
            name: `Patrizius Fellows`,
        },
        {
            id: `432f97f7-05be-4570-8a5f-0d85890260a4`,
            name: `Rodrigo Beynon`,
        },
        {
            id: `19c48374-eb32-47be-b13c-485b17d3c405`,
            name: `Aubine Brunger`,
        },
        {
            id: `c51db803-7f11-416b-a008-127e3dea563a`,
            name: `Mickie Radloff`,
        },
        {
            id: `de0382df-53aa-4bf7-ac4a-bef89d5ddd89`,
            name: `Charlotte Yukhnini`,
        },
        {
            id: `7b9bab5b-ec27-4e38-8246-a0a0315f911c`,
            name: `Lorain Zorener`,
        },
        {
            id: `a2053eee-b354-4d41-bddb-80cf895f24cd`,
            name: `Valera Arnull`,
        },
        {
            id: `1f416bca-046e-45a6-a93a-191118f26a39`,
            name: `Eveleen Barsham`,
        },
        {
            id: `87765f09-dc02-448f-83f9-447d74efdfff`,
            name: `Aile McElvogue`,
        },
        {
            id: `cc11888d-546a-4595-a91e-b6a815bf6be5`,
            name: `Evey Blenkhorn`,
        },
    ],
    alphanumericValidation: /^([a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝ0-9\u3131-\uD79D _.'-]+)$/,
    nameAndGroupValidation: /^([a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝ0-9\u3131-\uD79D _-]+)$/,
    alphanumericNameOrganization: /^([a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝ0-9\u3131-\uD79D &/.(),:@_#'"-]+)$/,
    alphanumericAddressValidation: /^([a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝ0-9\u3131-\uD79D #&-/().,;:'°]+)$/,
    colorDefaultPicker: `#fff`,
    dateValidation: /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/,
    addressValidation: /^([a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝ0-9 #.,;:'°&()-]+)$/,
    gradesData: [
        {
            id: `Seekers`,
            name: `Seekers`,
        },
        {
            id: `Pathfinders`,
            name: `Pathfinders`,
        },
        {
            id: `Experimenters`,
            name: `Experimenters`,
        },
    ],
    statusClasses: [
        {
            id: `Active`,
            name: `Active`,
        },
        {
            id: `Inactive`,
            name: `Inactive`,
        },
    ],
    subjectElements: [
        {
            id: `General`,
            name: `General`,
        },
        {
            id: `ESL`,
            name: `ESL`,
        },
        {
            id: `Math`,
            name: `Math`,
        },
    ],
    programElements: [
        {
            id: `Bada Rhyme`,
            name: `Bada Rhyme`,
        },
        {
            id: `Bada Genius`,
            name: `Bada Genius`,
        },
        {
            id: `Bada Math`,
            name: `Bada Math`,
        },
        {
            id: `All`,
            name: `All`,
        },
    ],
    gradeDataDummy: [
        {
            grade: `Seekers`,
            color: `#754725`,
            program: `Bada Genius`,
            progressTo: `Non Specific`,
            age: [
                {
                    type: `months`,
                    value: `10`,
                },
                {
                    type: `ages`,
                    value: `3`,
                },
            ],
        },
    ],
    characteresToRemove: [
        `’`,
        `\``,
        ` `,
        `'`,
        `.`,
        `&`,
        `/`,
        `.`,
        `(`,
        `)`,
        `-`,
        `,`,
        `:`,
        `@`,
        `_`,
        `#`,
        `"`,
    ],
    allSchoolsValue: `All Schools`,
    noSchoolsValue: `No Schools`,
    allGradesValue: `All`,
    noSpecificGradeValue: `Non Specific`,
    noSubjectValue: `General`,
    programUndefinedValue: `Undefined`,
    notSpecificGradeValue: `Not Specific`,
    schoolDefaultValue: `Open/All`,
    rolesNotAllowed: [ `Super Admin`, `Organization Admin` ],
};
