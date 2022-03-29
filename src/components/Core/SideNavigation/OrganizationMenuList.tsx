import { OrganizationMembershipConnectionNode } from "@/api/organizationMemberships";
import { useOrganizationStack } from "@/store/organizationMemberships";
import { selectOrganizationMembership } from "@/utils/organizationMemberships";
import {
    getHighestRole,
    roleNameTranslations,
} from "@/utils/userRoles";
import {
    lighten,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import { OrganizationAvatar } from "@kl-engineering/kidsloop-px";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    entityName: {
        display: `-webkit-box`,
        WebkitLineClamp: 2,
        WebkitBoxOrient: `vertical`,
        overflow: `hidden`,
        textOverflow: `ellipsis`,
        wordBreak: `break-word`,
    },
    selectedOrganization: {
        backgroundColor: lighten(theme.palette.primary.main, 0.9),
        "& .MuiListItemText-primary": {
            color: theme.palette.primary.contrastText,
        },
        "& .MuiListItemText-secondary": {
            color: theme.palette.primary.contrastText,
            opacity: 0.66,
        },
        "& .MuiListItemIcon-root": {
            color: theme.palette.primary.main,
        },
    },
}));

interface Props {
    onOrganizationChange?: (membership: OrganizationMembershipConnectionNode) => void;
}

export default function OrganizationMenuList (props: Props) {
    const { onOrganizationChange } = props;
    const classes = useStyles();
    const intl = useIntl();
    const [ organizationMembershipStack, setOrganizationMembershipStack ] = useOrganizationStack();

    const currentOrganizationMembership = organizationMembershipStack[0];
    const organizationMemberships = organizationMembershipStack.slice().sort((a, b) => a.organization?.name?.localeCompare(b.organization?.name ?? ``) ?? 0);

    const handleSelectOrganization = (membership: OrganizationMembershipConnectionNode) => {
        if (membership.organization?.id === currentOrganizationMembership?.organization?.id) return;
        onOrganizationChange?.(membership);
        selectOrganizationMembership(membership, organizationMembershipStack, setOrganizationMembershipStack);
    };

    return (
        <List dense>
            {organizationMemberships?.map((membership) => {
                const roleNames = membership?.rolesConnection?.edges
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
                    <ListItemButton
                        key={membership.organization?.id}
                        color="primary"
                        role="option"
                        aria-selected={membership.organization?.id === currentOrganizationMembership?.organization?.id}
                        className={clsx({
                            [classes.selectedOrganization]: membership.organization?.id === currentOrganizationMembership?.organization?.id,
                        })}
                        onClick={() => handleSelectOrganization(membership)}
                    >
                        <ListItemAvatar>
                            <OrganizationAvatar
                                name={membership.organization?.name ?? ``}
                                src={membership.organization?.branding?.iconImageURL?? ``}
                                color={membership.organization?.branding?.primaryColor ?? undefined}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={membership.organization?.name ?? intl.formatMessage({
                                id: `organization.unknown`,
                            })}
                            primaryTypographyProps={{
                                className: clsx(`MuiListItemText-primary`, classes.entityName),
                            }}
                            secondary={translatedRole ?? intl.formatMessage({
                                id: `role.unknown`,
                            })}
                            secondaryTypographyProps={{
                                className: clsx(`MuiListItemText-secondary`, classes.entityName),
                            }}
                        />
                    </ListItemButton>
                );
            })}
        </List>
    );
}
