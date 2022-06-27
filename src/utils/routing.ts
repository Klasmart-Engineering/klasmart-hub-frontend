import { AuthClient } from "@/api/auth/client";

interface RedirectToAuthOptions {
  withParams?: boolean;
}

export const redirectToAuth = (options?: RedirectToAuthOptions) => {
    const params = new URLSearchParams({
        continue: options?.withParams
            ? window.location.href
            : window.location.origin,
    });
    window.location.href = `${AuthClient.baseURL}logout?${params.toString()}`;
};
