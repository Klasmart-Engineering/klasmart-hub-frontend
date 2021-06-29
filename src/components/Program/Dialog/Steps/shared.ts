import { ProgramEdge } from "@/api/programs";

export interface TabContent {
    value: ProgramEdge;
    disabled?: boolean;
    onChange?: (value: ProgramEdge) => void;
}
