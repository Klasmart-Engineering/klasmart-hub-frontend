import { useGetUser } from "@/api/users";
import {
    currentMembershipVar,
    userIdVar,
} from "@/cache";
import { OrganizationMembership } from "@/types/graphQL";
import { useLocalStorage } from "@/utils/localStorage";
import {
    getHighestRole,
    roleNameTranslations,
} from "@/utils/userRoles";
import { useReactiveVar } from "@apollo/client";
import {
    Box,
    ButtonBase,
    createStyles,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
} from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import clsx from "clsx";
import {
    OrganizationAvatar,
    utils,
} from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
        display: `flex`,
        flexDirection: `column`,
    },
    organizationSelection: {
        marginLeft: theme.spacing(2),
    },
    currentOrganizationList: {
        paddingTop: 0,
        "& .MuiListItemText-primary": {
            color: theme.palette.common.white,
            opacity: 0.87,
        },
        "& .MuiListItemText-secondary": {
            color: theme.palette.common.white,
            opacity: 0.54,
        },
        "& .MuiListItemSecondaryAction-root": {
            color: theme.palette.common.white,
            opacity: 0.87,
            pointerEvents: `none`,
        },
    },
    showOrganizationsMenuButton: {
        transition: `.3s cubic-bezier(.25,.8,.5,1)`,
        "&.active": {
            transform: `rotate(180deg)`,
        },
    },
    showOrganizationsMenuButtonOpen: {
        transform: `rotate(180deg)`,
    },
}));

interface Props {
    showOrganizations: boolean;
    onShowOrganizationsChange: (status: boolean) => void;
}

export default function OrganizationSwitcher (props: Props) {
    const { showOrganizations, onShowOrganizationsChange } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { organization_id } = useReactiveVar(currentMembershipVar);
    const userId = useReactiveVar(userIdVar);
    const { data: userData } = useGetUser({
        variables: {
            user_id: userId,
        },
    });

    const [ organizationIdStack, setOrganizationIdStack ] = useLocalStorage<string[]>(`organizationIdStack-${userData?.user.user_id}`, userData?.user?.memberships?.map((membership) => membership.organization_id) ?? []);
    const [ showOrganizations_, setShowOrganizations ] = useState(showOrganizations);
    const [ selectedOrganizationMembership, setSelectedOrganizationMembership ] = useState<OrganizationMembership>();

    const memberships = userData?.user?.memberships?.slice() ?? [];
    const organizationName = selectedOrganizationMembership?.organization?.organization_name ?? ``;

    memberships.sort((a, b) => {
        return organizationIdStack.indexOf(a.organization_id) - organizationIdStack.indexOf(b.organization_id);
    });

    const handleShowOrganizationsChange = (status: boolean) => {
        onShowOrganizationsChange(status);
    };

    useEffect(() => {
        setShowOrganizations(showOrganizations);
    }, [ showOrganizations ]);

    const otherAvailableOrganizations = memberships.filter((membership) => membership.organization_id !== organization_id);

    useEffect(() => {
        const selectedMembership = memberships.find((membership) => membership.organization_id === organization_id);
        setSelectedOrganizationMembership(selectedMembership);
    }, [ organization_id, userData ]);

    const handleSelectOrganization = (membership: OrganizationMembership) => {
        const ids = organizationIdStack.splice(0);
        const membershipIndex = ids.indexOf(membership.organization_id);
        if (membershipIndex !== -1) ids.splice(membershipIndex, 1);
        setOrganizationIdStack([ membership.organization_id, ...ids ]);
        currentMembershipVar({
            organization_name: membership?.organization?.organization_name ?? ``,
            organization_id: membership.organization_id,
            organization_email: membership?.organization?.owner?.email ?? ``,
        });
    };

    const sortedRoleNames = selectedOrganizationMembership?.roles
        ?.map((r) => r.role_name)
        .filter((roleName): roleName is string => !!roleName);
    const highestRole = getHighestRole(sortedRoleNames ?? []);
    const translatedRole = highestRole
        ? (roleNameTranslations[highestRole]
            ? intl.formatMessage({
                id: roleNameTranslations[highestRole],
            })
            : highestRole)
        : highestRole;

    return (
        <div
            className={classes.root}
            style={{
                backgroundColor: utils.stringToColor(organizationName, {
                    saturation: 50,
                    light: 25,
                }),
            }}
        >
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="flex-start"
                flex="1"
                p={2}
            >
                <OrganizationAvatar
                    name={organizationName}
                    size="large"
                />
                <Box
                    display="flex"
                    flexDirection="row"
                >
                    {otherAvailableOrganizations?.slice(0, 2).map((membership) => (
                        <ButtonBase
                            key={membership.organization_id}
                            className={classes.organizationSelection}
                            onClick={() => handleSelectOrganization(membership)}
                        >
                            <OrganizationAvatar name={membership.organization?.organization_name ?? ``} />
                        </ButtonBase>
                    ))}
                </Box>
            </Box>
            <List
                dense
                className={classes.currentOrganizationList}
            >
                <ListItem
                    button
                    onClick={() => handleShowOrganizationsChange(!showOrganizations_)}
                >
                    <ListItemText
                        primary={organizationName || `No Organizations Available`}
                        secondary={translatedRole ?? `No Roles Found`}
                    />
                    <ListItemSecondaryAction>
                        <ArrowDropDown className={clsx(classes.showOrganizationsMenuButton, {
                            [classes.showOrganizationsMenuButtonOpen]: showOrganizations,
                        })} />
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        </div>
    );
}
