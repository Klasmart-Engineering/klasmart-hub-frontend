import KidsloopLogo from "@/assets/img/kidsloop.svg";
import UserProfileMenu from "@/components/Core/AppBar/AccountMenu";
import { useIsMobileTabletScreen } from "@/layout/utils";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    isSideNavigationDrawerMiniVariantState,
    sideNavigationDrawerOpenState,
} from "@/store/site";
import {
    useGlobalState,
    useSetGlobalState,
} from "@kl-engineering/frontend-state";
import {
    IconButton,
    OrganizationAvatar,
} from "@kl-engineering/kidsloop-px";
import { Menu as MenuIcon } from "@mui/icons-material";
import {
    AppBar,
    Box,
    ButtonBase,
    Grid,
    Theme,
    Toolbar as AppToolbar,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => createStyles({
    menuButton: {
        marginRight: theme.spacing(1.5),
        color: `black`,
    },
    safeArea: {
        paddingLeft: `env(safe-area-inset-left)`,
        paddingRight: `env(safe-area-inset-right)`,
        zIndex: theme.zIndex.drawer - 1,
    },
    appBar: {
        transition: theme.transitions.create([ `margin`, `width` ], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        transition: theme.transitions.create([ `margin`, `width` ], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
}));

interface Props {
    isMiniVariant?: boolean;
}

export default function Toolbar (props: Props) {
    const [ navigationDrawerOpen, setNavigationDrawerOpen ] = useGlobalState(sideNavigationDrawerOpenState);

    const setIsSideNavigationDrawerMiniVariant = useSetGlobalState(isSideNavigationDrawerMiniVariantState);
    const currentOrganization = useCurrentOrganization();
    const isSmallScreen = useIsMobileTabletScreen();
    const classes = useStyles();

    const handleOnMenuButtonClick = () => {
        if (isSmallScreen) {
            setNavigationDrawerOpen((open) => !open);
            return;
        }
        setIsSideNavigationDrawerMiniVariant((isMiniVariant) => !isMiniVariant);
    };

    return (
        <AppBar
            color="primary"
            position="sticky"
            className={clsx(classes.safeArea, classes.appBar, {
                [classes.appBarShift]: navigationDrawerOpen !== false,
            })}
        >
            <AppToolbar>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        minHeight: 50,
                    }}
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        flexWrap="nowrap"
                    >
                        <IconButton
                            className={classes.menuButton}
                            icon={MenuIcon}
                            size="medium"
                            onClick={handleOnMenuButtonClick}
                        />
                        <ButtonBase
                            sx={{
                                borderRadius: 1,
                            }}
                            component={Link}
                            to="/"
                        >
                            {currentOrganization?.branding.iconImageURL
                                ? (
                                    <OrganizationAvatar
                                        size="small"
                                        name={currentOrganization?.name ?? ``}
                                        src={currentOrganization?.branding.iconImageURL ?? ``}
                                        color={currentOrganization?.branding.primaryColor ?? undefined}
                                    />
                                )
                                : (
                                    <img
                                        alt="KidsLoop Logo - Home"
                                        src={KidsloopLogo}
                                        height="30"
                                    />
                                )}
                        </ButtonBase>
                    </Box>
                    {!props.isMiniVariant && (
                        <Box display="flex">
                            <UserProfileMenu />
                        </Box>
                    )}
                </Grid>
            </AppToolbar>
        </AppBar>
    );
}
