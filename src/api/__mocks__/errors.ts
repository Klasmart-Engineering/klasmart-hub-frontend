import {
    APIErrorCode,
    APIErrorDetails,
    APIErrorMessage,
} from "@/api/errors";
import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";
import { pick } from "lodash";

type MockErrorDetails = Required<Omit<APIErrorDetails, "code" | "message">>;

type APIErrorCodeValue = keyof typeof APIErrorCode;

type MockErrorCollection = {[key in APIErrorCode]?: APIErrorDetails}

const mockDetails: MockErrorDetails = {
    entity: `User`,
    entityName: `Joe Bloggs`,
    organizationName: `Kidsloop Org`,
    variables: [ `given_name` ],
    attribute: `given_name`,
    otherAttribute: `family_name`,
    format: `dd/mm/yyyy`,
    max: `100`,
    min: `-10`,
    parentEntity: `School`,
    parentName: `Badanamu Primary`,
};

const MOCK_ERROR_MESSAGE_PREFIX = `MESSAGE:`;

function buildMockErrors (codes: APIErrorCodeValue[],
    properties?: (keyof MockErrorDetails)[]): MockErrorCollection {
    return Object.fromEntries(codes.map((code) => {
        return [
            code,
            {
                code,
                message: `${MOCK_ERROR_MESSAGE_PREFIX}${code}`,
                variables: mockDetails.variables,
                ...(properties ? pick(mockDetails, properties) : undefined),
            },
        ];
    }));
}

const mockEntityNameErrors = buildMockErrors([ APIErrorCode.ERR_DUPLICATE_ENTITY, APIErrorCode.ERR_NON_EXISTENT_ENTITY ], [ `entity`, `entityName` ]);

const mockAttributeErrors = buildMockErrors([
    APIErrorCode.ERR_INVALID_ALPHABETIC,
    APIErrorCode.ERR_INVALID_ALPHANUMERIC,
    APIErrorCode.ERR_INVALID_ALPHANUMERIC_SPECIAL_CHARACTERS,
    APIErrorCode.ERR_INVALID_EMAIL,
    APIErrorCode.ERR_INVALID_PHONE,
    APIErrorCode.ERR_INVALID_UUID,
    APIErrorCode.ERR_MISSING_REQUIRED_ENTITY_ATTRIBUTE,
], [ `entity`, `attribute` ]);

const mockEitherAttributeErrors = buildMockErrors([ APIErrorCode.ERR_MISSING_REQUIRED_EITHER ], [
    `entity`,
    `attribute`,
    `otherAttribute`,
]);

const mockMinErrors = buildMockErrors([ APIErrorCode.ERR_INVALID_MIN_LENGTH ], [
    `entity`,
    `attribute`,
    `min`,
]);

const mockMaxErrors = buildMockErrors([ APIErrorCode.ERR_INVALID_MAX_LENGTH ], [
    `entity`,
    `attribute`,
    `max`,
]);

const mockFormatErrors = buildMockErrors([ APIErrorCode.ERR_INVALID_DATE ], [
    `entity`,
    `attribute`,
    `format`,
]);

const mockChildErrors = buildMockErrors([ APIErrorCode.ERR_NON_EXISTENT_CHILD_ENTITY, APIErrorCode.ERR_DUPLICATE_CHILD_ENTITY ], [
    `entity`,
    `entityName`,
    `parentEntity`,
    `parentName`,
]);

const mockChildEntityErrors = buildMockErrors([ APIErrorCode.UNAUTHORIZED_UPLOAD_CHILD_ENTITY ], [
    `entity`,
    `parentEntity`,
    `parentName`,
]);

const mockOrganizationErrors = buildMockErrors([ APIErrorCode.UNAUTHORIZED_UPLOAD_TO_ORGANIZATION ], [ `entity`, `organizationName` ]);

const mockGenericErrors = buildMockErrors([ APIErrorCode.UNAUTHORIZED ]);

export const mockErrors: MockErrorCollection = {
    ...mockEntityNameErrors,
    ...mockEitherAttributeErrors,
    ...mockAttributeErrors,
    ...mockFormatErrors,
    ...mockMinErrors,
    ...mockMaxErrors,
    ...mockChildErrors,
    ...mockChildEntityErrors,
    ...mockOrganizationErrors,
    ...mockGenericErrors,
};

function buildMockCSVErrors (errors: MockErrorCollection) {
    return Object.fromEntries(Object.entries(errors).map(([ key, details ]) => {
        const {
            variables,
            ...rest
        } = details;
        return [
            key,
            {
                ...rest,
                row: 1,
                column: variables.join(`, `),
            },
        ];
    }));
}

export const mockCSVErrors = buildMockCSVErrors(mockErrors);

export function throwMockApolloAPIError (errors: APIErrorDetails[]) {
    throw new ApolloError({
        graphQLErrors: [
            {
                message: APIErrorMessage,
                extensions: {
                    exception: {
                        errors,
                    },
                },
            // Implement the bare minimum required for APIError parsing
            } as unknown as GraphQLError,
        ],
    });
}
