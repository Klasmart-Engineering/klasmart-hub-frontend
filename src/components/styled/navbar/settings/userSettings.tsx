import { ApolloError, useReactiveVar } from "@apollo/client";
import { Box, List, ListItemAvatar, Popover, Tooltip } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { PopoverProps } from "@material-ui/core/Popover";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
    Business as BusinessIcon,
    Person as PersonIcon,
} from "@material-ui/icons";
import { Loading, utils } from "kidsloop-px";
import queryString from "querystring";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { currentMembershipVar } from "../../../../cache";
import { User } from "../../../../types/graphQL";
import { getHighestRole } from "../../../../utils/userRoles";
import { getAuthEndpoint, getCookieDomain } from "../../../../config";
import { LanguageSelect } from "kidsloop-px";
import StyledButton from "../../button";
import CreateOrganizationDialog from "./createOrganization";
import { LANGUAGES_LABEL } from "@/locale/locale";

const useStyles = makeStyles((theme) =>
    createStyles({
        logo: {
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
            color: theme.palette.grey[600],
        },
        profileButton: {
            backgroundColor: "white",
            border: "1px solid #efefef",
            borderRadius: 12,
            padding: theme.spacing(1, 2),
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
    user?: User | null;
    loading: boolean;
    error?: ApolloError;
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
    const selectedMembershipOrganization = user?.memberships?.find((membership) => membership.organization_id === selectedOrganizationMeta.organization_id);
    const otherAvailableOrganizations = user?.memberships?.filter((membership) => membership.organization_id !== selectedMembershipOrganization?.organization_id);
    const isEmptyMembership = Object.values(selectedOrganizationMeta).reduce((str, element) => str + element);

    const userNameColor = utils.stringToHslColor(user?.user_name ?? "??");
    const userNameInitials = utils.nameToInitials(user?.user_name ?? "??", 3);
    const selectedOrganizationColor = utils.stringToHslColor(selectedMembershipOrganization?.organization?.organization_name ?? "??");
    const selectedOrganizationInitials = utils.nameToInitials(selectedMembershipOrganization?.organization?.organization_name ?? "??", 4);
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
            await fetch(`${getAuthEndpoint()}signout`, {
                credentials: "include",
                headers,
                method: "GET",
            })
                .then(() => {
                    const stringifiedQuery = queryString.stringify({ continue: window.location.href });
                    window.location.href = `${getAuthEndpoint()}?${stringifiedQuery}#/`;
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
                    <Tooltip
                        aria-label="organization name"
                        title={selectedMembershipOrganization?.organization?.organization_name || "Loading..." }
                        placement="bottom"
                    >
                        <Avatar
                            variant="rounded"
                            style={{
                                color: "white",
                                backgroundColor: selectedOrganizationColor,
                            }}>
                            <Typography variant="caption">
                                {selectedMembershipOrganization?.organization?.organization_name
                                    ? selectedOrganizationInitials
                                    : <BusinessIcon />
                                }
                            </Typography>
                        </Avatar>
                    </Tooltip>
                    <Avatar
                        src={user?.avatar ?? ""}
                        style={{
                            color: "white",
                            backgroundColor: userNameColor,
                            marginLeft: 16,
                        }}>
                        <Typography variant="body1">
                            {user?.user_name
                                ? userNameInitials
                                : <PersonIcon />
                            }
                        </Typography>
                    </Avatar>
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
                        style={{
                            color: "white",
                            backgroundColor: userNameColor,
                        }}
                    >
                        <Typography variant="h5">
                            {user?.user_name
                                ? userNameInitials
                                : <PersonIcon />
                            }
                        </Typography>
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
                        {user?.email ?? user?.phone}
                    </Typography>
                </Box>
                {!loading && !error && isEmptyMembership === "" &&
                    <ListItem>
                        <CreateOrganizationDialog />
                    </ListItem>
                }
                {!loading && !error && selectedMembershipOrganization && <List dense>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar
                                variant="rounded"
                                style={{
                                    color: "white",
                                    backgroundColor: selectedOrganizationColor,
                                }}
                            >
                                <Typography variant="caption">
                                    {selectedMembershipOrganization?.organization?.organization_name
                                        ? selectedOrganizationInitials
                                        : <BusinessIcon />
                                    }
                                </Typography>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={selectedMembershipOrganization?.organization?.organization_name}
                            secondary={getHighestRole(selectedMembershipOrganization?.roles) ?? "Unknown"}
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
                                    <Avatar
                                        variant="rounded"
                                        style={{
                                            color: "white",
                                            backgroundColor: utils.stringToHslColor(membership?.organization?.organization_name ?? "??"),
                                        }}
                                    >
                                        <Typography variant="caption">
                                            {membership?.organization?.organization_name
                                                ? utils.nameToInitials(membership?.organization?.organization_name ?? "??", 4)
                                                : <BusinessIcon />
                                            }
                                        </Typography>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={membership?.organization?.organization_name}
                                    secondary={getHighestRole(membership?.roles) ?? "Unknown"}
                                />
                            </ListItem>,
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
                                <LanguageSelect cookieDomain={getCookieDomain()} languages={LANGUAGES_LABEL} />
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
