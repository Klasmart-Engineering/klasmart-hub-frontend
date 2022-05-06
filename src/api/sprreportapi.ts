import { getSPREndPoint } from "@/config";
import { SPRAPIError, SPRAPIErrorType } from "./sprApiError";
import queryString from "query-string";
import { Cookies } from "react-cookie";

const AUTH_HEADER = `authorization`;
const ACCESS_TOKEN_COOKIE = `access`;

interface GetClassesRequest {
    org_id: string;
}
interface Performance {
    total_students: number;
    average_performance: number;
    today_total_classes: number;
    today_activities: number;
}
interface Classes {
    class_id: string;
    class_name: string;
    performance: Performance[];
}
interface GetClassesRepsonse {
    total: number;
    classes: Classes[];
}
interface GetPerformancesRequest {
    org_id: string;
    class_id: string; 
}
interface GetPerformancesRepsonse {
    name: string;
    above: number;
    meets: number;
    below: number
    score: PerformanceScore
}
interface PerformanceScore {
    below: number;
    meets: number;
    above: number;
}
interface GetPerformanceGroupRequest {
    org_id: string;
    class_id: string;
}
interface Student {
    student_id: string;
    student_name: string;
    avatar: string;
}
interface PerformancesGroup {
    total: number;
    students: Student[];
}
export interface GetPerformancesGroupRepsonse {
    above: PerformancesGroup;
    meets: PerformancesGroup;
    below: PerformancesGroup;
}

export class SPRReportAPI {
    public async getClasses(request: GetClassesRequest): Promise<GetClassesRepsonse | null> {
        const { org_id } = request;
        const str = queryString.stringify({
            org_id,
        });
        const response = await this.sprCall(`GET`, `v1/classes?${str}`);
        const body: GetClassesRepsonse = await response.json() as GetClassesRepsonse;
        return body;
    }
    public async getPerformances(request: GetPerformancesRequest): Promise<GetPerformancesRepsonse | null> {
        const { org_id } = request;
        const str = queryString.stringify({
            org_id,
        });
        const response = await this.sprCall(`GET`, `v1/performances?${str}`);
        const body: GetPerformancesRepsonse = await response.json() as GetPerformancesRepsonse;
        return body;
    }
    public async getPerformanceByGroups(request: GetPerformanceGroupRequest): Promise<GetPerformancesGroupRepsonse | null> {
        const { org_id, class_id } = request;
        const str = queryString.stringify({
            org_id,
            class_id,
        });
        const response = await this.sprCall(`GET`, `v1/performances/groups`);
        const body: GetPerformancesGroupRepsonse = await response.json() as GetPerformancesGroupRepsonse;
        return body;
    }

    private sprCall(method: "POST" | "GET" | "PUT", route: string, body?: string) {
        return this.call(method, getSPREndPoint(), route, body);
    }
    private call(method: string, prefix: string, route: string, body: string | undefined) {
        return this.fetchRoute(method, prefix, route, body);
    }
    private async fetchRoute(method: string, prefix: string, route: string, body?: string) {
        const cookie = new Cookies();
        const accessToken = cookie.get(ACCESS_TOKEN_COOKIE);
        const headers = new Headers();
        headers.append(`Accept`, `application/json`);
        headers.append(`Content-Type`, `application/json`);
        headers.append(AUTH_HEADER, accessToken);
        const url = prefix + route;
        const response = await fetch(url, {
            body,
            credentials: `include`,
            headers,
            method,
        });

        if (response.status === 200) { return response; }
        const responseBody = await response.json();
        let errCode = SPRAPIErrorType.UNKNOWN;
        let errParams;
        if (typeof responseBody.errCode === `number`) {
            errCode = responseBody.errCode;
        }
        if (typeof responseBody.errParams === `object`) {
            errParams = responseBody.errParams;
        }
        throw new SPRAPIError(errCode, errParams);
    }
}

export function useSPRReportAPI() {
    const api = new SPRReportAPI();
    (window as any).api = api;
    return api;
}