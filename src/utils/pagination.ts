export interface PaginationFilter<T> {
    OR?: T[];
    AND?: T[];
}

export function isUuid (uuid: string): boolean {
    const regularExpression = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regularExpression.test(uuid.trim());
}
