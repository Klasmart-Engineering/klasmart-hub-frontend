import { InMemoryCache, makeVar, ReactiveVar } from "@apollo/client";
import { ICurrentMembership } from "./models/CurrentMembership";
import { IUserProfile } from "./models/UserProfile";

/**
 * Set initial values when we create cache variables.
 */

const currentMembershipInitialValue: ICurrentMembership = {
    organization_email: "",
    organization_id: "",
    organization_name: "",
};
const userIdInitialValue = "";
const userProfileInitialValue: IUserProfile = {
    avatar: "",
    email: "",
    user_id: "",
    user_name: "",
};

const organizationIdInitialValue = "";

export const currentMembershipVar: ReactiveVar<ICurrentMembership> = makeVar<ICurrentMembership>(
    currentMembershipInitialValue,
);

export const userIdVar: ReactiveVar<string> = makeVar<string>(
    userIdInitialValue,
);

export const userProfileVar: ReactiveVar<IUserProfile> = makeVar<IUserProfile>(
    userProfileInitialValue,
);

export const organizationIdVar: ReactiveVar<string> = makeVar<string>(
    organizationIdInitialValue,
);

export const cache: InMemoryCache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                class: {
                    merge: true,
                },
                currentMembership: {
                    read() {
                        return currentMembershipVar();
                    },
                },
                me: {
                    merge: true,
                },
                organization: {
                    merge: true,
                },
                organizationId: {
                    read() {
                        return organizationIdVar();
                    },
                },
                user: {
                    merge: true,
                },
                userId: {
                    read() {
                        return userIdVar();
                    },
                },
                userProfile: {
                    read() {
                        return userProfileVar();
                    },
                },
            },
        },
    },
});
