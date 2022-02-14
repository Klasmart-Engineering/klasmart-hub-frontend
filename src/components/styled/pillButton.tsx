import Button,
{ ButtonProps } from "@mui/material/Button";
import { withStyles } from "@mui/styles";
import React from "react";

interface Props extends ButtonProps {
    children?: React.ReactNode;
}

const PillBtn = withStyles({
    root: {
        borderRadius: 20,
    },
})(Button);

export default function PillButton (props: Props) {
    const { children, ...other } = props;

    return (
        <PillBtn {...other}>{ children }</PillBtn>
    );
}
