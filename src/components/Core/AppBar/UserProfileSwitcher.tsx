import { authClient } from "@/api/auth/client";
import { useQueryMyUser } from "@/api/myUser";
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import {
    UserAvatar,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
}

export default function UserProfileSwitcher (props: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const { data: myUserData } = useQueryMyUser();

    const currentUser = myUserData?.myUser.node;
    const profiles = myUserData?.myUser.profiles ?? [];

    const handleClick = async (userId: string) => {
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
        <List dense>
            {profiles.filter((profile => profile.id !== currentUser?.id)).map((profile) => {
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
                        <ListItemAvatar>
                            <UserAvatar name={userName}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={userName}
                            secondary={userName === `Name undefined`
                                ? `Please update your profile`
                                : (profile.dateOfBirth ? `Birthday: ${profile.dateOfBirth}` : ``)
                            }
                        />
                    </ListItem>
                );
            })}
        </List>
    );
}
