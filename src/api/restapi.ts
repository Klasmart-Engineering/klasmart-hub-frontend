import { getCNEndpoint } from "../config";
import { Store } from "../store/store";
import {
    AssessmentItem,
    AssessmentStatus,
    ContentItemDetails,
    PublishedContentItem,
    PublishedContentPayload,
    SchedulePayload,
    TimeView,
} from "../types/objectTypes";
import {
    RestAPIError,
    RestAPIErrorType,
} from "./restapi_errors";
import queryString from "query-string";
import { useStore } from "react-redux";

export enum ContentType {
    MATERIAL = 1,
    PLAN = 2,
    FOLDER = 10,
}

export const getContentTypeStr = (type: ContentType) => {
    switch (type) {
    case ContentType.MATERIAL: return `material`;
    case ContentType.PLAN: return `plan`;
    case ContentType.FOLDER: return `folder`;
    }
};

interface GetLibraryRequest {
    org_id: string;
    publish_status?: number;
    page?: number;
    page_size?: number;
    content_type?: ContentType[];
    order_by?: string;
    path?: string;
}

interface GetContentByIdRequest {
    content_id: string;
    org_id: string;
}

interface DeleteFoldersItemsByIdRequest {
    folder_id: string;
    org_id: string;
}

interface DeleteContentsByIdRequest {
    content_id: string;
    org_id: string;
}

interface CreateContent {
    name: string;
    owner_type?: number;
    parent_id?: string;
    partition?: string;
    org_id: string;
}

interface GetLiveTokenByClassIdRequest {
    classId: string;
    organizationId: string;
}

interface GetLiveTokenByClassIdResponse {
    token: string;
}

interface GetLiveTokenByLessonPlanIdRequest {
    lessonPlanId: string;
    organizationId: string;
}

interface GetLiveTokenByLessonPlanIdResponse {
    token: string;
}

interface GetFolderItemsDetailsByIdRequest {
    folder_id: string;
    org_id: string;
}

interface UpdateFolderItemsDetailsByIdRequest {
    folder_id: string;
    org_id: string;
    name: string;
}

interface FolderShareStatusOrganization {
    id: string;
    name: string;
}

interface FolderShareStatus {
    folder_id: string;
    orgs: FolderShareStatusOrganization[];
}

interface GetFoldersShareRequest {
    org_id: string;
    folder_ids: string;
    metaLoading: boolean;
}

interface GetFoldersShareResponse {
    data: FolderShareStatus[] | null;
}

interface PutFoldersShareRequest {
    org_id: string;
    org_ids: string[];
    folder_ids: string[];
}

interface PutFoldersShareResponse {
    data: "";
}

interface GetFolderStructureRequest {
    path?: string;
    item_type?: string;
    partition?: string;
    org_id: string;
}

interface GetFolderStructureResponse {
    total: number;
    items: PublishedContentItem[];
}

export enum FolderFileType {
    FOLDER = `folder`,
    CONTENT = `content`,
}

interface FolderInfo {
    folder_file_type: FolderFileType;
    id: string;
}

interface PutFoldersItemsBulkMoveRequest {
    dist: string;
    folder_info: FolderInfo[];
    owner_type?: number;
    partition?: string;
    org_id: string;
}

interface PutFoldersItemsBulkMoveResponse {
    data: "";
}

interface GetSchedulesTimeViewRequest {
    org_id: string;
    view_type: TimeView;
    start_at_ge: number;
    end_at_le: number;
    time_zone_offset: number;
}

type AssessmentsOrder = `class_end_time` | `-class_end_time` | `complete_time` | `-complete_time`

interface GetAssessmentsRequest {
    org_id: string;
    page?: number;
    page_size?: number;
    status?: string;
    teacher_name?: string;
    class_type?: string;
    order_by?: AssessmentsOrder;
}

interface GetAssessmentsResponse {
    items: AssessmentItem[];
    total: number;
}

interface GetAssessmentsSummaryRequest {
    org_id: string;
    status?: string;
    teacher_name?: string;
    class_type?: string;
}

interface GetAssessmentsSummaryResponse {
    [AssessmentStatus: string]: number;
}

export type ScheduleServerType = `OfflineClass` | `OnlineClass` | `Homework` | `IsHomeFun`

export interface AssessmentForStudent {
    id: string;
    title: string;
    score: number;
    status: string;
    create_at: number;
    complete_at: number;
    update_at: number;
    teacher_comments: {
        teacher: {
            id: string;
            avatar: string;
            given_name: string;
            family_name: string;
        };
        comment: string;
    }[];
    schedule: {
        id: string;
        title: string;
        type: ScheduleServerType;
        attachment: {
            name: string;
            id: string;
        };
    };
    student_attachments: {
        name: string;
        id: string;
    }[];
}

interface GetAssessmentsForStudentRequest {
    org_id: string;
    type: string;
    order_by?: string;
    teacher_id?: string;
    assessment_id?: string;
    status?: string;
    create_at_ge?: number;
    create_at_le?: number;
    update_at_ge?: number;
    update_at_le?: number;
    complete_at_ge?: number;
    complete_at_le?: number;
    page?: number;
    page_size?: number;
}

interface GetAssessmentsForStudentResponse {
    list: AssessmentForStudent[];
    total: number;
}

interface GetContentResourcesDownloadByIdRequest {
    org_id: string;
    resource_id: string;
}

interface GetContentResourcesDownloadByIdResponse {
    path: string;
}

export class RestAPI {

    private store: Store;

    constructor (store: ReturnType<typeof useStore>) {
        this.store = store as any; // TODO: Fix types
    }

    public async getContentsFolders (orgId: string, contentType = 2, page = 1, pageSize = 100, orderBy = `-create_at`, path = ``) {
        const str = queryString.stringify({
            org_id: orgId,
            publish_status: `published`,
            page,
            page_size: pageSize,
            content_type: contentType,
            order_by: orderBy,
            path,
        });

        const response = await this.contentCall(`GET`, `v1/contents_folders?${str}`);
        const body: PublishedContentPayload = await response?.json();
        if (typeof body === `object`) {
            const { list } = body;
            if (typeof list === `object` && list instanceof Array) {
                return list;
            }
        }
        throw new RestAPIError(RestAPIErrorType.UNKNOWN, body);
    }

    public async getContentFolders (request: GetLibraryRequest) {
        const {
            org_id,
            publish_status,
            page = 1,
            page_size,
            content_type = [ ContentType.MATERIAL ],
            order_by = `-createAt`,
            path = ``,
        } = request;
        const str = queryString.stringify({
            org_id,
            publish_status,
            page,
            page_size,
            content_type: content_type.join(`,`),
            order_by,
            path,
        });

        const response = await this.contentCall(`GET`, `v1/contents_folders?${str}`);
        return response?.json() as Promise<PublishedContentPayload>;
    }

    public async getFoldersShare (request: GetFoldersShareRequest) {
        const {
            org_id,
            folder_ids,
            metaLoading,
        } = request;
        const query = queryString.stringify({
            org_id,
            folder_ids,
            metaLoading,
        });
        const response = await this.contentCall(`GET`, `v1/folders/share?${query}`);
        return response?.json() as Promise<GetFoldersShareResponse>;
    }

    public async putFoldersShare (request: PutFoldersShareRequest) {
        const {
            org_id,
            org_ids,
            folder_ids,
        } = request;
        const query = queryString.stringify({
            org_id,
        });
        const body = JSON.stringify({
            folder_ids,
            org_ids,
        });
        const response = await this.contentCall(`PUT`, `v1/folders/share?${query}`, body);
        return response?.json() as Promise<PutFoldersShareResponse>;
    }

    public async getFolderStructure (request: GetFolderStructureRequest) {
        const {
            path = ``,
            item_type = `1`,
            partition = `plans+and+materials`,
            org_id,
        } = request;
        const query = queryString.stringify({
            path,
            item_type,
            partition,
            org_id,
        });
        const response = await this.contentCall(`GET`, `v1/folders/items/search/org?${query}`);
        return response?.json() as Promise<GetFolderStructureResponse>;
    }

    public async putFoldersItemsBulkMove (request: PutFoldersItemsBulkMoveRequest) {
        const {
            dist,
            folder_info,
            owner_type = 1,
            partition = `plans and materials`,
            org_id,
        } = request;
        const query = queryString.stringify({
            org_id,
        });
        const body = JSON.stringify({
            dist,
            folder_info,
            owner_type,
            partition,
        });
        const response = await this.contentCall(`PUT`, `v1/folders/items/bulk/move?${query}`, body);
        return response?.json() as Promise<PutFoldersItemsBulkMoveResponse>;
    }

    public async getFolderItemsDetailsById (request: GetFolderItemsDetailsByIdRequest) {
        const {
            folder_id,
            org_id,
        } = request;
        const str = queryString.stringify({
            org_id,
        });

        const response = await this.contentCall(`GET`, `v1/folders/items/details/${folder_id}?${str}`);
        return response?.json() as Promise<ContentItemDetails>;
    }

    public async getLiveTokenByClassId (request: GetLiveTokenByClassIdRequest) {
        const { classId, organizationId } = request;
        const response = await this.scheduleCall(`GET`, `v1/schedules/${classId}/live/token?live_token_type=live&org_id=${organizationId}`);
        if (response.status !== 200) throw Error(`No token found`);
        return response.json() as Promise<GetLiveTokenByClassIdResponse>;
    }

    public async getLiveTokenByLessonPlanId (request: GetLiveTokenByLessonPlanIdRequest) {
        const { lessonPlanId, organizationId } = request;
        const response = await this.contentCall(`GET`, `v1/contents/${lessonPlanId}/live/token?org_id=${organizationId}`);
        if (response.status !== 200) throw Error(`No token found`);
        return response.json() as Promise<GetLiveTokenByLessonPlanIdResponse>;
    }

    public async createFoldersItems (request: CreateContent) {
        const {
            name,
            owner_type = 1,
            parent_id = ``,
            partition = `plans and materials`,
            org_id,
        } = request;
        const body = JSON.stringify({
            name,
            owner_type,
            parent_id,
            partition,
        });
        const query = queryString.stringify({
            org_id,
        });
        const response = await this.contentCall(`POST`, `v1/folders?${query}`, body);
        return response?.json();
    }

    public async updateFolderItemsDetailsById (request: UpdateFolderItemsDetailsByIdRequest) {
        const {
            folder_id,
            org_id,
            name,
        } = request;
        const query = queryString.stringify({
            org_id,
        });
        const body = JSON.stringify({
            name,
        });
        const response = await this.contentCall(`PUT`, `v1/folders/items/details/${folder_id}?${query}`, body);
        return response?.json();
    }

    public async deleteFoldersItemsById (request: DeleteFoldersItemsByIdRequest) {
        const {
            folder_id,
            org_id,
        } = request;
        const str = queryString.stringify({
            org_id,
        });
        const response = await this.contentCall(`DELETE`, `v1/folders/items/${folder_id}?${str}`);
        return response?.json();
    }

    public async deleteContentsItemsById (request: DeleteContentsByIdRequest) {
        const {
            content_id,
            org_id,
        } = request;
        const str = queryString.stringify({
            org_id,
        });
        const response = await this.contentCall(`DELETE`, `v1/contents/${content_id}?${str}`);
        return response?.json();
    }

    public async getContentsById (request: GetContentByIdRequest) {
        const {
            content_id,
            org_id,
        } = request;
        const str = queryString.stringify({
            org_id,
        });

        const response = await this.contentCall(`GET`, `v1/contents/${content_id}?${str}`);
        return response?.json() as Promise<PublishedContentPayload>;
    }

    public async getSchedulesTimeView (request: GetSchedulesTimeViewRequest) {
        const {
            org_id,
            view_type,
            start_at_ge,
            end_at_le,
            time_zone_offset,
        } = request;
        const str = queryString.stringify({
            org_id,
            view_type,
            start_at_ge,
            end_at_le,
            time_zone_offset,
        });

        const response = await this.scheduleCall(`GET`, `v1/schedules_time_view?` + str);
        const body: SchedulePayload[] = await response?.json();
        if (body instanceof Array) {
            return body;
        }
        throw new RestAPIError(RestAPIErrorType.UNKNOWN, body);
    }

    public async getAssessments (request: GetAssessmentsRequest): Promise<GetAssessmentsResponse | null> {
        const str = queryString.stringify(request, {
            skipNull: true,
        });
        const response = await this.assessmentCall(`GET`, `v1/assessments?${str}`);
        const body = await response.json() as GetAssessmentsResponse | null;
        return body;
    }

    public async getAssessmentsSummary (request: GetAssessmentsSummaryRequest): Promise<GetAssessmentsSummaryResponse | null> {
        const str = queryString.stringify(request, {
            skipNull: true,
        });
        const response = await this.assessmentCall(`GET`, `v1/assessments_summary?${str}`);
        const body = await response.json() as GetAssessmentsSummaryResponse | null;
        return body;
    }

    public async getAssessmentsForStudent (request: GetAssessmentsForStudentRequest): Promise<GetAssessmentsForStudentResponse | null> {
        const str = queryString.stringify(request, {
            skipNull: true,
        });
        const response = await this.assessmentCall(`GET`, `v1/assessments_for_student?${str}`);
        const body = await response.json() as GetAssessmentsForStudentResponse | null;
        return body;
    }

    public async getContentsResourcesDownloadById (request: GetContentResourcesDownloadByIdRequest): Promise<GetContentResourcesDownloadByIdResponse | null> {
        const { org_id, resource_id } = request;
        const str = queryString.stringify({
            org_id,
        });
        const response = await this.assessmentCall(`GET`, `v1/contents_resources/${resource_id}/download?${str}`);
        const body = await response.json() as GetContentResourcesDownloadByIdResponse | null;
        return body;
    }

    private contentCall (method: "POST" | "GET" | "PUT" | "DELETE", route: string, body?: string) {
        return this.call(method, getCNEndpoint(), route, body);
    }

    private scheduleCall (method: "POST" | "GET" | "PUT" | "DELETE", route: string, body?: string) {
        return this.call(method, getCNEndpoint(), route, body);
    }

    private assessmentCall (method: "POST" | "GET" | "PUT", route: string, body?: string) {
        return this.call(method, getCNEndpoint(), route, body);
    }

    private async call (method: string, prefix: string, route: string, body: string | undefined) {
        // try {
        //     const response = await this.fetchRoute(method, prefix, route, body);
        //     return response;
        // } catch (e) {
        //     console.error(e);
        // }
        return this.fetchRoute(method, prefix, route, body);
    }

    private async fetchRoute (method: string, prefix: string, route: string, body?: string) {
        const headers = new Headers();
        headers.append(`Accept`, `application/json`);
        headers.append(`Content-Type`, `application/json`);
        const url = prefix + route;
        const response = await fetch(url, {
            body,
            credentials: `include`,
            headers,
            method,
        });

        if (response.status === 200) { return response; }

        const responseBody = await response.json();
        let errCode = RestAPIErrorType.UNKNOWN;
        let errParams;
        if (typeof responseBody.errCode === `number`) {
            errCode = responseBody.errCode;
        }
        if (typeof responseBody.errParams === `object`) {
            errParams = responseBody.errParams;
        }
        throw new RestAPIError(errCode, errParams);

    }
}

export function useRestAPI () {
    const store = useStore();
    const api = new RestAPI(store);
    (window as any).api = api;
    return api;
}
