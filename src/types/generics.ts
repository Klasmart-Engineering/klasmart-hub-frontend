export type PickRequired<T, K extends keyof T> = {
    [P in K]-?: NonNullable<T[P]>
}
