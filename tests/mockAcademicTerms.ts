import { AcademicTermNode } from "@/api/academicTerms";
import { Status } from "@/types/graphQL";

export const AcademicTermA: { node: AcademicTermNode } = {
    node: {
        id: `c01fb4b8-f916-4ab1-ad89-6ff31e8b6cc5`,
        name: `Term 1`,
        startDate: `2022-01-21T00:00:00.000Z`,
        endDate: `2022-05-22T23:59:59.000Z`,
        status: Status.ACTIVE,
    },
};

export const AcademicTermB: { node: AcademicTermNode } = {
    node: {
        id: `e30df508-1d77-4c69-99fd-5f4db3ddcd9b`,
        name: `Term 2`,
        startDate: `2022-01-12T00:00:00.000Z`,
        endDate: `2022-03-22T23:59:59.000Z`,
        status: Status.ACTIVE,
    },
};

export const AcademicTermC: { node: AcademicTermNode } = {
    node: {
        id: `dc2e77cf-dbbe-4e63-a527-3567bbb59e68`,
        name: `Term 3`,
        startDate: `2022-05-02T00:00:00.000Z`,
        endDate: `2022-08-22T23:59:59.000Z`,
        status: Status.ACTIVE,
    },
};
