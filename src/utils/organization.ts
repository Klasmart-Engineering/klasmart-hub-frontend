import { Organization } from "@/types/graphQL";

export const buildEmptyOrganization = (): Organization => ({
    organization_id: ``,
    organization_name: ``,
    phone: ``,
    shortCode: ``,
    address1: ``,
    address2: ``,
    organizationLogo: ``,
    color: ``,
});
