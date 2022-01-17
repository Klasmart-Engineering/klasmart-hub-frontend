import { PaginationFilter } from "./pagination";
import { ProgramFilter } from "@/api/programs";
import { Status } from "@/types/graphQL";

export const buildProgramIdFilter = (programIds: string[]): PaginationFilter<ProgramFilter> => {
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
                OR: values as ProgramFilter[],
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
