import { gql } from "@apollo/client";

export const DELETE_ORGANIZATION_BRANDING_IMAGE = gql`
mutation deleteOrganizationBrandingImage($organizationId: ID!) {
    deleteBrandingImage(organizationId: $organizationId, type: ICON)
}`;
