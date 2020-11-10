export interface UserAgent {
  isMobile: boolean;
  isIOS: boolean;
  isIE: boolean;
  isEdge: boolean;
  isLandscape?: boolean;
}

export interface MenuItem {
  description: string;
  link: string;
  logo: JSX.Element;
  title: string;
}

export interface ContentItem {
  published: boolean;
  contentId: string;
  description: string;
  link: string;
  image: string;
  title: string;
  type?: "lesson-plan" | "lesson-material" | undefined;
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
  [attr: string]: ColumnAttr,
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
