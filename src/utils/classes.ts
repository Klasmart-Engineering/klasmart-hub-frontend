import {
    buildAgeRangeEdgeLabel,
    buildAgeRangeLabel,
} from "./ageRanges";
import { ClassEdge } from "@/api/classes";
import { ClassForm } from "@/components/Class/Dialog/Form";
import { ClassDetails } from "@/components/Class/Table";
import {
    Class,
    Status,
} from "@/types/graphQL";

export const buildEmptyClass = (): Class => ({
    class_id: ``,
    class_name: ``,
    schools: [],
    status: Status.ACTIVE,
    programs: [],
    subjects: [],
    grades: [],
    age_ranges: [],
});

export const buildEmptyClassForm = (): ClassForm => ({
    id: ``,
    name: ``,
    schools: [],
    status: Status.ACTIVE,
    programs: [],
    subjects: [],
    grades: [],
    ageRanges: [],
});

export const mapClassToForm = (classData: Class): ClassForm => ({
    id: classData.class_id,
    name: classData.class_name ?? ``,
    schools: classData.schools,
    status: Status.ACTIVE,
    programs: classData.programs,
    subjects: classData.subjects?.map(subject => subject.id ?? ``) ?? [],
    grades: classData.grades?.map(grade => grade.id ?? ``) ?? [],
    ageRanges: classData.age_ranges?.map(ageRange => ageRange.id ?? ``) ?? [],
});

export const buildEmptyClassDetails = (): ClassDetails => ({
    className: ``,
    programSubjects: [],
    teachers: [],
    students: [],
});

export const organizationClasses = (classItem: Class) => {
    return {
        id: classItem.class_id,
        name: classItem.class_name ?? ``,
        schoolNames: classItem.schools?.map((school) => school.school_name ?? ``) ?? [],
        programs: classItem.programs?.map((program) => program.name ?? ``) ?? [],
        subjects: classItem.subjects?.map((subject) => subject.name ?? ``) ?? [],
        grades: classItem.grades?.map((grade) => grade.name ?? ``) ?? [],
        ageRanges: classItem.age_ranges?.map(buildAgeRangeLabel) ?? [],
        students:
            classItem.students
                ?.filter((student) => student?.membership?.status === Status.ACTIVE)
                .map((student) => student?.given_name ?? ``) ?? [],
        teachers:
            classItem.teachers
                ?.filter((teacher) => teacher?.membership?.status === Status.ACTIVE)
                .map((teacher) => teacher?.given_name ?? ``) ?? [],
        status: classItem.status ?? ``,
        programSubjects:
            classItem.programs?.map((program) => ({
                programName: program.name ?? ``,
                subjects: program?.subjects ?? [],
            })) ?? [],
    };
};

export const organizationPaginatedClasses = (classItem: ClassEdge) => {
    return {
        id: classItem.node.id,
        name: classItem.node.name ?? ``,
        schoolNames: classItem.node.schools?.map((school) => school.name ?? ``) ?? [],
        programs: classItem.node.programs?.map((program) => program.name ?? ``) ?? [],
        subjects: classItem.node.subjects?.map((subject) => subject.name ?? ``) ?? [],
        grades: classItem.node.grades?.map((grade) => grade.name ?? ``) ?? [],
        ageRanges: classItem.node.ageRanges?.map(buildAgeRangeEdgeLabel) ?? [],
        status: classItem.node.status ?? ``,
    };
};
