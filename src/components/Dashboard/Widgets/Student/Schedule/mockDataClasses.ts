import christina from "@/assets/img/teacher_christina.png";
import { ClassType } from "@/config/classTypes";

interface MockTeacher {
    givenNameKey: string;
    surnameKey: string;
    image?: string;
}

export interface MockClass {
    id: number;
    titleKey: string;
    startTime: Date;
    duration: number;
    teachers: MockTeacher[];
    type: ClassType;
}

const now = new Date();

const mockTeachers: MockTeacher[] = [
    {
        givenNameKey:`studentHome.nextClass.teacher1.givenName`,
        surnameKey: `studentHome.nextClass.teacher1.surname`,
    },
    {
        givenNameKey:`studentHome.nextClass.teacher2.givenName`,
        surnameKey: `studentHome.nextClass.teacher2.surname`,
        image: christina,
    },
];

const mockClassData: MockClass[] = [
    {
        id: 0,
        titleKey: `studentHome.mockData.lesson1.title`,
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0),
        duration: 120,
        teachers: mockTeachers,
        type: ClassType.LIVE,
    },
    {
        id: 1,
        titleKey: `studentHome.mockData.lesson2.title`,
        startTime: new Date(now.getFullYear(), now.getMonth(), (now.getDate() + 1), 8, 30, 0),
        duration: 120,
        teachers: mockTeachers,
        type: ClassType.CLASS,
    },
    {
        id: 2,
        titleKey: `studentHome.mockData.lesson3.title`,
        startTime: new Date(now.getFullYear(), now.getMonth(), (now.getDate() + 1), 11, 0, 0),
        duration: 60,
        teachers: mockTeachers,
        type: ClassType.LIVE,
    },
    {
        id: 3,
        titleKey: `studentHome.mockData.lesson4.title`,
        startTime: new Date(now.getFullYear(), now.getMonth(), (now.getDate() + 2 ), 8, 30, 0),
        duration: 30,
        teachers: mockTeachers,
        type: ClassType.LIVE,
    },
];

export default mockClassData;
