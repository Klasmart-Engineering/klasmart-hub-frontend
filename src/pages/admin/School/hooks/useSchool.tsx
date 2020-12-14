import { useState } from "react";
import { School } from "../../../../models/School";

export const useSchools = () => {
    const [schools, setSchools] = useState<School[]>([]);

    return { schools, setSchools };
};
