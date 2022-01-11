import {
    myUsersSampleResponse,
    switchUser,
    useGetMyUsers,
} from "@/api/users";
import { userIdVar } from "@/cache";
import {
    Status,
    User,
} from "@/types/graphQL";
import { useReactiveVar } from "@apollo/client";
import {
    Avatar,
    Chip,
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
    useMemo,
    useState,
} from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    // users: User[];
}

export default function UserProfileSwitcher (props: Props) {
    // const { users } = props;
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const selectedUserId = useReactiveVar(userIdVar);
    const { loading, data } = useGetMyUsers();

    const [ users, setUsers ] = useState<User[]>([]);

    const url = useMemo(() => {
        const url = new URL(window.location.href);
        return url;
    }, []);

    useEffect(() => {
        if (data) {
            setUsers(data.my_users.filter(user => user.memberships?.some(membership => membership.status === Status.ACTIVE)));
        }
    }, [ data ]);

    const switchUsers = async (userId: string) => {
        try {
            const response = await switchUser(userId);
            return response;
        } catch (error) {
            console.log(`Error switching user: `, error);
        }
    };

    function handleClick (userId: string) {
        switchUsers(userId).then((response) => {
            console.log(`switchUser response: `, response);
            console.log(`update switchUser: `, userId);
            if (response) {
                userIdVar(userId);
                history.push(`/`);
            } else {
                enqueueSnackbar(`Error switching users. Please try again later.`, {
                    variant: `error`,
                });
            }
        });
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
