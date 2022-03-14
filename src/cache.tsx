import {
    InMemoryCache,
    InMemoryCacheConfig,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

export const cacheConfig: InMemoryCacheConfig = {
    typePolicies: {
        // Cache [Organization/School]SummaryNode on the parent UserConnectionNode
        // to avoid invalid caching due to the non-unique `id` field
        OrganizationSummaryNode: {
            keyFields: false,
        },
        SchoolSummaryNode: {
            keyFields: false,
        },
        RoleSummaryNode: {
            // Same Role could be assigned on the Organization or School level
            keyFields: [ `id`, `organizationId` ],
        },
        ContactInfo: {
            keyFields: [
                `email`,
                `phone`,
                `username`,
            ],
        },
        OrganizationContactInfo: {
            keyFields: [ `phone` ],
        },
        Query: {
            fields: {
                class: {
                    merge: true,
                },
                me: {
                    merge: true,
                },
                organization: {
                    merge: true,
                },
                user: {
                    merge: true,
                },
                gradesConnection: relayStylePagination(),
                usersConnection: relayStylePagination(),
                programsConnection: relayStylePagination(),
                schoolsConnection: relayStylePagination(),
                ageRangesConnection: relayStylePagination(),
                classesConnection: relayStylePagination(),
                subjectsConnection: relayStylePagination(),
                rolesConnection: relayStylePagination(),
            },
        },
        Mutation: {
            fields: {
                organization: {
                    merge: true,
                },
                user: {
                    merge: true,
                },
            },
        },
    },
};

export const cache: InMemoryCache = new InMemoryCache(cacheConfig);
