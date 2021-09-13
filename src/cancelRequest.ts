// code from https://github.com/nirus/fullstack-tutorial/blob/master/final/client/src/cancelRequest.ts
import {
    ApolloLink,
    Observable,
} from '@apollo/client';

const connections = new Map<string, AbortController>();

export const cancelRequestLink = new ApolloLink((operation, forward) => new Observable(observer => {
    const context = operation.getContext();
    const connectionHandle = forward(operation).subscribe({
        next: (...arg) => observer.next(...arg),
        error: (...arg) => {
            cleanUp();
            observer.error(...arg);
        },
        complete: (...arg) => {
            cleanUp();
            observer.complete(...arg);
        },
    });

    const cleanUp = () => {
        connectionHandle?.unsubscribe();
        connections.delete(context.requestTrackerId);
    };

    if (context.requestTrackerId) {
        const controller = new AbortController();
        controller.signal.onabort = cleanUp;
        operation.setContext({
            ...context,
            fetchOptions: {
                signal: controller.signal,
                ...context?.fetchOptions,
            },
        });

        if (connections.has(context.requestTrackerId)) {
            // If a controller exists, that means this operation should be aborted.
            connections.get(context.requestTrackerId)?.abort();
        }

        connections.set(context.requestTrackerId, controller);
    }

    return connectionHandle;
}));
