import { User } from "@/types/graphQL";

export const buildEmptyUser = (): User => ({
    user_id: "",
});
