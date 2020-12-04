import { InMemoryCache, makeVar, ReactiveVar } from "@apollo/client";
import { ICurrentMembership } from "./models/CurrentMembership";
import { IUserProfile } from "./models/UserProfile";

/**
 * Set initial values when we create cache variables.
 */

const currentMembershipInitialValue: ICurrentMembership = {
    organization_name: "",
    organization_id: "",
    organization_email: "",
};
const userIdInitialValue = "";
const userProfileInitialValue: IUserProfile = {
    user_id: "",
    user_name: "",
    email: "",
    avatar: "",
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
                user: {
                    merge: true,
                },
                currentMembership: {
                    read() {
                        return currentMembershipVar();
                    },
                },
                organization: {
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
                organizationId: {
                    read() {
                        return organizationIdVar();
                    },
                },
            },
        },
    },
});
