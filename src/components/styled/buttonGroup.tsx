import StyledButton from "./button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SendIcon from "@mui/icons-material/Send";
import Button,
{ ButtonProps } from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import Hidden from "@mui/material/Hidden";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { Theme } from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import React,
{
    useRef,
    useState,
} from "react";
import { isMobileSafari } from "react-device-detect";

interface Props extends ButtonProps {
    ariaLabel?: string;
    children?: React.ReactNode;
    className?: string;
    extendedOnly?: boolean;
    options: Array<{ action?: () => void; disabled: boolean; label: string }>;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        popover: {
            "& *": {
                touchAction: `auto !important`,
            },
        },
    }));

const StyledBtnGroup = withStyles({
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
})(ButtonGroup);

export default function StyledButtonGroup (props: Props) {
    const {
        ariaLabel,
        children,
        extendedOnly,
        options,
        ...other
    } = props;
    const classes = useStyles();

    const [ open, setOpen ] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const [ selectedIndex, setSelectedIndex ] = useState(0);

    const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) { return; }
        setOpen(false);
    };

    return (
        <Grid
            container
            direction="column"
            alignItems="center">
            <Grid
                item
                xs={12}>
                { !isMobileSafari ?
                    <>
                        <StyledBtnGroup
                            ref={anchorRef}
                            variant="contained"
                            color="primary"
                            aria-label="split button">
                            <StyledButton
                                extendedOnly
                                disabled={options[selectedIndex].disabled}
                                onClick={options[selectedIndex].action}
                            >
                                {options[selectedIndex].label}&nbsp;{options[selectedIndex].disabled ? <sub>(Coming Soon)</sub> : ``}
                            </StyledButton>
                            <StyledButton
                                color="primary"
                                size="small"
                                aria-controls={open ? `split-button-menu` : undefined}
                                aria-expanded={open ? `true` : undefined}
                                aria-label={ariaLabel}
                                aria-haspopup="menu"
                                style={{
                                    minWidth: 0,
                                }}
                                onClick={handleToggle}
                            >
                                <ArrowDropDownIcon />
                            </StyledButton>
                        </StyledBtnGroup>
                        <Popper
                            transition
                            disablePortal
                            open={open}
                            anchorEl={anchorRef.current}
                            className={classes.popover}
                            role={undefined}>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin: placement === `bottom` ? `center top` : `center bottom`,
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList id="split-button-menu">
                                                {options.map((option, index) => (
                                                    <MenuItem
                                                        key={option.label}
                                                        disabled={option.disabled === true}
                                                        selected={index === selectedIndex}
                                                        onClick={(event) => handleMenuItemClick(event, index)}
                                                    >
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </> :
                    <Grid
                        container
                        spacing={1}>
                        <Grid item>
                            <StyledButton
                                extendedOnly
                                disabled={options[0].disabled}
                                onClick={options[0].action}
                            >
                                {options[0].label}&nbsp;{options[0].disabled ? <sub>(Coming Soon)</sub> : ``}
                            </StyledButton>
                        </Grid>
                        <Grid item>
                            <StyledButton
                                extendedOnly
                                disabled={options[1].disabled}
                                onClick={options[1].action}
                            >
                                {options[1].label}&nbsp;{options[1].disabled ? <sub>(Coming Soon)</sub> : ``}
                            </StyledButton>
                        </Grid>
                    </Grid>
                }
            </Grid>
        </Grid>
    );
}
