import {
    SubjectEdge,
    SubjectNode,
} from "@/api/subjects";
import { SubjectRow } from "@/components/Subject/Table";
import {
    Program,
    Status,
    Subject,
} from "@/types/graphQL";
import {
    clone,
    isEqual,
    pickBy,
} from "lodash";

export const buildEmptySubject = (subject?: Subject): Subject => pickBy({
    id: subject?.id,
    name: subject?.name,
    categories: clone(subject?.categories ?? []),
    status: subject?.status ?? Status.ACTIVE,
    system: subject?.system ?? false,
}, (value) => value !== undefined);

export const mapSubjectsToFilterValueOptions = (subjects: Subject[]) => (
    subjects.map(subject => ({
        value: subject.id ?? ``,
        label: subject.name ?? ``,
    }))
);

export const mapSubjectEdgesToFilterValueOptions = (subjects: SubjectEdge[]) => (
    subjects.map(subject => ({
        value: subject.node.id ?? ``,
        label: subject.node.name ?? ``,
    }))
);

export const mapSubjectsFromPrograms = (programs: Program[]): Subject[] => {
    const subjects = programs.filter(program => program.subjects?.length).flatMap(program => program.subjects)
        .filter((subject, i, array) => (i === array.findIndex(foundFilter => isEqual(foundFilter, subject))));

    return subjects as Subject[] ?? [];
};

export const mapSubjectNodeToSubjectRow = (node: SubjectNode): SubjectRow => ({
    id: node.id,
    name: node.name,
    system: node.system,
    categories: node.categories.map((category) => category.name ?? ``),
});
