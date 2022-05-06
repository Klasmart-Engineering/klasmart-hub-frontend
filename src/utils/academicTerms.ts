import {
    AcademicTermEdge,
    AcademicTermNode,
} from "@/api/academicTerms";
import { AcademicTermForm } from "@/components/School/AcademicTerm/Dialog/Form";
import { AcademicTermRow } from "@/components/School/AcademicTerm/Table";
import { Status } from "@/types/graphQL";
import { IntlShape } from "react-intl";

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

export const mapAcademicTermEdgesToFilterValues = (schoolEdges: AcademicTermEdge[], intl: IntlShape) => (
    schoolEdges.filter((edge) => edge.node.status === Status.ACTIVE)
        .map((edge) => ({
            label: edge.node.name,
            value: edge.node.id,
        }))
        .concat({
            label: intl.formatMessage({
                id: `groups_none`,
                defaultMessage: `None`,
            }),
            value: ``,
        })
);
