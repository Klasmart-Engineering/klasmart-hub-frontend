import { useState } from "react";
import { School } from "../../../models/UserSchool";

export const useSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);

  return { schools, setSchools };
};
