import {
    buildAgeRangeLabel,
    mapAgeRangeNodeToAgeRange,
} from "./ageRanges";
import { mapNodeToIdString } from "./classFormSelectedValues";
import {
    ProgramEdge,
    ProgramForm,
    ProgramNode,
} from "@/api/programs";
import { ProgramRow } from "@/components/Program/Table";
import {
    isActive,
    Program,
    Status,
} from "@/types/graphQL";

export const buildEmptyProgram = (): ProgramForm => ({
    id: ``,
    name: ``,
    ageRanges: [],
    grades: [],
    subjects: [],
});

export const mapProgramNodeToProgramForm = (node: ProgramNode): ProgramForm => ({
    id: node.id,
    name: node.name,
    ageRanges: node.ageRanges?.map(mapNodeToIdString) ?? [],
    grades: node.grades?.map(mapNodeToIdString) ?? [],
    subjects: node.subjects?.map(mapNodeToIdString) ?? [],
});

export const mapProgramNodeToProgram = (node: ProgramNode): Program => ({
    id: node.id,
    name: node.name,
    status: node.status,
    system: node.system,
    age_ranges: node.ageRanges?.map(mapAgeRangeNodeToAgeRange) ?? [],
    grades: node.grades,
    subjects: node.subjects,
});

export const mapProgramToProgramRow = (program: Program): ProgramRow => ({
    id: program.id ?? ``,
    name: program.name ?? ``,
    ageRanges: program.age_ranges?.map(buildAgeRangeLabel) ?? [],
    grades: program.grades?.map((grade) => grade.name)
        .filter((name): name is string => !!name) ?? [],
    subjects: program.subjects?.map((subject) => subject.name)
        .filter((name): name is string => !!name) ?? [],
    system: program.system ?? false,
});

export const mapProgramNodeToProgramRow = (node: ProgramNode): ProgramRow => ({
    id: node.id,
    name: node.name,
    system: node.system,
    ageRanges: node.ageRanges?.filter(isActive)
        ?.map(mapAgeRangeNodeToAgeRange)
        .map((ageRange) => buildAgeRangeLabel(ageRange)) ?? [],
    grades: node.grades?.filter(isActive)
        ?.map((grade) => grade.name ?? ``)
         ?? [],
    subjects: node.subjects?.filter(isActive)
        ?.map((subject) => subject.name ?? ``) ?? [],
});

export const mapProgramEdgesToFilterValues = (programEdges: ProgramEdge[]) => (
    programEdges.filter((edge) => edge.node.status === Status.ACTIVE)
        .map((edge) => ({
            label: edge.node.name,
            value: edge.node.id,
        }))
);
