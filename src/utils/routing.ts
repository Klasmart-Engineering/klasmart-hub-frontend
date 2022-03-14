import { AuthClient } from "@/api/auth/client";

interface RedirectToAuthOptions {
    withParams?: boolean;
}

export const redirectToAuth = (options?: RedirectToAuthOptions) => {
    const params = new URLSearchParams({
        continue: options?.withParams ? window.location.href : window.location.origin,
    });

    if (process.env.AUTH_LOGOUT_ROUTE_ENABLED === `true`) {
        window.location.href = `${AuthClient.baseURL}logout?${params.toString()}`;
    } else {
        window.location.href = `${AuthClient.baseURL}?${params.toString()}#/`;
    }
};
