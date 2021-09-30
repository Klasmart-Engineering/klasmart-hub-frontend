import { TeacherFeedbackRow } from "@/components/HomeCard/TeacherFeedback/Table";

export const feedback = `The new component should work.`;
export const mockFeedback: TeacherFeedbackRow = {
    id: `614b61b3f87c364b2685ac34`,
    title: `Test Feedback`,
    type: `study`,
    score: 3,
    teacherName: `Mister Teacher`,
    teacherAvatar: ``,
    feedback,
    files: [],
};

export const mockHomeCardData = {
    list: [
        {
            complete_at: 1632335013,
            create_at: 1632334946,
            id: `614b7462eb1e5cdc4fb0ac48`,
            score: 3,
            status: `complete`,
            title: `Testing Fun`,
            update_at: 1632334946,
            schedule: {
                attachment: {
                    id: ``,
                    name: ``,
                },
                id: `614b73cef87c364b2685ae9e`,
                title: `Testing Fun`,
                type: `Homework`,
            },
            student_attachments: [],
            teacher_comments: [
                {
                    comment: `This was excellent.`,
                    teacher: {
                        avatar: ``,
                        family_name: `Rooney`,
                        given_name: `Tom`,
                        id: `acbd5f9d-45d0-4c79-9ea4-eb06c6352583`,
                    },
                },
            ],
        },
        {
            complete_at: 1632335013,
            create_at: 1632334946,
            id: `614b7462eb1e5cdc4fb0ac99`,
            score: 4,
            status: `complete`,
            title: `Test 12345`,
            update_at: 1632334946,
            schedule: {
                attachment: {
                    id: ``,
                    name: ``,
                },
                id: `614b73cef87c364b2685ae9e`,
                title: `Another feedback`,
                type: `Homework`,
            },
            student_attachments: [],
            teacher_comments: [
                {
                    comment: `The task was ok.`,
                    teacher: {
                        avatar: ``,
                        family_name: `Rooney`,
                        given_name: `Tom`,
                        id: `acbd5f9d-45d0-4c79-9ea4-eb06c6352583`,
                    },
                },
            ],
        },
    ],
    total: 2,
};
