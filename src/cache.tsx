import { CurrentMembership } from "./models/CurrentMembership";
import { User } from "@/types/graphQL";
import {
    InMemoryCache,
    makeVar,
    ReactiveVar,
} from "@apollo/client";

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

export const cache: InMemoryCache = new InMemoryCache({
    typePolicies: {
        // Cache [Organization/School]SummaryNode on the parent UserConnectionNode
        // to avoid invalid caching due to the non-unique `id` field
        OrganizationSummaryNode: {keyFields: false},
        SchoolSummaryNode: {keyFields: false},
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
});
