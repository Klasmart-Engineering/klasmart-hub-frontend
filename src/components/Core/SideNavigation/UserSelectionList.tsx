import { authClient } from "@/api/auth/client";
import { useQueryMyUser } from "@/api/myUser";
import {
    UserAvatar,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { Check as CheckIcon } from "@mui/icons-material";
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

const ICON_SIZE = 24;

interface Props {
}

export default function UserSelectionList (props: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const { data: myUserData } = useQueryMyUser();

    const currentUser = myUserData?.myUser.node;
    const profiles = myUserData?.myUser.profiles ?? [];

    const handleClick = async (userId: string) => {
        if (currentUser?.id === userId) return;
        try {
            const resp = await authClient.switchUser({
                user_id: userId,
            });
            window.location.reload(); // TODO: Dirty fix - remove and improve handling in the future
            return resp;
        } catch (err) {
            enqueueSnackbar(`Error switching users. Please try again later.`, {
                variant: `error`,
            });
        }
    };

    return (
        <>
            <List dense>
                <ListSubheader>
                    <FormattedMessage id="adminHeader_viewUsers" />
                </ListSubheader>
                {profiles.map((profile) => {
                    const givenName = profile.givenName ?? ``;
                    const familyName = profile.familyName ?? ``;
                    const fullName = `${givenName} ${familyName}`;
                    const username = profile.contactInfo?.username ?? ``;
                    const userName = fullName === ` ` ? username ?? `Name undefined` : fullName;
                    return (
                        <ListItem
                            key={profile.id}
                            button
                            onClick={() => handleClick(profile.id)}
                        >
                            <ListItemAvatar
                                sx={{
                                    minWidth: 0,
                                }}
                            >
                                <UserAvatar
                                    size="small"
                                    name={userName}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={userName}
                                sx={{
                                    color: currentUser?.id === profile.id ? `primary.main` : undefined,
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
                                {currentUser?.id === profile.id && (
                                    <CheckIcon />
                                )}
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
        </>
    );
}
