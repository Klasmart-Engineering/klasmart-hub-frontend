import { ApolloError } from "@apollo/client";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import { AccountCircle } from "@material-ui/icons";
import queryString from "querystring";
import React, { useState } from "react";
import { currentMembershipVar } from "../../../../pages/admin/kidsloop-orgadmin-fe/src/cache";

const useStyles = makeStyles((theme) =>
    createStyles({
        avatar: {
            [theme.breakpoints.up("sm")]: {
                margin: theme.spacing(0, 1),
            },
        },
        profileButton: {
            [theme.breakpoints.up("sm")]: {
                backgroundColor: "white",
                border: "1px solid #efefef",
                borderRadius: 12,
            },
        },
    }),
);

import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import KidsloopLogo from "../../../../assets/img/kidsloop.svg";
import KidsloopLogoAlt from "../../../../assets/img/kidsloop_icon.svg";
import LanguageSelect from "../../../languageSelect";
import StyledButton from "../../button";

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #dadce0",
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

/**
 * Returns function to show setting for user
 */
export default function UserSettings({
    memberships,
    loading,
    error,
}: {
    memberships: [];
    loading: boolean;
    error: ApolloError | undefined;
}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOrganization = (organization: any) => {
        setAnchorEl(null);
        currentMembershipVar({
            organization_name: organization.organization.organization_name,
            organization_id: organization.organization_id,
            organization_email: organization.organization.email,
        });
    };

    async function handleSignOut() {
        try {
            const headers = new Headers();
            headers.append("Accept", "application/json");
            headers.append("Content-Type", "application/json");
            await fetch("https://auth.kidsloop.net/signout", {
                credentials: "include",
                headers,
                method: "GET",
            })
                .then(() => {
                    const stringifiedQuery = queryString.stringify({ continue: window.location.href });
                    window.location.href = `https://auth.kidsloop.net/?${stringifiedQuery}#/`;
                });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
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
                            <img
                                alt="KidsLoop"
                                className={classes.avatar}
                                src={KidsloopLogo}
                                height={32}
                            />
                            <Avatar>
                                <AccountCircle />
                            </Avatar>
                        </Hidden>
                    </Grid>
                </Button>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {!loading && !error && memberships.map((e: any) => (
                        <ListItem
                            key={e.organization_id}
                            button
                            onClick={() => handleOrganization(e)}
                            style={{ padding: "0px 16px" }}
                        >
                            <IconButton>
                                <AccountCircle />
                            </IconButton>
                            <ListItemText
                                primary={e.organization.organization_name}
                                secondary={e.organization.phone}
                            />
                        </ListItem>
                    ))}
                    <Divider />
                    <ListItem style={{ padding: 8}}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={1}
                        >
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <LanguageSelect noIcon />
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center" }}>
                                <StyledButton
                                    extendedOnly
                                    onClick={() => handleSignOut()}
                                    // size="small"
                                    style={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #dadce0",
                                        color: "#000",
                                        padding: "8px 16px",
                                    }}
                                >
                                    Sign Out
                                </StyledButton>
                            </Grid>
                        </Grid>
                    </ListItem>
                </StyledMenu>
            </Grid>
        </>
    );
}
