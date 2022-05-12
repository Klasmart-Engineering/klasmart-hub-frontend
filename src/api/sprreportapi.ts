import {
    SPRAPIError,
    SPRAPIErrorType,
} from "./sprApiError";
import { getSPREndPoint } from "@/config";
import queryString from "query-string";
import { Cookies } from "react-cookie";

const AUTH_HEADER = `authorization`;
const ACCESS_TOKEN_COOKIE = `access`;

interface GetClassesRequest {
    orgId: string;
    isTeacher: boolean;
    timezone: number;
    selectedDay?: string;
}
export interface Performance {
    total_students: number;
    average_performance: number;
    today_total_classes: number;
    today_activities: number;
}
export interface ClassDetail {
    class_id: string;
    class_name: string;
    performance: Performance;
}
interface GetClassesRepsonse {
    total: number;
    classes: ClassDetail[];
}
interface GetPerformancesRequest {
    classId: string;
    timezone: number;
    days: number;
    viewLOs: boolean;
    group?: string;
    studentId?: string;
}
export interface GetPerformancesRepsonse {
    name: string;
    above: number;
    meets: number;
    below: number;
    learningOutcome: PerformanceScore;
}
interface PerformanceScore {
    below: number;
    meets: number;
    above: number;
}
interface GetPerformanceGroupRequest {
    classId: string;
    timezone: number;
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
    public async getClasses (request: GetClassesRequest): Promise<GetClassesRepsonse | null> {
        request = {
            ...request,
            orgId: `94c33343-0736-4100-9c61-704f098b2453`,

        };
        const str = queryString.stringify({
            ...request,
        });
        const response = await this.sprCall(`GET`, `/classes?${str}`);
        const body: GetClassesRepsonse = await response.json() as GetClassesRepsonse;
        return body;
    }
    public async getPerformances (request: GetPerformancesRequest): Promise<GetPerformancesRepsonse[] | null> {
        const str = queryString.stringify(request);
        const response = await this.sprCall(`GET`, `/performances?${str}`);
        const body: GetPerformancesRepsonse[] = await response.json() as GetPerformancesRepsonse[];
        return body;
    }
    public async getPerformanceByGroups (request: GetPerformanceGroupRequest): Promise<GetPerformancesGroupRepsonse | null> {
        const str = queryString.stringify(request);
        const response = await this.sprCall(`GET`, `/performances/groups?${str}`);
        const body: GetPerformancesGroupRepsonse = await response.json() as GetPerformancesGroupRepsonse;
        return body;
    }

    private sprCall (method: "POST" | "GET" | "PUT", route: string, body?: string) {
        return this.call(method, getSPREndPoint(), route, body);
    }
    private call (method: string, prefix: string, route: string, body: string | undefined) {
        return this.fetchRoute(method, prefix, route, body);
    }
    private async fetchRoute (method: string, prefix: string, route: string, body?: string) {
        const cookie = new Cookies();
        const accessToken =
        `eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhODA3ZjhhLWNlYmItNDRlYS1hN2ZhLTYzYTg2NjljODFjNyIsImVtYWlsIjoicWF2bjErdGVhY2hlcjJAY2FsbWlkLmNvbSIsImV4cCI6MTY1MjMzODU1OCwiaXNzIjoia2lkc2xvb3AifQ.BO276zIDzQSqSPg9DczFsdxgdKd2PT4WQ2ygIiDPj3x7J6Xluhum0cjlZZRI9De7Um-DUf_G4S_1sIjDi-1kciMwUZzyAM7OE71RnZSPjM1t4xQkY4DD1wRi6e-GpWM7Cksp3NqlSHlvxtk6T3S1-BOQGUuqb4T7AGBvY4AXQD277S7A_159ecS1w-GDCz_REbDsUesG3-xHtL4MMRXrPYEXJOh2Rtk6oz6FykxKuseKNp9gzVy6G61bJjOH2yX6No8t_b_zMek_zssOwLDv5I8WYt7_0Wh4qm7kcRu_f9HIrv8IrAUc7n6o5Hi4rVja2g-ihGJr0kOIBphH1p-7Jg`;
        // cookie.get(ACCESS_TOKEN_COOKIE);
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

export function useSPRReportAPI () {
    const api = new SPRReportAPI();
    (window as any).api = api;
    return api;
}
