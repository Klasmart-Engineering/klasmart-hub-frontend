import { ApolloError } from "@apollo/client";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
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

import KidsloopLogo from "../../../../assets/img/kidsloop.svg";
import KidsloopLogoAlt from "../../../../assets/img/kidsloop_icon.svg";

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #d3d4d5",
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
                                alt="Avatar"
                                className={classes.avatar}
                                src="https://robohash.org/4f06737c469a78aa3e425072a049fe8e?set=set4&bgset=&size=400x400"
                                height={32}
                            />
                            <img
                                alt="KidsLoop"
                                className={classes.avatar}
                                src={KidsloopLogoAlt}
                                height={32}
                            />
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
                            <img
                                alt="KidsLoop"
                                className={classes.avatar}
                                src="https://robohash.org/4f06737c469a78aa3e425072a049fe8e?set=set4&bgset=&size=400x400"
                                height={32}
                            />
                            <ListItemText
                                primary={e.organization.organization_name}
                                secondary={e.organization.phone}
                            />
                        </ListItem>
                    ))}
                </StyledMenu>
            </Grid>
        </>
    );
}
