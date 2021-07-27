export interface EntityStepContent<T> {
    value: T;
    disabled?: boolean;
    onChange?: (value: T) => void;
}