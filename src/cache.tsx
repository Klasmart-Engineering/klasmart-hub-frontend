import { CurrentMembership } from "./models/CurrentMembership";
import { User } from "@/types/graphQL";
import {
    InMemoryCache,
    InMemoryCacheConfig,
    makeVar,
    ReactiveVar,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

/**
 * Set initial values when we create cache variables.
 */

const currentMembershipInitialValue: CurrentMembership = {
    organization_email: ``,
    organization_id: ``,
    organization_name: ``,
};
const userIdInitialValue = ``;
const userProfileInitialValue: User = {
    avatar: ``,
    email: ``,
    user_id: ``,
    username: ``,
};

export const currentMembershipVar: ReactiveVar<CurrentMembership> = makeVar<CurrentMembership>(currentMembershipInitialValue);

export const userIdVar: ReactiveVar<string> = makeVar<string>(userIdInitialValue);

export const userProfileVar: ReactiveVar<User> = makeVar<User>(userProfileInitialValue);

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
        Query: {
            fields: {
                class: {
                    merge: true,
                },
                currentMembership: {
                    read () {
                        return currentMembershipVar();
                    },
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
                userId: {
                    read () {
                        return userIdVar();
                    },
                },
                userProfile: {
                    read () {
                        return userProfileVar();
                    },
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
