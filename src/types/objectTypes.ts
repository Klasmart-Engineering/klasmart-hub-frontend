import { StyledIcon } from "@styled-icons/styled-icon";

export interface PublishedContentPayload {
    total: number;
    list: PublishedContentItem[];
}

export interface PublishedContentItem {
    id: string;
    name: string;
    content_type: number;
    description: string;
    keywords: string;
    author: string;
    items_count: number;
    publish_status: string;
    thumbnail: string;
    data: string;
    author_name: string;
    dir_path: string;
    content_type_name: string;
    create_at: number;
    update_at: number;
}

export interface SchedulePayload {
    class_id: string;
    class_type: string;
    end_at: number;
    id: string;
    is_repeat: boolean;
    lesson_plan_id: string;
    start_at: number;
    status: string;
    title: string;
}

export type TimeView = "day" | "work_week" | "week" | "month";

export interface AssessmentPayload {
    total: number;
    items: AssessmentItem[];
}

export interface AssessmentItem {
    id: string;
    title: string;
    subject: Identity;
    program: Identity;
    teachers: Identity[];
    class_end_time: number;
    complete_time: number;
    status: string;
}

export interface LivePreviewJWT {
    aud: string;
    exp: number;
    iat: number;
    iss: string;
    sub: string;
    name: string;
    user_id: string;
    type: string;
    teacher: boolean;
    roomid: string;
    materials: Material[];
    classtype: string;
    org_id: string;
}

export interface Material {
    name: string;
    url: string;
    __typename: string;
}

export interface Identity {
    id: string;
    name: string;
}

export interface UserAgent {
    isMobile: boolean;
    isIOS: boolean;
    isIE: boolean;
    isEdge: boolean;
    isLandscape?: boolean;
}

export interface MenuItem {
    description: string;
    link?: string;
    icon: StyledIcon;
    color: string;
    title: string;
}

export type LibraryContentType = "OwnedContent" | "Marketplace";

export interface IUserContext {
    roomId: string;
    teacher: boolean;
    name: string;
}

export type LibraryMenu = "published" | "pending" | "archived";

export type AssessmentsMenu = "library" | "pending" | "completed";

type ColumnAttr = string | { [styleAttr: string]: string } | undefined;
export type TableColumns = Array<{
    [attr: string]: ColumnAttr;
}>;

export interface SkillCatOption {
    devSkillId: string;
    skillCatId: string;
    name: string;
}

export interface DevSkillOption {
    devSkillId: string;
    name: string;
}

export interface Student {
    profileId: string;
    profileName: string;
    iconLink: string;
}

export interface LiveSessionData {
    classId: string;
    className: string;
    startDate: number;
    students: Student[];
}

export interface IframeMessageChangeLocale {
    type: "changeLocale";
    payload: "en-US" | "ko" | "zh-CN" | "vi" | "id";
}
export interface IframeMessageChangeOrganization {
    type: "changeOrganization";
    // payload is the organization id
    payload: string;
}
// This message is for the situation when the child iframe want the parent window to redirect to login page
export interface IframeMessageUnauthorized {
    type: "unauthorized";
    payload: null;
}

export type IframeMessage = IframeMessageChangeLocale | IframeMessageChangeOrganization | IframeMessageUnauthorized;
