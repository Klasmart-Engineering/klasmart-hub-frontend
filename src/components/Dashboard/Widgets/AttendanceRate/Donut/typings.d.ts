export type Data = {
    label: string;
    value?: number;
    color: string;
    count?: number;
}

export type PieOptions = {
    pieSize?: number;
    radiusWidth?: number;
    cornerRadius?: number;
    padAngle?: number;
}

export type Props = {
    data: Data[];
    options: PieOptions;
}
