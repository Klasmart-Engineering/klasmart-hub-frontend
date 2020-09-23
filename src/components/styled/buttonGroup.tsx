import Button, { ButtonProps } from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Hidden from "@material-ui/core/Hidden";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { withStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import SendIcon from "@material-ui/icons/Send";
import React, { useRef, useState } from "react";
import StyledButton from "./button";

interface Props extends ButtonProps {
    ariaLabel?: string;
    children?: React.ReactNode;
    className?: string;
    extendedOnly?: boolean;
    options: string[];
}

const StyledBtnGroup = withStyles({
    root: {
        "&:hover": {
            "-webkit-transition": "all .4s ease",
            "background": "#1B365D",
            "box-shadow": "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
            "transform": "translateY(-2px)",
            "transition": "all .4s ease",
        },
        "background": "#0E78D5",
        "borderRadius": 12,
        "color": "white",
    },
})(ButtonGroup);

export default function StyledButtonGroup(props: Props) {
    const {ariaLabel, children, extendedOnly, options, ...other } = props;

    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) { return; }
        setOpen(false);
    };

    return (
        <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
                <StyledBtnGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                    <StyledButton extendedOnly>{options[selectedIndex]}</StyledButton>
                    <StyledButton
                        color="primary"
                        size="small"
                        aria-controls={open ? "split-button-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-label={ariaLabel}
                        aria-haspopup="menu"
                        onClick={handleToggle}
                        style={{ minWidth: 0 }}
                    >
                        <ArrowDropDownIcon />
                    </StyledButton>
                </StyledBtnGroup>
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu">
                                        {options.map((option, index) => (
                                            <MenuItem
                                                key={option}
                                                selected={index === selectedIndex}
                                                onClick={(event) => handleMenuItemClick(event, index)}
                                            >
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Grid>
        </Grid>
    );
}
