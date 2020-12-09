import { print } from "graphql";
import queryString from "querystring";
import { userIdVar, userProfileVar } from "../cache";
import { getKLAPIEndpoint, getKLAuthEndpoint } from "../config";
import { IUserProfile } from "../models/UserProfile";
import { ME } from "../operations/queries/me";

export async function redirectIfUnauthorized(
    continueParam?: string,
    retry = true,
) {
    try {
        const session = await refreshToken();

        if (!session) {
            if (window.location.origin === getKLAuthEndpoint()) {
                return;
            }
            const stringifiedQuery = queryString.stringify({
                continue: continueParam ? continueParam : window.location.href,
            });
            window.location.href = `${getKLAuthEndpoint()}?${stringifiedQuery}#/`;
            return;
        }

        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const request = await fetch(`${getKLAPIEndpoint()}user/`, {
            body: JSON.stringify({ query: print(ME) }),
            credentials: "include",
            headers,
            method: "POST",
        });
        const data = await request.json();
        console.log(data);

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
            email: me.email,
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
        const request = await fetch(`${getKLAuthEndpoint()}refresh`, {
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

        console.log("targetDuration: ", targetDuration);
        console.log("response.exp: ", response.exp);
        console.log("Date now: ", Date.now());
        console.log("> 0");

        expirationTimer = setTimeout(
            () => refreshToken(),
            targetDuration,
        );

        return response;
    } catch (e) {
        console.error(e);
    }
}
