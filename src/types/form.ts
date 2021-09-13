import { APIErrorDetails } from "@/api/errors";

export type FormErrors<T> = {
    [P in keyof T]?: Pick<APIErrorDetails, "code" | "message">
}
