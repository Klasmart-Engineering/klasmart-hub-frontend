import {
    Status,
    Subject,
} from "@/types/graphQL";
import {
    clone,
    pickBy,
} from "lodash";

export const buildEmptySubject = (subject?: Subject): Subject => pickBy({
    id: subject?.id,
    name: subject?.name,
    categories: clone(subject?.categories ?? []),
    status: subject?.status ?? Status.ACTIVE,
    system: subject?.system ?? false,
}, (value) => value !== undefined);
