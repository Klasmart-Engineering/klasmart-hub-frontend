import { School } from "../models/School";

export const filterSchoolItem = (schools: School[]) => {
  const schoolArray = schools.map((schoolItem: School) => ({ ...schoolItem }));

  return schoolArray;
};
