import { authClient } from "@/api/auth/client";
import { useGetMyUsers } from "@/api/users";
import { userIdVar } from "@/cache";
import {
    Status,
    User,
} from "@/types/graphQL";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
} from "@material-ui/core";
import {
    UserAvatar,
    useSnackbar,
} from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
}

export default function UserProfileSwitcher (props: Props) {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const selectedUserId = useReactiveVar(userIdVar);
    const { data: myUsersData } = useGetMyUsers();
    const [ users, setUsers ] = useState<User[]>([]);

    useEffect(() => {
        if (!myUsersData) return;
        setUsers(myUsersData.my_users.filter(user => user.memberships?.some(membership => membership.status === Status.ACTIVE)));
    }, [ myUsersData ]);

    async function handleClick (userId: string) {
        try {
            const response = await authClient.switchUser({
                user_id: userId,
            });
            window.location.reload(); // TODO: Dirty fix - remove and improve handling in the future
            userIdVar(userId);
            // history.push(`/`);
            return response;
        } catch (error) {
            enqueueSnackbar(`Error switching users. Please try again later.`, {
                variant: `error`,
            });
        }
    }

    return (
        <List dense>
            {users?.filter((user => user.user_id !== selectedUserId)).map((user) => {
                const givenName = user.given_name ?? ``;
                const familyName = user.family_name ?? ``;
                const fullName = givenName + ` ` + familyName;
                const username = user.username ?? ``;
                const userName = fullName === ` ` ? username ?? `Name undefined` : fullName;
                return <ListItem
                    key={user.user_id}
                    button
                    onClick={() => handleClick(user.user_id)}
                >
                    <ListItemAvatar>
                        <UserAvatar name={userName}/>
                    </ListItemAvatar>
                    <ListItemText
                        primary={userName}
                        secondary={userName === `Name undefined` ?
                            `Please update your profile` :
                            user.date_of_birth ? `Birthday: ` + user.date_of_birth : `` }
                    />
                </ListItem>;})}
        </List>
    );
}
