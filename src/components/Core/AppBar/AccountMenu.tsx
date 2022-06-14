import LanguageSelect from "./LanguageSelect";
import { authClient } from "@/api/auth/client";
import { useQueryMyUser } from "@/api/myUser";
import { LANGUAGES_LABEL } from "@/locale/config";
import { redirectToAuth } from "@/utils/routing";
import {
    organizationMembershipStackState,
    useSetGlobalState,
} from "@kl-engineering/frontend-state";
import {
    Button,
    UserAvatar,
    validations,
} from "@kl-engineering/kidsloop-px";
import {
    Box,
    ButtonBase,
    Grid,
    List,
    ListItem,
    Popover,
    PopoverProps,
    Typography,
    useTheme,
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
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) =>
    createStyles({
        userProfileMenuButton: {
            padding: theme.spacing(1),
        },
        contactInfo: {
            color: theme.palette.grey[600],
            display: `-webkit-box`,
            overflow: `hidden`,
            wordBreak: `break-all`,
            textOverflow: `ellipsis`,
            boxOrient: `vertical`,
            lineClamp: 2,
        },
        signOutButton: {
            border: `1px solid #dadce0`,
            padding: theme.spacing(0.75, 1.5),
        },
    }));

const StyledMenu = withStyles((theme) => ({
    paper: {
        border: `1px solid #dadce0`,
        borderRadius: theme.spacing(1.25),
        width: 256,
    },
}))((props: PopoverProps) => (
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
    const theme = useTheme();
    const intl = useIntl();
    const setOrganizationStack = useSetGlobalState(organizationMembershipStackState);
    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
    const { data: meData } = useQueryMyUser();

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

    const emailUserName = contactInfo.split(`@`)[0]?.split(/[^\w]/g)
        .join(` `);

    const hasPhoneMainContactInfo = validations.phone(`Invalid phone error message`)(contactInfo) === true;

    return (
        <Grid item>
            <ButtonBase
                disableRipple
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                data-testid="profile-icon"
                className={classes.userProfileMenuButton}
                onClick={handleMenu}
            >
                <UserAvatar
                    size="small"
                    name={hasPhoneMainContactInfo ? `` : emailUserName}
                    src={meData?.myUser.node?.avatar ?? ``}
                    color={hasPhoneMainContactInfo ? theme.palette.primary.main : undefined}
                />
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
                    flexDirection="row"
                    alignItems="center"
                    pt={2}
                    px={2}
                    pb={1}
                    gap={1}
                    tabIndex={undefined}
                >
                    <UserAvatar
                        size="medium"
                        name={hasPhoneMainContactInfo ? `` : emailUserName}
                        src={meData?.myUser.node?.avatar ?? ``}
                        color={hasPhoneMainContactInfo ? theme.palette.primary.main : undefined}
                    />
                    <Typography
                        variant="body2"
                        className={classes.contactInfo}
                    >
                        {contactInfo}
                    </Typography>
                </Box>
                <List
                    sx={{
                        paddingTop: 0,
                    }}
                >
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
                                <Button
                                    fullWidth
                                    size="small"
                                    label={intl.formatMessage({
                                        id: `userSettings_signout`,
                                    })}
                                    variant="outlined"
                                    data-testid="logout-button"
                                    className={classes.signOutButton}
                                    onClick={() => handleSignOut()}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                style={{
                                    textAlign: `center`,
                                }}
                            >
                                <LanguageSelect languages={LANGUAGES_LABEL} />
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
            </StyledMenu>
        </Grid>
    );
}
