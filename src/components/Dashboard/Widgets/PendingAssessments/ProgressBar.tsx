import { LinearProgress, Theme } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import React from "react";

type Props = {
  total: number;
  progress: number;
  color?: string;
  backgroundColor?: string;
  thickness?: number;
  width?: number;
};

export default function  ProgressBar (props: Props) {
    const {
        total,
        progress,
        color,
        backgroundColor,
        thickness = 10,
    } = props;

    const BorderLinearProgress = withStyles((theme: Theme) => ({
        root: {
            height: thickness,
            borderRadius: thickness / 2,
        },
        colorPrimary: {
            backgroundColor: backgroundColor ?? theme.palette.grey[200],
        },
        bar: {
            borderRadius: thickness / 2,
            backgroundColor: color ?? theme.palette.info.main,
        },
    }))(LinearProgress);

    return (
        <BorderLinearProgress
            variant="determinate"
            value={(progress/total) * 100} />
    );
}
