import { useOrganizationStack } from "@/store/organizationMemberships";
import { OrganizationMembership } from "@/types/graphQL";
import { selectOrganizationMembership } from "@/utils/organizationMemberships";
import {
    getHighestRole,
    roleNameTranslations,
} from "@/utils/userRoles";
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
    const [ organizationMembershipStack, setOrganizationMembershipStack ] = useOrganizationStack();
    const [ showOrganizations_, setShowOrganizations ] = useState(showOrganizations);

    const memberships = organizationMembershipStack.slice();
    const currentOrganizationMembership = memberships[0];
    const organizationName = currentOrganizationMembership?.organization?.organization_name ?? ``;
    const organizationLogo = currentOrganizationMembership?.organization?.branding?.iconImageURL ?? ``;

    memberships.sort((a, b) => {
        const aIndex = organizationMembershipStack.findIndex((organization) => organization.organization_id === a.organization_id);
        const bIndex = organizationMembershipStack.findIndex((organization) => organization.organization_id === b.organization_id);
        return aIndex - bIndex;
    });

    const handleShowOrganizationsChange = (status: boolean) => {
        onShowOrganizationsChange(status);
    };

    useEffect(() => {
        setShowOrganizations(showOrganizations);
    }, [ showOrganizations ]);

    const otherAvailableOrganizations = memberships.filter((membership) => membership.organization_id !== currentOrganizationMembership?.organization_id);

    const handleSelectOrganization = (membership: OrganizationMembership) => {
        if (!membership || membership.organization_id === currentOrganizationMembership?.organization_id) return;
        selectOrganizationMembership(membership, organizationMembershipStack, setOrganizationMembershipStack);
    };

    const sortedRoleNames = currentOrganizationMembership?.roles
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
                    src={organizationLogo}
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
                            <OrganizationAvatar
                                name={membership.organization?.organization_name ?? ``}
                                src={membership.organization?.branding?.iconImageURL ?? ``}
                            />
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
