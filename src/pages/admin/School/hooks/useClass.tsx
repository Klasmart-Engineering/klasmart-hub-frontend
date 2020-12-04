import { useState } from "react";
import { Class } from "../../../models/Class";

export const useClasses = () => {
  const [classesData, setClasses] = useState<Class[]>([]);

  return { classesData, setClasses };
};
