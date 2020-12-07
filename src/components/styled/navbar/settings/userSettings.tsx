import { ApolloError, useReactiveVar } from "@apollo/client";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { PopoverProps } from "@material-ui/core/Popover";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import {
    Business as BusinessIcon,
    Person as PersonIcon
} from "@material-ui/icons";
import queryString from "querystring";
import React, { useState } from "react";
import { currentMembershipVar } from "../../../../cache";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import KidsloopLogo from "../../../../assets/img/kidsloop.svg";
import LanguageSelect from "../../../languageSelect";
import StyledButton from "../../button";
import { User } from "../../../../types/graphQL";
import { Box, List, ListItemAvatar, Popover } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) =>
    createStyles({
        avatar: {
            [theme.breakpoints.up("sm")]: {
                margin: theme.spacing(0, 1),
            },
        },
        avatarLarge: {
            width: theme.spacing(10),
            height: theme.spacing(10),
            marginBottom: theme.spacing(1),
        },
        userEmail: {
            color: theme.palette.grey[600]
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

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #dadce0",
    },
})((props: PopoverProps) => (
    <Popover
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        {...props}
    />
));

interface Props {
    user?: User | null
    loading: boolean
    error?: ApolloError
}

/**
 * Returns function to show setting for user
 */
export default function UserSettings(props: Props) {
    const {
        user,
        loading,
        error,
    } = props;
    const classes = useStyles();
    const selectedOrganizationMeta = useReactiveVar(currentMembershipVar);
    const selectedOrganization = user?.memberships?.find((membership) => membership.organization_id === selectedOrganizationMeta.organization_id)?.organization;
    const otherAvailableOrganizations = user?.memberships?.filter((membership) => membership.organization_id !== selectedOrganization?.organization_id);
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
                        <Avatar src={user?.avatar ?? ""}>
                            <PersonIcon />
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
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    pt={2}
                    px={2}
                    pb={1}
                    tabIndex={undefined}
                >
                    <Avatar
                        src={user?.avatar ?? ""}
                        className={classes.avatarLarge}
                    >
                        <PersonIcon fontSize="large" />
                    </Avatar>
                    <Typography
                        variant="body1"
                    >
                        {user?.user_name}
                    </Typography>
                    <Typography
                        variant="body2"
                        className={classes.userEmail}
                    >
                        {user?.email}
                    </Typography>
                </Box>
                {!loading && !error && selectedOrganization && <List dense>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar variant="rounded">
                                <BusinessIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={selectedOrganization?.organization_name}
                            secondary={selectedOrganization?.owner?.email}
                        />
                    </ListItem>
                </List>}
                {!loading && !error && (otherAvailableOrganizations?.length ?? 0) > 0 && <>
                    <Divider />
                    <List dense>
                        {otherAvailableOrganizations?.map((membership) =>
                            <ListItem
                                key={membership.organization_id}
                                button
                                onClick={() => handleOrganization(membership)}
                            >
                                <ListItemAvatar>
                                    <Avatar variant="rounded">
                                        <BusinessIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={membership?.organization?.organization_name}
                                    secondary={membership?.organization?.owner?.email}
                                />
                            </ListItem>
                            )}
                    </List>
                </>}
                <Divider />
                <List>
                    <ListItem>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={1}
                        >
                            <Grid
                                item
                                xs={12}
                                style={{ textAlign: "center" }}
                            >
                                <LanguageSelect />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                style={{ textAlign: "center" }}
                            >
                                <StyledButton
                                    extendedOnly
                                    onClick={() => handleSignOut()}
                                    style={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #dadce0",
                                        color: "#000",
                                        padding: "8px 16px",
                                    }}
                                >
                                    <FormattedMessage id="userSettings_signout" />
                                </StyledButton>
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
            </StyledMenu>
        </Grid>
    );
}
