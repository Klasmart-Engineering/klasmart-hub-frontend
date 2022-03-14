import { AuthClient } from "@/api/auth/client";

interface RedirectToAuthOptions {
    withParams?: boolean;
}

export const redirectToAuth = (options?: RedirectToAuthOptions) => {
    const params = new URLSearchParams({
        continue: options?.withParams ? window.location.href : window.location.origin,
    });
    const redirectURL = new URL(`${AuthClient.baseURL}logout?${params.toString()}`);
    window.location.href = redirectURL.href;
};
