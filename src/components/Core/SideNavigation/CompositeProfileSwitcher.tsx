import CompositeProfileMenu from "./CompositeSelectionMenu";
import { useQueryMyUser } from "@/api/myUser";
import { useIsMobileTabletScreen } from "@/layout/utils";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { sideNavigationDrawerOpenState } from "@/store/site";
import {
    getHighestRole,
    roleNameTranslations,
} from "@/utils/userRoles";
import { useSetGlobalState } from "@kl-engineering/frontend-state";
import {
    UserAvatar,
    utils,
} from "@kl-engineering/kidsloop-px";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import {
    ButtonBase,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    useTheme,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import {
    useCallback,
    useMemo,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
        height: 120,
        display: `flex`,
        flexDirection: `column`,
        flexGrow: 0,
        flexShrink: 0,
        borderBottomLeftRadius: 32,
    },
    entityName: {
        display: `-webkit-box`,
        WebkitBoxOrient: `vertical`,
        overflow: `hidden`,
        textOverflow: `ellipsis`,
        wordBreak: `break-all`,
        whiteSpace: `normal`,
    },
    organizationName: {
        WebkitLineClamp: 3,
    },
    userName: {
        WebkitLineClamp: 1,
    },
    roleName: {
        WebkitLineClamp: 1,
    },
    currentOrganizationContainer: {
        padding: 0,
        width: `100%`,
    },
    showOrganizationsMenuButton: {
        color: theme.palette.common.white,
        right: theme.spacing(1),
        pointerEvents: `none`,
        transition: `.3s cubic-bezier(.25,.8,.5,1)`,
        marginLeft: theme.spacing(-3),
        "&.active": {
            transform: `rotate(180deg)`,
        },
    },
    showOrganizationsMenuButtonOpen: {
        transform: `rotate(180deg)`,
    },
}));

interface Props {
    isMiniVariant?: boolean;
}

export default function CompositeProfileSwitcher (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const theme = useTheme();
    const setNavigationDrawerOpen = useSetGlobalState(sideNavigationDrawerOpenState);
    const [ anchorEl, setAnchorEl ] = useState<(EventTarget & HTMLButtonElement) | null>(null);
    const { data: myUserData } = useQueryMyUser();
    const currentUser = myUserData?.myUser.node;
    const organizationNodes = (myUserData?.myUser.node.organizationMembershipsConnection?.edges ?? []).map((edge) => edge.node);
    const currentOrganization = useCurrentOrganization();
    const currentOrganizationName = currentOrganization?.name ?? ``;
    const abbrevatedOrganizationName = utils.nameToInitials(currentOrganizationName, 2);

    const isSmallScreen = useIsMobileTabletScreen();
    const showOrganizationSwitcher = useMemo(() => !!anchorEl, [ anchorEl ]);

    const handleShowOrganizationsChange = useCallback((target: EventTarget & HTMLButtonElement) => {
        setAnchorEl(target);
        if (isSmallScreen) setNavigationDrawerOpen(false);
    }, [ isSmallScreen, setNavigationDrawerOpen ]);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const currentUserName = `${currentUser?.givenName ?? ``} ${currentUser?.familyName ?? ``}`;

    const roleNames = organizationNodes
        .find((node) => node.organization?.id === currentOrganization?.id)
        ?.rolesConnection
        ?.edges
        .map((edge) => edge.node.name)
        .filter((roleName): roleName is string => !!roleName)
        ?? [];
    const highestRole = getHighestRole(roleNames);
    const translatedRole = highestRole
        ? (roleNameTranslations[highestRole]
            ? intl.formatMessage({
                id: roleNameTranslations[highestRole],
            })
            : highestRole)
        : highestRole;

    return (
        <>
            <ButtonBase
                focusRipple
                className={classes.root}
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    paddingLeft: 2.25,
                }}
                onClick={(event) => handleShowOrganizationsChange(event.currentTarget)}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                >
                    <List
                        dense
                        sx={{
                            color: theme.palette.common.white,
                        }}
                        className={classes.currentOrganizationContainer}
                    >
                        <ListItem
                            sx={{
                                height: 60,
                                padding: 0,
                                paddingRight: props.isMiniVariant ? 2.25 : 0,
                            }}
                        >
                            <ListItemText
                                primary={(props.isMiniVariant ? abbrevatedOrganizationName : currentOrganizationName) || intl.formatMessage({
                                    id: `organization.unknown`,
                                })}
                                primaryTypographyProps={{
                                    className: clsx(`MuiListItemText-primary`, classes.entityName, classes.organizationName),
                                }}
                            />
                        </ListItem>
                        <ListItem
                            sx={{
                                padding: 0,
                                paddingRight: 3,
                                height: 36,
                            }}
                        >
                            <ListItemAvatar
                                sx={{
                                    minWidth: 0,
                                }}
                            >
                                <UserAvatar
                                    size="small"
                                    name={currentUserName}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                sx={{
                                    marginLeft: 1,
                                    width: props.isMiniVariant ? 0 : undefined,
                                    opacity: props.isMiniVariant ? 0 : 1,
                                    transition: theme.transitions.create([ `opacity` ], {
                                        easing: theme.transitions.easing.easeInOut,
                                        duration: theme.transitions.duration.short,
                                    }),
                                }}
                                primary={currentUserName}
                                primaryTypographyProps={{
                                    noWrap: true,
                                    className: clsx(`MuiListItemText-primary`, classes.entityName, classes.userName),
                                    sx: {
                                        margin: 0,
                                        fontSize: 14,
                                        fontWeight: 400,
                                    },
                                }}
                                secondary={translatedRole ?? intl.formatMessage({
                                    id: `role.unknown`,
                                })}
                                secondaryTypographyProps={{
                                    noWrap: true,
                                    className: clsx(`MuiListItemText-secondary`, classes.entityName, classes.roleName),
                                    sx: {
                                        margin: 0,
                                        fontSize: 12,
                                        fontWeight: 400,
                                        color: theme.palette.primary.light,
                                    },
                                }}
                            />
                        </ListItem>
                    </List>
                    <ChevronRightIcon
                        className={clsx(classes.showOrganizationsMenuButton, {
                            [classes.showOrganizationsMenuButtonOpen]: showOrganizationSwitcher,
                        })}
                    />
                </Stack>
            </ButtonBase>
            <CompositeProfileMenu
                anchorEl={anchorEl}
                onClose={handleClose}
            />
        </>
    );
}
