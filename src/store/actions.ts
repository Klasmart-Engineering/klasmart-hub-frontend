import {
    AssessmentsMenu,
    LibraryMenu,
    LiveSessionData,
    UserAgent,
} from "../types/objectTypes";
import { Organization } from "@/types/graphQL";

export interface Action<T extends ActionTypes, P> {
    type: T;
    payload: P;
}

export type SetLocale = Action<ActionTypes.LOCALE, string>;

export type SetUserAgent = Action<ActionTypes.USER_AGENT, UserAgent>;

export type SetDarkMode = Action<ActionTypes.DARK_MODE, string>;

export type PostAuthorizationRouteAction = Action<ActionTypes.POST_AUTHORIZATION_ROUTE, string>;

export type LoginAction = Action<ActionTypes.LOGIN, {
    sessionId?: string | any;
    accountId?: string | any;
    email?: string | any;
    refreshToken?: string | any;
    refreshTokenExpire?: number | any;
    accessToken?: string | any;
    accessTokenExpire?: number | any;
} | any | undefined>;

export interface LogoutAction { type: ActionTypes.LOGOUT }

export interface AccessTokenExpiredAction { type: ActionTypes.EXPIRED_ACCESS_TOKEN }
export interface RefreshTokenExpiredAction { type: ActionTypes.EXPIRED_REFRESH_TOKEN }

export type ProductIdAction = Action<ActionTypes.PRODUCT_ID, string>;
export type PassAction = Action<ActionTypes.PASS, any>;
export type PassesAction = Action<ActionTypes.PASSES, Array<{ access: boolean; passId: string; expirationDate: number }>>;
export type SetEMailAction = Action<ActionTypes.EMAIL, string>;

export type SimulateUnstableConnection = Action<ActionTypes.SIMULATE_UNSTABLE_CONNECTION, boolean>;
export type SetFakeNonce = Action<ActionTypes.FAKE_NONCE, undefined | null | string>;

export type SignUpAction = Action<ActionTypes.SIGNUP, {
    accountId?: string | any;
} | any | undefined>;

export type RefreshSessionAction = Action<ActionTypes.REFRESH_SESSION, {
    accessToken?: string | any;
    accessTokenExpire?: number | any;
} | any | undefined>;

export type AccountIdAction = Action<ActionTypes.ACCOUNT_ID, {
    accountId?: string | any;
} | any | undefined>;

export type SetEmailAction = Action<ActionTypes.EMAIL, string>;

export interface RefreshTokenExpiredAction { type: ActionTypes.EXPIRED_REFRESH_TOKEN }

export interface AccessTokenExpiredAction { type: ActionTypes.EXPIRED_ACCESS_TOKEN }

export type DeviceIdAction = Action<ActionTypes.DEVICE_ID, string>;

export type ToggleClassSettings = Action<ActionTypes.CLASS_SETTINGS_TOGGLE, boolean>;

export type ToggleLiveClass = Action<ActionTypes.LIVE_CLASS_TOGGLE, boolean>;

export type AssessmentToken = Action<ActionTypes.ASSESSMENT_TOKEN, string>;

export type ActiveLibraryMenu = Action<ActionTypes.ACTIVE_LIBRARY_MENU, LibraryMenu>;

export type ActiveAssessmentsMenu = Action<ActionTypes.ACTIVE_ASSESSMENTS_MENU, AssessmentsMenu>;

export type ContentTypes = Action<ActionTypes.CONTENT_TYPES, string[]>;

export type PublicRange = Action<ActionTypes.PUBLIC_RANGES, string[]>;

export type SuitableAges = Action<ActionTypes.SUITABLE_AGES, string[]>;

export type Activities = Action<ActionTypes.ACTIVITIES, Array<{ id: string; title: string }>>;

export type FinishLiveData = Action<ActionTypes.FINISH_LIVE_DATA, LiveSessionData>;

export type SelectedLessonPlan = Action<ActionTypes.SELECTED_LESSON_PLAN, string>;

export type SelectedOrganization = Action<ActionTypes.SELECTED_ORGANIZATION, Organization | null>;

export type OrganizationIdStack = Action<ActionTypes.ORGANIZATION_ID_STACK, string[]>;

export type SetOpenSideNavigation = Action<ActionTypes.OPEN_SIDE_NAVIGATION, boolean | undefined>;

export enum ActionTypes {
    LOGIN,
    LOGOUT,
    SIGNUP,
    REFRESH_SESSION,
    EXPIRED_ACCESS_TOKEN,
    EXPIRED_REFRESH_TOKEN,
    ACCOUNT_ID,
    DEVICE_ID,
    POST_AUTHORIZATION_ROUTE,
    PASS,
    PRODUCT_ID,
    PASSES,
    EMAIL,
    LOCALE,
    DARK_MODE,
    LIVE_CLASS_TOGGLE,
    USER_AGENT,
    CLASS_SETTINGS_TOGGLE,
    ACTIVE_COMPONENT_HOME,
    ASSESSMENT_TOKEN,
    STUDENTS,
    ACTIVE_LIBRARY_MENU,
    ACTIVE_ASSESSMENTS_MENU,
    CONTENT_TYPES,
    PUBLIC_RANGES,
    SUITABLE_AGES,
    ACTIVITIES,
    FINISH_LIVE_DATA,
    SELECTED_LESSON_PLAN,
    SELECTED_ORGANIZATION,
    ORGANIZATION_ID_STACK,
    OPEN_SIDE_NAVIGATION,
    // Testing
    FAKE_NONCE,
    SIMULATE_UNSTABLE_CONNECTION,
}

export type Actions =
    | LoginAction
    | LogoutAction
    | SignUpAction
    | RefreshSessionAction
    | AccessTokenExpiredAction
    | RefreshTokenExpiredAction
    | DeviceIdAction
    | AccountIdAction
    | PostAuthorizationRouteAction
    | PassAction
    | ProductIdAction
    | PassesAction
    | SetEMailAction
    | SetLocale
    | SetDarkMode
    | SetUserAgent
    | SetEmailAction
    | ToggleClassSettings
    | ToggleLiveClass
    | AssessmentToken
    | ActiveLibraryMenu
    | ActiveAssessmentsMenu
    | ContentTypes
    | PublicRange
    | SuitableAges
    | Activities
    | FinishLiveData
    | SelectedLessonPlan
    | SelectedOrganization
    | OrganizationIdStack
    | SetOpenSideNavigation
    // Testing
    | SetFakeNonce
    | SimulateUnstableConnection
    | never;
