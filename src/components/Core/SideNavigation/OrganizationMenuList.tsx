import { userIdVar } from "@/cache";
import { useOrganizationStack } from "@/store/organizationMemberships";
import { OrganizationMembership } from "@/types/graphQL";
import { selectOrganizationMembership } from "@/utils/organizationMemberships";
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
    const [ organizationMembershipStack, setOrganizationMembershipStack ] = useOrganizationStack();

    const currentOrganizationMembership = organizationMembershipStack[0];
    const organizationMemberships = organizationMembershipStack.slice().sort((a, b) => a.organization?.organization_name?.localeCompare(b.organization?.organization_name ?? ``) ?? 0);

    const handleSelectOrganization = (membership: OrganizationMembership) => {
        if (!membership.organization || membership.organization_id === currentOrganizationMembership?.organization_id) return;
        onOrganizationChange(membership);
        selectOrganizationMembership(membership, organizationMembershipStack, setOrganizationMembershipStack);
    };

    return (
        <List dense>
            {organizationMemberships?.map((membership) => {
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
                        [classes.selectedOrganization]: membership.organization_id === currentOrganizationMembership?.organization_id,
                    })}
                    onClick={() => handleSelectOrganization(membership)}
                >
                    <ListItemAvatar>
                        <OrganizationAvatar
                            name={membership.organization?.organization_name ?? ``}
                            src={membership.organization?.branding?.iconImageURL?? ``}
                            color={membership.organization?.branding?.primaryColor ?? undefined}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={membership.organization?.organization_name ?? `Organization Name Undefined`}
                        secondary={translatedRole ?? `No Roles Found`}
                    />
                </ListItem>;
            })}
        </List>
    );
}
