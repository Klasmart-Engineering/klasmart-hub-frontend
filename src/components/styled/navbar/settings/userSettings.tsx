import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";

import { useRestAPI } from "../../../../api/restapi";

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
    const history = useHistory();
    const api = useRestAPI();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [logoutInFlight, setLogoutInFlight] = useState(false);
    const open = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    async function logout() {
        if (logoutInFlight) { return; }
        try {
            setLogoutInFlight(true);
            await api.endSession();
            history.push("/login");
        } catch (e) {
            alert(e);
        } finally {
            // setLogoutInFlight(false);
        }
    }

    return (<>
        <Grid item>
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
        </Grid>
        <StyledMenu
            id="menu-appbar"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
        >
            <Tooltip title="Profile Coming Soon" placement="bottom">
                <MenuItem onClick={handleClose}>
                    <FormattedMessage id="userSettings_profile" />
                </MenuItem>
            </Tooltip>
            <Tooltip title="My account Coming Soon" placement="bottom">
                <MenuItem onClick={handleClose}>
                    <FormattedMessage id="userSettings_myAccount" />
                </MenuItem>
            </Tooltip>
            <Divider />
            <MenuItem onClick={logout}>
                <FormattedMessage id="userSettings_signout" />
            </MenuItem>
        </StyledMenu>
    </>);
}
