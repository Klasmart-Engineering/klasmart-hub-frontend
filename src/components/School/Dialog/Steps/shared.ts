import { School } from "@/types/graphQL";

export interface TabContent {
    value: School;
    disabled?: boolean;
    onChange?: (value: School) => void;
}
