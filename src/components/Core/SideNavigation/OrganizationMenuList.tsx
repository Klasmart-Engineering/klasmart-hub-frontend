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
    createStyles,
    lighten,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import { OrganizationAvatar } from "kidsloop-px";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    selectedOrganization: {
        backgroundColor: lighten(theme.palette.primary.main, 0.9),
        "& .MuiListItemText-primary": {
            color: theme.palette.primary.main,
        },
        "& .MuiListItemText-secondary": {
            color: theme.palette.primary.main,
            opacity: 0.66,
        },
        "& .MuiListItemIcon-root": {
            color: theme.palette.primary.main,
        },
    },
}));

interface Props {
    onOrganizationChange: (membership: OrganizationMembership) => void;
}

export default function OrganizationMenuList (props: Props) {
    const { onOrganizationChange } = props;
    const classes = useStyles();
    const intl = useIntl();
    const userId = useReactiveVar(userIdVar);
    const { organization_id } = useReactiveVar(currentMembershipVar);
    const { data: userData } = useGetUser({
        variables: {
            user_id: userId,
        },
    });
    const [ organizationIdStack, setOrganizationIdStack ] = useLocalStorage<string[]>(`organizationIdStack-${userData?.user.email}-${userData?.user.phone}`, userData?.user?.memberships?.map((membership) => membership.organization_id) ?? []);

    const handleSelectOrganization = (membership: OrganizationMembership) => {
        onOrganizationChange(membership);
        if (membership.organization_id === organization_id) return;
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

    return (
        <List dense>
            {userData?.user?.memberships?.map((membership) => {
                const sortedRoleNames = membership?.roles
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
                return <ListItem
                    key={membership.organization_id}
                    button
                    color="primary"
                    className={clsx({
                        [classes.selectedOrganization]: membership.organization_id === organization_id,
                    })}
                    onClick={() => handleSelectOrganization(membership)}
                >
                    <ListItemAvatar>
                        <OrganizationAvatar name={membership.organization?.organization_name ?? ``} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={membership.organization?.organization_name ?? `Unknown`}
                        secondary={translatedRole ?? `Unknown`}
                    />
                </ListItem>;
            })}
        </List>
    );
}
