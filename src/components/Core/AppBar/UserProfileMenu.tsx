import CreateOrganizationDialog from "../../styled/navbar/settings/createOrganization";
import UserProfileSwitcher from "./UserProfileSwitcher";
import { currentMembershipVar } from "@/cache";
import StyledButton from "@/components/styled/button";
import {
    getAuthEndpoint,
    getCookieDomain,
} from "@/config";
import { LANGUAGES_LABEL } from "@/locale/locale";
import { User } from "@/types/graphQL";
import {
    ApolloError,
    useReactiveVar,
} from "@apollo/client";
import {
    Box,
    ButtonBase,
    createStyles,
    Divider,
    Grid,
    List,
    ListItem,
    makeStyles,
    Popover,
    PopoverProps,
    Typography,
    withStyles,
} from "@material-ui/core";
import {
    LanguageSelect,
    UserAvatar,
} from "kidsloop-px";
import queryString from "querystring";
import React,
{
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) =>
    createStyles({
        userEmail: {
            color: theme.palette.grey[600],
        },
        userProfileMenu: {
            borderRadius: `50%`,
        },
    }));

const StyledMenu = withStyles({
    paper: {
        border: `1px solid #dadce0`,
    },
})((props: PopoverProps) => (
    <Popover
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: `bottom`,
            horizontal: `right`,
        }}
        transformOrigin={{
            vertical: `top`,
            horizontal: `right`,
        }}
        {...props}
    />
));

interface Props {
    user?: User | null;
    loading: boolean;
    error?: ApolloError;
}

export default function UserProfileMenu (props: Props) {
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

    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
    const [ userName, setUserName ] = useState<string>(``);

    useEffect(() => {
        if (user) {
            const givenName = user.given_name ?? ``;
            const familyName = user.family_name ?? ``;
            const fullName = givenName + ` ` + familyName;
            const username = user.username ?? ``;
            setUserName(fullName === ` ` ? username ?? `Name undefined` : fullName);
        }
    }, [ user ]);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    async function handleSignOut () {
        try {
            const headers = new Headers();
            headers.append(`Accept`, `application/json`);
            headers.append(`Content-Type`, `application/json`);
            await fetch(`${getAuthEndpoint()}signout`, {
                credentials: `include`,
                headers,
                method: `GET`,
            })
                .then(() => {
                    const stringifiedQuery = queryString.stringify({
                        continue: window.location.href,
                    });
                    window.location.href = `${getAuthEndpoint()}?${stringifiedQuery}#/`;
                });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Grid item>
            <ButtonBase
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                className={classes.userProfileMenu}
                onClick={handleMenu}
            >
                <UserAvatar name={userName} />
            </ButtonBase>
            <StyledMenu
                keepMounted
                id="customized-menu"
                anchorEl={anchorEl}
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
                    <UserAvatar
                        name={userName ?? ``}
                        src={user?.avatar ?? ``}
                        size="large"
                    />
                    <Typography
                        variant="body1"
                    >
                        {userName}
                    </Typography>
                    <Typography
                        variant="body2"
                        className={classes.userEmail}
                    >
                        {user?.email ?? user?.phone}
                    </Typography>
                </Box>
                {!loading && !error && isEmptyMembership === `` &&
                    <ListItem>
                        <CreateOrganizationDialog />
                    </ListItem>
                }
                <UserProfileSwitcher />
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
                                style={{
                                    textAlign: `center`,
                                }}
                            >
                                <LanguageSelect
                                    cookieDomain={getCookieDomain()}
                                    languages={LANGUAGES_LABEL} />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                style={{
                                    textAlign: `center`,
                                }}
                            >
                                <StyledButton
                                    extendedOnly
                                    style={{
                                        backgroundColor: `#fff`,
                                        border: `1px solid #dadce0`,
                                        color: `#000`,
                                        padding: `8px 16px`,
                                    }}
                                    onClick={() => handleSignOut()}
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
