import { mapAgeRangeEdgesToAgeRanges } from "./ageRanges";
import { ProgramEdge } from "@/api/programs";
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

export const mapProgramEdgesToPrograms = (data: ProgramEdge[]): Program[] => {
    const mapped = data.map((edge) => ({
        id: edge.node.id,
        name: edge.node.name,
        status: edge.node.status,
        system: edge.node.system,
        age_ranges: mapAgeRangeEdgesToAgeRanges(edge.node.ageRanges ?? []),
        grades: edge.node.grades,
        subjects: edge.node.subjects,
    }));

    return mapped ?? [];
};

export const mapSelectedProgramIds = (programs: Program[]): string[] => (
    programs.filter((program) => program.status === Status.ACTIVE && program.id)
        .map((program) => program.id)
        .filter((id): id is string => !!id)
);
