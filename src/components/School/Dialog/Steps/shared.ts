import { School } from "@/types/graphQL";

export interface TabContent {
    value?: SchoolState;
    programIds?: string[];
    disabled?: boolean;
    onChange?: (value: School) => void;
    onProgramIdsChange?: (value: string[]) => void;
}

export interface SchoolState extends School {
    programIds: string[];
}
