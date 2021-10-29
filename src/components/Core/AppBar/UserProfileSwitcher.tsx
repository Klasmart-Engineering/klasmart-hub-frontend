import {
    switchUser,
    useGetMe,
    useGetMyUsers,
    UserEdge,
} from "@/api/users";
import { userIdVar } from "@/cache";
import {
    Status,
    StringOperator,
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
{ useEffect } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => createStyles({}));

export interface UserProfile {
    id: string;
    givenName: string;
    familyName: string;
    avatar: string;
    email: string;
    phone: string;
    status: Status;
    dateOfBirth: string;
}

export const mapUserProfile = (edge: UserEdge): UserProfile => {
    const user = edge.node;
    const activeOrganizationUser = user.organizations?.find(organization => organization.userStatus === Status.ACTIVE) ?? user.organizations[0];
    return {
        id: user.id,
        givenName: user.givenName ?? ``,
        familyName: user.familyName ?? ``,
        avatar: user.avatar ?? ``,
        email: user.contactInfo.email ?? ``,
        phone: user.contactInfo.phone ?? ``,
        dateOfBirth: user.dateOfBirth ?? ``,
        status: activeOrganizationUser.userStatus ?? Status.INACTIVE,
    };
};

interface Props {
}

export default function UserProfileSwitcher (props: Props) {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const selectedUserId = useReactiveVar(userIdVar);

    const { data: currentUserData } = useGetMe();

    const EMAIL_FILTER = {
        operator: `eq` as StringOperator,
        value: currentUserData?.me.email ?? ``,
    };

    const PHONE_FILTER = {
        operator: `eq` as StringOperator,
        value: currentUserData?.me.phone ?? ``,
    };

    const CONTACT_INFO_FILTER = currentUserData?.me.email ? {
        email: EMAIL_FILTER,
    }: {
        phone: PHONE_FILTER,
    };

    const { data: usersData } = useGetMyUsers({
        variables: {
            filter: CONTACT_INFO_FILTER,
        },
        fetchPolicy: `no-cache`,
    });

    const users = usersData?.usersConnection.edges?.map(mapUserProfile);
    const isActiveUsers = users?.filter(user => user.status === Status.ACTIVE);

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
            {isActiveUsers?.filter((user => user.id !== selectedUserId)).map((user) => {
                const givenName = user.givenName ?? ``;
                const familyName = user.familyName ?? ``;
                const fullName = givenName + ` ` + familyName;
                const userName = fullName === ` ` ? `Name undefined` : fullName;
                return <ListItem
                    key={user.id}
                    button
                    onClick={() => handleClick(user.id)}
                >
                    <ListItemAvatar>
                        <UserAvatar name={userName}/>
                    </ListItemAvatar>
                    <ListItemText
                        primary={userName}
                        secondary={userName === `Name undefined` ?
                            `Please update your profile` :
                            user.dateOfBirth ? `Birthday: ` + user.dateOfBirth : ``
                        }
                    />
                </ListItem>;})}
        </List>
    );
}
