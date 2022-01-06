import { PaginationFilter } from "./pagination";
import { SubjectFilter } from "@/api/subjects";
import { Status } from "@/types/graphQL";

export const buildProgramIdFilter = (programIds: string[]): PaginationFilter<SubjectFilter> => {
    const values = programIds.map((value) => {
        const programIdFilter = {
            programId: {
                operator: `eq`,
                value,
            },
        };
        return programIdFilter;
    });

    return {
        AND: [
            {
                OR: values as SubjectFilter[],
            },
            {
                status: {
                    operator: `eq`,
                    value: Status.ACTIVE,
                },
            },
        ],
    };
};
