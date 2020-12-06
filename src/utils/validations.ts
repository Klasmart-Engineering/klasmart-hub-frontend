export function alphanumeric(name: string): boolean {
    const regularExpression = /[^a-zA-Z0-9\s]/;
    return regularExpression.test(name);
}
