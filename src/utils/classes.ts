import { Class } from "@/types/graphQL";

export const buildEmptyClass = (): Class => ({
    class_id: "",
    class_name: "",
    schools: [],
    status: "",
});
