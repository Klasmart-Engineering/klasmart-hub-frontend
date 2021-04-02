import {
    Grade,
    Status,
} from "@/types/graphQL";
import { pickBy } from "lodash";

export const buildEmptyGrade = (grade?: Grade): Grade => pickBy<Grade>({
    id: grade?.id,
    name: grade?.name,
    status: grade?.status ?? Status.ACTIVE,
    system: grade?.system ?? false,
    progress_from_grade: grade?.progress_from_grade,
    progress_to_grade: grade?.progress_to_grade,
}, (value) => value !== undefined);
