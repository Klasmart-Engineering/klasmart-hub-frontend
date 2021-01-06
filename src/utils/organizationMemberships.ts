import { OrganizationMembership } from "@/types/graphQL";

export const buildEmptyOrganizationMembership = (): OrganizationMembership => ({
    organization_id: "",
    user_id: "",
});
