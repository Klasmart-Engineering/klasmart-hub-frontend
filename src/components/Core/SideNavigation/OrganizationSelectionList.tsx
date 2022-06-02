import { OrganizationMembershipConnectionNode } from "@/api/organizationMemberships";
import {
    useCurrentOrganization,
    useOrganizationStack,
} from "@/store/organizationMemberships";
import { selectOrganizationMembership } from "@/utils/organizationMemberships";
import { OrganizationAvatar } from "@kl-engineering/kidsloop-px";
import { Check as CheckIcon } from "@mui/icons-material";
import {
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader,
} from "@mui/material";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

const ICON_SIZE = 24;

interface OrganizationSelectionListProps {
}

const OrganizationSelectionList: React.VFC<OrganizationSelectionListProps> = (props) => {
    const intl = useIntl();
    const currentOrganization = useCurrentOrganization();
    const [ organizationMembershipStack, setOrganizationMembershipStack ] = useOrganizationStack();
    const organizationMemberships = organizationMembershipStack
        .slice()
        .sort((a, b) => a.organization?.name?.localeCompare(b.organization?.name ?? ``) ?? 0);

    const handleSelectOrganization = (membership: OrganizationMembershipConnectionNode) => {
        if (membership.organization?.id === currentOrganization?.id) return;
        selectOrganizationMembership(membership, organizationMembershipStack, setOrganizationMembershipStack);
    };

    return (
        <List dense>
            <ListSubheader>
                <FormattedMessage id="adminHeader_viewOrg" />
            </ListSubheader>
            {organizationMemberships.map((membership) => (
                <ListItemButton
                    key={membership.organization?.id}
                    color="primary"
                    role="option"
                    onClick={() => handleSelectOrganization(membership)}
                >
                    <ListItemAvatar
                        sx={{
                            minWidth: 0,
                        }}
                    >
                        <OrganizationAvatar
                            size="small"
                            name={membership.organization?.name ?? ``}
                            src={membership.organization?.branding?.iconImageURL?? ``}
                            color={membership.organization?.branding?.primaryColor ?? undefined}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={membership.organization?.name ?? intl.formatMessage({
                            id: `organization.unknown`,
                        })}
                        sx={{
                            color: membership.organization?.id === currentOrganization?.id ? `primary.main` : undefined,
                            marginLeft: 1,
                            marginRight: 5,
                            display: `-webkit-box`,
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: `vertical`,
                            overflow: `hidden`,
                            textOverflow: `ellipsis`,
                            wordBreak: `break-word`,
                            fontWeight: 500,
                        }}
                    />
                    <ListItemSecondaryAction
                        sx={{
                            color: `primary.main`,
                            width: ICON_SIZE,
                            height: ICON_SIZE,
                        }}
                    >
                        {membership.organization?.id === currentOrganization?.id && (
                            <CheckIcon />
                        )}
                    </ListItemSecondaryAction>
                </ListItemButton>
            ))}
        </List>
    );
};

export default OrganizationSelectionList;
