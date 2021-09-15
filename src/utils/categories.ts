import {
    Category,
    Status,
} from "@/types/graphQL";
import {
    clone,
    pickBy,
} from "lodash";

export const buildEmptyCategory = (category?: Category): Category => pickBy({
    id: category?.id,
    name: category?.name ?? ``,
    subcategories: clone(category?.subcategories ?? []),
    status: category?.status ?? Status.ACTIVE,
    system: category?.system ?? false,
}, (value) => value !== undefined)
;

export const mapCategoriesToFilterOptions = (categories: Category[]) =>
    categories.map((category) => ({
        value: category.id ?? ``,
        label: category.name ?? ``,
    })).sort((a, b) => a.label.localeCompare(b.label));
