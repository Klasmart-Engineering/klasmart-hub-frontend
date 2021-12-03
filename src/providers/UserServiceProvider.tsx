import { authClient } from "@/api/auth/client";
import { cache } from "@/cache";
import { getAPIEndpoint } from "@/config";
import { REQUEST_RETRY_COUNT_MAX } from "@/config/variables";
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
import React from "react";

const objectCleanerLink = new ApolloLink((operation, forward) => {
    operation.variables = utils.trimStrings(operation.variables); // clean request data
    return forward(operation).map((value) => utils.trimStrings(value)); // clean response data
});

const uploadLink = createUploadLink({
    credentials: `include`,
    uri: `${getAPIEndpoint()}user/`,
});

const persistedQueryLink = createPersistedQueryLink({
    sha256,
});

const retry = async (count: number, operation: Operation, error: ServerError): Promise<boolean> => {
    if (count > REQUEST_RETRY_COUNT_MAX) return false;
    const isAuthError = error.result?.errors.find((error: GraphQLError) => error.extensions?.code === `UNAUTHENTICATED`);
    if (!isAuthError) return false;
    try {
        await authClient.refreshToken();
        return true;
    } catch (err) {
        redirectToAuth();
        return false;
    }
};

const retryLink = new RetryLink({
    attempts: (count, operation, error) => {
        return retry(count, operation, error);
    },
});

export const client = new ApolloClient({
    credentials: `include`,
    link: ApolloLink.from([
        retryLink,
        objectCleanerLink,
        persistedQueryLink,
        uploadLink,
    ]),
    cache,
    queryDeduplication: true,
});

interface Props {
    children: React.ReactNode;
}

export default function UserServiceProvider (props: Props) {
    return (
        <ApolloProvider client={client}>{props.children}</ApolloProvider>
    );
}
