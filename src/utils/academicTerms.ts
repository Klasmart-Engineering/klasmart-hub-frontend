import { AcademicTermForm } from "@/components/School/AcademicTerm/Dialog/Form";
import { AcademicTermRow } from "@/components/School/AcademicTerm/Table";

export const buildEmptyAcademicTerm = (): AcademicTermRow => ({
    id: ``,
    termName: ``,
    startDate: ``,
    endDate: ``,
});

export const buildEmptyAcademicTermForm = (): AcademicTermForm => ({
    id: ``,
    termName: ``,
    startDate: ``,
    endDate: ``,
});
