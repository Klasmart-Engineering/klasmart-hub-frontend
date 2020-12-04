import { useState } from "react";
import { Role } from "../../../models/Role";

export const useUserRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  return { roles, setRoles };
};
