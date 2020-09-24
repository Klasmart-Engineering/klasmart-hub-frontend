import React from "react";

interface Props {
    center?: boolean;
    children?: React.ReactNode;
    className?: string;
    verticalCenter?: boolean;
    style?: React.CSSProperties;
}

export default function CenterAlignChildren(props: Props) {
    const { center, children,  className, verticalCenter, ...other } = props;

    return (
        <span
            style={{
                alignItems: "center",
                display: "flex",
                flexDirection: verticalCenter ? "column" : "row",
                justifyContent: center ? "center" : "normal",
            }}
            className={className} {...other}
        >
            { children || null}
        </span>
    );
}
