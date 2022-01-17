import { ContentTeacherFormatted } from "@/components/Dashboard/models/data.model";
import { ContentTeacherResponse } from "@kidsloop/reports-api-client";

enum ContentType {
    DRAFT = `draft`,
    APPROVED = `approved`,
    PENDING = `pending`,
    REJECTED = `rejected`,
    TOTAL = `total`
}

export default function contentStatusDataFormatter (data: ContentTeacherResponse): ContentTeacherFormatted {
    return {
        [ContentType.DRAFT]: data?.info?.draft || 0,
        [ContentType.APPROVED]: data?.info?.published || 0,
        [ContentType.PENDING]: data?.info?.pending || 0,
        [ContentType.REJECTED]: data?.info?.rejected || 0,
        [ContentType.TOTAL]: data?.info?.total || 0,
    };
}
