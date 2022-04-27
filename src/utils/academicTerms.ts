import { AcademicTermNode } from "@/api/academicTerms";
import { AcademicTermForm } from "@/components/School/AcademicTerm/Dialog/Form";
import { AcademicTermRow } from "@/components/School/AcademicTerm/Table";

export const buildEmptyAcademicTerm = (): AcademicTermRow => ({
    id: ``,
    name: ``,
    startDate: ``,
    endDate: ``,
});

export const buildEmptyAcademicTermForm = (): AcademicTermForm => ({
    name: ``,
    startDate: ``,
    endDate: ``,
});

export const mapAcademicTermNodeToAcademicTermRow = (node: AcademicTermNode): AcademicTermRow => ({
    id: node.id,
    name: node.name,
    startDate: node.startDate,
    endDate: node.endDate,
    status: node.status,
});
