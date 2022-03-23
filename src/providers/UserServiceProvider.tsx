import { authClient } from "@/api/auth/client";
import { cache } from "@/cache";
import { getAPIEndpoint } from "@/config";
import { REQUEST_RETRY_COUNT_MAX } from "@/config/index";
import { redirectToAuth } from "@/utils/routing";
import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    Operation,
    ServerError,
} from "@apollo/client";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { RetryLink } from "@apollo/client/link/retry";
import { createUploadLink } from "apollo-upload-client";
import { sha256 } from 'crypto-hash';
import { GraphQLError } from "graphql";
import { utils } from "kidsloop-px";
import React,
{ useMemo } from "react";

const persistedQueryLink = createPersistedQueryLink({
    sha256,
});

const objectCleanerLink = new ApolloLink((operation, forward) => {
    operation.variables = utils.trimStrings(operation.variables); // clean request data
    return forward(operation).map((value) => utils.trimStrings(value)); // clean response data
});

const checkForAuthError = (error: GraphQLError) => {
    return error.extensions?.code === `UNAUTHENTICATED` || error.message === `User is required for authorization`;
};

const retryLink = new RetryLink({
    attempts: async (count, operation, error) => {
        if (count > REQUEST_RETRY_COUNT_MAX) return false;
        const isAuthError = error.result?.errors.find(checkForAuthError);
        if (!isAuthError) return false;
        try {
            await authClient.refreshToken();
            return true;
        } catch (err) {
            redirectToAuth({
                withParams: true,
            });
            return false;
        }
    },
});

/**
 * "[RetryLink] does not (currently) handle retries for GraphQL errors in the response, only for network errors."
 * https://www.apollographql.com/docs/react/api/link/apollo-link-retry/
 * solution inspired by https://github.com/apollographql/apollo-link/issues/541
 */
const graphQLAuthErrorPromoterLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((data) => {
        const isAuthError = data?.errors?.find(checkForAuthError);
        if (isAuthError) throw {
            result: data,
        };
        return data;
    });
});

const uploadLink = createUploadLink({
    credentials: `include`,
    uri: `${getAPIEndpoint()}user/`,
});

interface Props {
}

const UserServiceProvider: React.FC<Props> = (props) => {
    const client = useMemo(() => new ApolloClient({
        credentials: `include`,
        link: ApolloLink.from([
            objectCleanerLink,
            retryLink,
            graphQLAuthErrorPromoterLink,
            persistedQueryLink,
            uploadLink,
        ]),
        cache,
        queryDeduplication: true,
    }), []);

    return (
        <ApolloProvider client={client}>{props.children}</ApolloProvider>
    );
};

export default UserServiceProvider;
