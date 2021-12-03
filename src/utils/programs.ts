import {
    buildAgeRangeLabel,
    mapAgeRangeNodeToAgeRange,
} from "./ageRanges";
import {
    ProgramEdge,
    ProgramNode,
} from "@/api/programs";
import { ProgramRow } from "@/components/Program/Table";
import {
    Program,
    School,
    Status,
} from "@/types/graphQL";
import { isEqual } from "lodash";

export const buildEmptyProgram = (): ProgramNode => ({
    id: ``,
    name: ``,
    ageRanges: [],
    grades: [],
    subjects: [],
    status: Status.ACTIVE,
    system: false,
});

export const mapProgramsFromSchools = (allSchools: School[], schoolIds: string[]): Program[] => {
    const programs = allSchools.filter(school => schoolIds.includes(school.school_id) && school.programs?.length)
        .flatMap(school => school.programs)
        .filter((program, i, array) => (i === array.findIndex(foundFilter => isEqual(foundFilter, program))));

    return programs as Program[] ?? [];
};

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

export const mapProgramEdgesToFilterValues = (programEdges: ProgramEdge[]) => (
    programEdges.filter((edge) => edge.node.status === Status.ACTIVE).map((edge) => ({
        label: edge.node.name,
        value: edge.node.id,
    }))
);
