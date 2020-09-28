// Parameter `year` is added on to today's date
export function getExpiration(year: number): number {
    return (Date.now() + (year * 31556952000));
}
