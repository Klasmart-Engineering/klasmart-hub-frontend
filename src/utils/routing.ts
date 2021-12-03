import { AuthClient } from "@/api/auth/client";
import queryString from "querystring";

export const redirectToAuth = () => {
    const stringifiedQuery = queryString.stringify({
        continue: window.location.href,
    });
    window.location.href = `${AuthClient.baseURL}?${stringifiedQuery}#/`;
};
