import { ProgramEdge } from "@/api/programs";
import { Status } from "@/types/graphQL";

export const buildEmptyProgram = (): ProgramEdge => ({
    node: {
        id: ``,
        name: ``,
        ageRanges: [],
        grades: [],
        subjects: [],
        status: Status.ACTIVE,
        system: false,
    },
});
