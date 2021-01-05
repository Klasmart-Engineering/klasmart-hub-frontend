import { print } from "graphql";
import queryString from "querystring";
import { userIdVar, userProfileVar } from "../cache";
import { getAPIEndpoint, getAuthEndpoint } from "../config";
import { IUserProfile } from "../models/UserProfile";
import { ME } from "../operations/queries/me";

export async function redirectIfUnauthorized(
    continueParam?: string,
    retry = true,
) {
    try {
        const session = await refreshToken();

        if (!session) {
            if (window.location.origin === getAuthEndpoint()) {
                return;
            }
            const stringifiedQuery = queryString.stringify({
                continue: continueParam ? continueParam : window.location.href,
            });
            window.location.href = `${getAuthEndpoint()}?${stringifiedQuery}#/`;
            return;
        }

        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const request = await fetch(`${getAPIEndpoint()}user/`, {
            body: JSON.stringify({ query: print(ME) }),
            credentials: "include",
            headers,
            method: "POST",
        });
        const data = await request.json();

        if (!data?.data?.me || !request.ok) {
            if (retry) {
                redirectIfUnauthorized(continueParam, false);
                return;
            }
        }

        const me: IUserProfile = data.data.me;
        userProfileVar({
            user_id: me.user_id,
            user_name: me.user_name,
            given_name: me.given_name,
            family_name: me.family_name,
            email: me.email,
            phone: me.phone,
            avatar: me.avatar,
        });
        userIdVar(me.user_id);
    } catch (e) {
        console.error(e);
    }
}

let expirationTimer: NodeJS.Timeout | undefined;

export async function refreshToken() {
    try {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const request = await fetch(`${getAuthEndpoint()}refresh`, {
            credentials: "include",
            headers,
            method: "GET",
        });

        if (!request.ok) {
            return;
        }
        const response = await request.json();
        const targetDuration = Math.max(response.exp * 1000 - Date.now(), (response.exp * 1000 - Date.now()) - 360000);

        if (expirationTimer) {
            clearTimeout(expirationTimer);
        }

        expirationTimer = setTimeout(
            () => refreshToken(),
            targetDuration,
        );

        return response;
    } catch (e) {
        console.error(e);
    }
}
