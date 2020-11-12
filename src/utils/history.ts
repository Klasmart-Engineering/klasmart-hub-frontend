import { createHashHistory } from "history";
import { useParams } from "react-router";

interface ParamTypes {
    organizationId?: string;
    classId?: string;
}

export const history = createHashHistory();

export function ParameterHOC() {
    return useParams<ParamTypes>();
}
