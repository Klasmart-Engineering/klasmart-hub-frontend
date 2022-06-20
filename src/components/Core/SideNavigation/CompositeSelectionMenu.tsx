import OrganizationSelectionList from "./OrganizationSelectionList";
import UserSelectionList from "./UserSelectionList";
import { OrganizationMembershipConnectionNode } from "@/api/organizationMemberships";
import { useIsMobileTabletScreen } from "@/layout/utils";
import { IconButton } from "@kl-engineering/kidsloop-px";
import { Close as CloseIcon } from "@mui/icons-material";
import {
    Dialog,
    Divider,
    lighten,
    Popover,
    useTheme,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import { useMemo } from "react";

const useStyles = makeStyles((theme) => createStyles({
    dialogCloseButton: {
        position: `absolute`,
        bottom: theme.spacing(-7),
        left: `calc(50% - ${theme.spacing(5)} / 2)`,
        backgroundColor: `#FFFFFF40`,
        "&:hover": {
            backgroundColor: `#FFFFFF80`,
        },
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
    anchorEl: (EventTarget & HTMLButtonElement) | null;
    onClose?: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void) | undefined;
    onOrganizationChange?: (membership: OrganizationMembershipConnectionNode) => void;
}

export default function CompositeProfileMenu (props: Props) {
    const {
        anchorEl,
        onClose,
    } = props;
    const classes = useStyles();
    const theme = useTheme();

    const isSmallScreen = useIsMobileTabletScreen();

    const showOrganizationSwitcher = Boolean(anchorEl);

    const CompositeSelectionListComponent = useMemo(() => {
        return (
            <>
                <OrganizationSelectionList />
                <Divider />
                <UserSelectionList />
            </>
        );
    }, []);

    return isSmallScreen
        ? (
            <Dialog
                open={showOrganizationSwitcher}
                PaperProps={{
                    sx: {
                        maxHeight: `calc(100% - ${theme.spacing(7)})`,
                        overflowY: `visible`,
                    },
                }}
                onClose={onClose}
            >
                {CompositeSelectionListComponent}
                <IconButton
                    color="white"
                    icon={CloseIcon}
                    className={classes.dialogCloseButton}
                    onClick={(event) => onClose?.(event, `escapeKeyDown`)}
                />
            </Dialog>
        )
        : (
            <Popover
                anchorEl={anchorEl}
                open={showOrganizationSwitcher}
                anchorOrigin={{
                    vertical: `top`,
                    horizontal: `right`,
                }}
                transformOrigin={{
                    vertical: `top`,
                    horizontal: `left`,
                }}
                PaperProps={{
                    sx: {
                        border: `solid 1px #E4E4E4`,
                        borderRadius: theme.spacing(0, 1, 1, 1),
                    },
                }}
                onClose={onClose}
            >
                {CompositeSelectionListComponent}
            </Popover>
        );
}
