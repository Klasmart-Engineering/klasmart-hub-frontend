import { gql } from "@apollo/client";

export const SET_ORGANIZATION_BRANDING = gql`
    mutation setOrganizationBranding(
        $organizationId: ID!
        $organizationLogo: Upload
        $primaryColor: HexColor
    ) {
        setBranding(
            organizationId: $organizationId
            iconImage: $organizationLogo
            primaryColor: $primaryColor
        ) {
            iconImageURL
            primaryColor
        }
    }
`;
