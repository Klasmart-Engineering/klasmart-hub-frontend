import {
    buildAgeRangeLabel,
    mapAgeRangeNodeToAgeRange,
} from "./ageRanges";
import { ProgramNode } from "@/api/programs";
import { ProgramRow } from "@/components/Program/Table";
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
    grades: program.grades?.map((grade) => grade.name).filter((name): name is string => !!name) ?? [],
    subjects: program.subjects?.map((subject) => subject.name).filter((name): name is string => !!name) ?? [],
    system: program.system ?? false,
});

export const mapProgramNodeToProgramRow = (node: ProgramNode): ProgramRow => ({
    id: node.id,
    name: node.name,
    system: node.system,
    ageRanges: node.ageRanges?.map(mapAgeRangeNodeToAgeRange).map((ageRange) => buildAgeRangeLabel(ageRange)) ?? [],
    grades: node.grades.map((grade) => grade.name ?? ``),
    subjects: node.subjects.map((subject) => subject.name ?? ``),
});
