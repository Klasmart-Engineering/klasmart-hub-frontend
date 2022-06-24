import { gql } from "@apollo/client";

export const CREATE_CLASS = gql`
    mutation addClass($organizationId: ID!, $name: String!, $shortcode: String) {
        createClasses(
            input: [
                { organizationId: $organizationId, name: $name, shortcode: $shortcode }
            ]
        ) {
            classes {
                name
                id
                shortCode
            }
        }
    }
`;
