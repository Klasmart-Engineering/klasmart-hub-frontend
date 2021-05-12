import UserProfileSwitcher from "./UserProfileSwitcher";
import StyledButton from "@/components/styled/button";
import {
    getAuthEndpoint,
    getCookieDomain,
} from "@/config";
import { LANGUAGES_LABEL } from "@/locale/locale";
import {
    useCurrentOrganization,
    useOrganizationStack,
} from "@/store/organizationMemberships";
import { User } from "@/types/graphQL";
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
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

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
}

export default function UserProfileMenu (props: Props) {
    const { user } = props;
    const classes = useStyles();
    const intl = useIntl();

    const [ , setOrganizationStack ] = useOrganizationStack();

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
            setOrganizationStack([]);
            await fetch(`${getAuthEndpoint()}signout`, {
                credentials: `include`,
                headers,
                method: `GET`,
            });
            const stringifiedQuery = queryString.stringify({
                continue: window.location.href,
            });
            window.location.href = `${getAuthEndpoint()}?${stringifiedQuery}#/`;
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
