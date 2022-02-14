import { UserNode } from "@/api/users";
import {
    Box,
    lighten,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from "react";
import {
    FormattedDate,
    FormattedMessage,
} from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    welcomeTitle: {
        fontWeight: `bold`,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(4),
    },
    welcomeSubTitle: {
        color: theme.palette.grey[500],
        fontSize: `1em`,
        marginBottom: 0,
        marginTop: theme.spacing(1),
    },
}));

interface Props {
    user?: UserNode;
}

export default function WelcomeMessage (props: Props) {
    const { user } = props;
    const classes = useStyles();
    const theme = useTheme();
    const time = Date.now();

    return (
        <Box>
            <Typography className={classes.welcomeSubTitle}>
                <FormattedDate
                    value={time}
                    year="numeric"
                    month="long"
                    weekday="long"
                    day="2-digit"
                />
            </Typography>
            <Typography
                variant="h4"
                className={classes.welcomeTitle}
            >
                <span>👋 </span>
                {(user?.givenName)
                    ? (
                        <FormattedMessage
                            id="home_welcomeLabel"
                            values={{
                                userName: (
                                    <span style={{
                                        color: theme.palette.primary.main !== theme.palette.primary.contrastText ? lighten(theme.palette.primary.contrastText, 0.4) : theme.palette.primary.main,
                                    }}>
                                        {user.givenName}
                                    </span>
                                ),
                            }}
                        />
                    ) : (
                        <FormattedMessage
                            id="home_welcomeGenericLabel"
                        />
                    )
                }
            </Typography>
        </Box>
    );
}
