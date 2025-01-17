import SendIcon from "@mui/icons-material/Send";
import Button,
{ ButtonProps } from "@mui/material/Button";
import Hidden from "@mui/material/Hidden";
import withStyles from '@mui/styles/withStyles';
import React from "react";

interface Props extends ButtonProps {
    children?: React.ReactNode;
    className?: string;
    extendedOnly?: boolean;
}

const StyledBtn = withStyles({
    root: {
        "&:hover": {
            "-webkit-transition": `all .4s ease`,
            background: `#1B365D`,
            "box-shadow": `0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)`,
            transform: `translateY(-2px)`,
            transition: `all .4s ease`,
        },
        background: `#0E78D5`,
        borderRadius: 12,
        color: `white`,

    },
})(Button);

export default function StyledButton (props: Props) {
    const {
        children,
        extendedOnly,
        ...other
    } = props;

    let sibling: React.ReactNode;
    React.Children.map(children, (child) => (
        typeof child !== `string` ? sibling = child : {}
    ));

    return extendedOnly ?
        <StyledBtn
            style={{
                minWidth: 120,
            }}
            {...other}>
            { children || <SendIcon />}
        </StyledBtn> :
        <>
            <Hidden xlDown>
                <StyledBtn
                    style={{
                        minWidth: 120,
                    }}
                    {...other}>
                    { children || <SendIcon />}
                </StyledBtn>
            </Hidden>
            <Hidden mdUp>
                <StyledBtn
                    style={{
                        minWidth: 80,
                    }}
                    {...other}>
                    { sibling || <SendIcon /> }
                </StyledBtn>
            </Hidden>
        </>;
}
