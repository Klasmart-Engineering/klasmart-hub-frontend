import { ClassDetails } from "@/components/Class/Table";
import { Class } from "@/types/graphQL";

export const buildEmptyClass = (): Class => ({
    class_id: ``,
    class_name: ``,
    schools: [],
    status: ``,
    programs: [],
    subjects: [],
    grades: [],
    age_ranges: [],
});

export const buildEmptyClassDetails = (): ClassDetails => ({
    className: ``,
    programSubjects: [],
    teachers: [],
    students: [],
});
