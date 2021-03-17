import {
    Program,
    Status,
} from "@/types/graphQL";

export const buildEmptyProgram = (): Program => ({
    id: ``,
    name: ``,
    age_ranges: [],
    grades: [],
    subjects: [],
    status: Status.ACTIVE,
    system: false,
});
