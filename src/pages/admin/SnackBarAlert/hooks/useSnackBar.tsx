import { useState } from "react";

export const useSeverityBar = () => {
    const [severityBar, setSeverityBar] = useState("");

    return { severityBar, setSeverityBar };
};
