import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../../store/store";

import CalmIslandLogo from "../../../../assets/img/calmisland_logo.png";
import KidsloopLogo from "../../../../assets/img/kidsloop.svg";
import KidsloopLogoAlt from "../../../../assets/img/kidsloop_icon.svg";

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #0E78D5",
    },
})((props: MenuProps) => (
    <Menu
        elevation={1}
        getContentAnchorEl={null}
        anchorOrigin={{
            horizontal: "center",
            vertical: "bottom",
        }}
        transformOrigin={{
            horizontal: "center",
            vertical: "top",
        }}
        {...props}
    />
));

const useStyles = makeStyles((theme) => createStyles({
    avatar: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(0, 1),
        },
    },
    profileButton: {
        backgroundColor: "white",
        border: "1px solid #efefef",
        borderRadius: 12,
    },
}));

export default function UserSettings() {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Grid item>
                <Tooltip title="Account Settings Coming Soon" placement="bottom">
                    <Button
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        className={classes.profileButton}
                        fullWidth

                        onClick={handleMenu}
                    >
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            style={{ flexWrap: "nowrap" }}
                        >
                            <Hidden xsDown>
                                <img className={classes.avatar} src={KidsloopLogo} height={32} />
                            </Hidden>
                            <Hidden smUp>
                                <img className={classes.avatar} src={KidsloopLogoAlt} height={32} />
                            </Hidden>
                        </Grid>
                    </Button>
                </Tooltip>
            </Grid>
            {/* <StyledMenu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
            </StyledMenu> */}
        </>
    );
}
