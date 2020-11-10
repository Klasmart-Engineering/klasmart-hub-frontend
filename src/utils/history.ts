import { createHashHistory } from "history";
import { useParams } from "react-router";

interface ParamTypes {
    organizationId: string;
}

export const history = createHashHistory();

export default function ParameterHOC() {
    return useParams<ParamTypes>();
}
