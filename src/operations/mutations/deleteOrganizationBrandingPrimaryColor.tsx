
import { gql } from "@apollo/client";

export const DELETE_ORGANIZATION_BRANDING_PRIMARY_COLOR = gql`
mutation deleteOrganizationBrandingImage($organizationId: ID!) {
    deleteBrandingColor(organizationId: $organizationId)
}`;
