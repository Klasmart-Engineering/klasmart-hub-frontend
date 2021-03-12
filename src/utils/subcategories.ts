import {
    Status,
    Subcategory,
} from "@/types/graphQL";
import { pickBy } from "lodash";

export const buildNewSubcategory = (subcategory?: Subcategory): Subcategory => pickBy({
    id: subcategory?.id,
    name: subcategory?.name ?? ``,
    status: subcategory?.status ?? Status.ACTIVE,
    system: subcategory?.system ?? false,
}, (value) => value !== undefined)
;
