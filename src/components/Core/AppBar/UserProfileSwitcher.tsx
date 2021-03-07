import {
    Organization,
    User,
} from "@/types/graphQL";
import {
    createStyles,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
} from "@material-ui/core";
import { UserAvatar } from "kidsloop-px";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    users: Organization[];
}

export default function UserProfileSwitcher (props: Props) {
    const { users } = props;
    const classes = useStyles();

    return (
        <List dense>
            {users?.map((user) => {
                const userName = user.organization_name ?? ``;
                return <ListItem
                    key={user.organization_id}
                    button
                >
                    <ListItemAvatar>
                        <UserAvatar name={userName}/>
                    </ListItemAvatar>
                    <ListItemText
                        primary={userName}
                        secondary={`Happy Birthday`}
                    />
                </ListItem>;})}
        </List>
    );
}
