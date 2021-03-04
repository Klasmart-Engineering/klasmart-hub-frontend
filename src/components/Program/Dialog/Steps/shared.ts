import { Program } from "@/types/graphQL";

export interface TabContent {
    value: Program;
    disabled?: boolean;
    onChange?: (value: Program) => void;
}
