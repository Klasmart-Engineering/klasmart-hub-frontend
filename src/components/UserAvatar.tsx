import {
    Avatar,
    createStyles,
    makeStyles,
    Tooltip,
} from "@material-ui/core";
import clsx from "clsx";
import { utils } from "kidsloop-px";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    avatarSmall: {
        width: 24,
        height: 24,
        color: `white`,
        fontSize: 10,
    },
    avatarMedium: {
        width: 40,
        height: 40,
        color: `white`,
        fontSize: 16,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        color: `white`,
        fontSize: 24,
    },
}));

const MAX_INITIALS_LENGTH = 3;

interface Props {
    userName: string;
    src?: string;
    maxInitialsLength?: number;
    size?: `small` | `medium` | `large`;
}

export default function (props: Props) {
    const {
        userName,
        maxInitialsLength = MAX_INITIALS_LENGTH,
        src,
        size = `medium`,
    } = props;
    const classes = useStyles();
    return (
        <Tooltip title={userName ?? ``}>
            <span>
                <Avatar
                    variant="rounded"
                    src={src}
                    className={clsx({
                        [classes.avatarSmall]: size === `small`,
                        [classes.avatarMedium]: size === `medium`,
                        [classes.avatarLarge]: size === `large`,
                    })}
                    style={{
                        color: `white`,
                        backgroundColor: utils.stringToColor(userName || `??`),
                    }}>
                    {utils.nameToInitials(userName || `??`, maxInitialsLength)}
                </Avatar>
            </span>
        </Tooltip>
    );
}
