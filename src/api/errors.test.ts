import {
    APIErrorCode,
    APIErrorDetails,
    filterAPIErrors,
} from "@/api/errors";
import { ApolloError } from "@apollo/client";

describe(`filterAPIErrors`, () => {
    const errors = {
        graphQLErrors: [
            {
                message: `ERR_API_BAD_INPUT`,
                extensions: {
                    exception: {
                        errors: [
                            {
                                api: `inviteUser`,
                                code: `ERR_INVALID_DATE`,
                                message: `User date_of_birth does not match the format MM-YYYY.`,
                                entity: `User`,
                                attribute: [ `date_of_birth` ],
                                format: `MM-YYYY`,
                            },
                            {
                                api: `inviteUser`,
                                code: `ERR_DUPLICATE_ENTITY`,
                                message: `OrganizationMembership 1HC3JN0QT2C2K60W already exists.`,
                                entity: `OrganizationMembership`,
                                attribute: [ `shortcode` ],
                                value: `1HC3JN0QT2C2K60W`,
                            },
                        ],
                    },
                },
            },
        ],
    } as unknown as ApolloError;

    test(`converts an ApolloError into APIErrorDetails`, () => {
        const expected: APIErrorDetails[] = [
            {
                code: APIErrorCode.ERR_INVALID_DATE,
                message: `User date_of_birth does not match the format MM-YYYY.`,
                format: `MM-YYYY`,
                attribute: [ `date_of_birth` ],
                entity: `User`,
            },
            {
                code: APIErrorCode.ERR_DUPLICATE_ENTITY,
                message: `OrganizationMembership 1HC3JN0QT2C2K60W already exists.`,
                entity: `OrganizationMembership`,
                attribute: [ `shortcode` ],
            },
        ];
        expect(filterAPIErrors(errors)).toEqual(expected);
    });
});
