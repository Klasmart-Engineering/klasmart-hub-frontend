import LanguageSelect from "./LanguageSelect";
import UserProfileSwitcher from "./UserProfileSwitcher";
import { authClient } from "@/api/auth/client";
import { useQueryMyUser } from "@/api/myUser";
import StyledButton from "@/components/styled/button";
import { LANGUAGES_LABEL } from "@/locale/locale";
import { redirectToAuth } from "@/utils/routing";
import {
    organizationMembershipStackState,
    useSetGlobalState,
} from "@kl-engineering/frontend-state";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import {
    Box,
    ButtonBase,
    Divider,
    Grid,
    List,
    ListItem,
    Popover,
    PopoverProps,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
    withStyles,
} from '@mui/styles';
import React,
{
    useMemo,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) =>
    createStyles({
        contactInfo: {
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
}

export default function UserProfileMenu (props: Props) {
    const classes = useStyles();
    const setOrganizationStack = useSetGlobalState(organizationMembershipStackState);
    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
    const { data: meData } = useQueryMyUser();

    const userName = useMemo(() => {
        const givenName = meData?.myUser.node.givenName ?? ``;
        const familyName = meData?.myUser.node.familyName ?? ``;
        const fullName = `${givenName} ${familyName}`.trim();
        const username = meData?.myUser.node.contactInfo?.username ?? ``;
        return fullName === ` ` ? username ?? `Name undefined` : fullName;
    }, [ meData ]);

    const contactInfo = useMemo(() => {
        const contactInfo = meData?.myUser.node.contactInfo;
        const username = contactInfo?.username;
        const email = contactInfo?.email;
        const phone = contactInfo?.phone;
        return username ?? email ?? phone ?? ``;
    }, [ meData ]);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        try {
            if (process.env.AUTH_LOGOUT_ROUTE_ENABLED !== `true`) {
                // TODO: ATH-722 remove AUTH_LOGOUT_ROUTE_ENABLED feature flag
                // once all environments have auth-frontend >=2.10.4 deployed
                await authClient.signOut();
            }
            setOrganizationStack([]);
            redirectToAuth();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Grid item>
            <ButtonBase
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                data-testid="profile-icon"
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
                        src={meData?.myUser.node?.avatar ?? ``}
                        size="large"
                    />
                    <Typography
                        variant="body1"
                    >
                        {userName}
                    </Typography>
                    <Typography
                        variant="body2"
                        className={classes.contactInfo}
                    >
                        {contactInfo}
                    </Typography>
                </Box>
                <UserProfileSwitcher />
                <Divider />
                <List>
                    <ListItem>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
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
                                <LanguageSelect languages={LANGUAGES_LABEL} />
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
                                    data-testid="logout-button"
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
