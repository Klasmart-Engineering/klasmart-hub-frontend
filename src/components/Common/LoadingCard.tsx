import { Skeleton } from "@mui/material";
import React from "react";

interface LoadingCardProps {
}

const LoadingCard: React.VFC<LoadingCardProps> = (props) => {
    return (
        <div
            style={{
                padding: 32,
                width: `100%`,
                height: `100%`,
            }}
        >
            <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{
                    borderRadius: 4,
                }}
            />
        </div>
    );
};

export default LoadingCard;
