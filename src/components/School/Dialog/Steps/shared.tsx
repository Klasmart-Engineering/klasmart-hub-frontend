import { Status } from "@/types/graphQL";

export interface SchoolStepper {
    id: string;
    name: string;
    status: Status;
    shortcode: string;
    programIds: string[];
}
