import { Class } from "../models/Class";

export const filterClassItem = (classes: Class[]) => {
    const classArray = classes.map((classItem: Class) => ({ ...classItem }));

    return classArray;
};
