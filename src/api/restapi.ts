import queryString from "query-string";
import { useStore } from "react-redux";
import {
    getCNEndpoint,
} from "../config";
import { Store } from "../store/store";
import { AssessmentPayload, PublishedContentPayload, SchedulePayload, TimeView } from "../types/objectTypes";
import { RestAPIError, RestAPIErrorType } from "./restapi_errors";

export class RestAPI {

    private store: Store;

    constructor(store: ReturnType<typeof useStore>) {
        this.store = store as any; // TODO: Fix types
    }

    public async publishedContent(orgId: string, contentType = 2, page = 1, pageSize = 100, orderBy = "-create_at", path = "") {
        const str = queryString.stringify({ org_id: orgId, publish_status: "published", page, page_size: pageSize, content_type: contentType, order_by: orderBy, path });

        const response = await this.contentCall("GET", "v1/contents_folders?" + str);
        const body: PublishedContentPayload = await response?.json();
        if (typeof body === "object") {
            const { list } = body;
            if (typeof list === "object" && list instanceof Array) {
                return list;
            }
        }
        throw new RestAPIError(RestAPIErrorType.UNKNOWN, body);
    }

    public async schedule(orgId: string, viewType: TimeView, timeAt: number, timeZoneOffset: number) {
        const str = queryString.stringify({ org_id: orgId, view_type: viewType, time_at: timeAt, time_zone_offset: timeZoneOffset });

        const response = await this.scheduleCall("GET", "v1/schedules_time_view?" + str);
        const body: SchedulePayload[] = await response?.json();
        if (body instanceof Array) {
            console.log(body);
            return body;
        }
        throw new RestAPIError(RestAPIErrorType.UNKNOWN, body);
    }

    public async assessments(orgId: string, page?: number, pageSize?: number) {
        const str = queryString.stringify({org_id: orgId, page, page_size: pageSize}, { skipNull: true });

        const response = await this.assessmentCall("GET", "v1/assessments?" + str);
        const body: AssessmentPayload = await response.json();
        if (typeof body === "object") {
            const { items } = body;
            if (typeof items === "object" && items instanceof Array) {
                return items;
            }
        }
        throw new RestAPIError(RestAPIErrorType.UNKNOWN, body);
    }

    private contentCall(method: "POST" | "GET" | "PUT" | "DELETE", route: string, body?: string) {
        return this.call(method, getCNEndpoint(), route, body);
    }

    private scheduleCall(method: "POST" | "GET" | "PUT" | "DELETE", route: string, body?: string) {
        return this.call(method, getCNEndpoint(), route, body);
    }

    private assessmentCall(method: "POST" | "GET" | "PUT", route: string, body?: string) {
        return this.call(method, getCNEndpoint(), route, body);
    }

    private async call(method: string, prefix: string, route: string, body: string | undefined) {
        try {
            const response = await this.fetchRoute(method, prefix, route, body);
            return response;
        } catch (e) {
            console.error(e);
        }
    }

    private async fetchRoute(method: string, prefix: string, route: string, body?: string) {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const url = prefix + route;
        const response = await fetch(url, {
            body,
            credentials: "include",
            headers,
            method,
        });

        if (response.status === 200) { return response; }

        const responseBody = await response.json();
        let errCode = RestAPIErrorType.UNKNOWN;
        let errParams;
        if (typeof responseBody.errCode === "number") {
            errCode = responseBody.errCode;
        }
        if (typeof responseBody.errParams === "object") {
            errParams = responseBody.errParams;
        }
        throw new RestAPIError(errCode, errParams);

    }
}

export function useRestAPI() {
    const store = useStore();
    const api = new RestAPI(store);
    (window as any).api = api;
    return api;
}
