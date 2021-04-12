import { User } from "@/types/graphQL";
import {
    Box,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import React,
{ useState } from "react";
import {
    FormattedDate,
    FormattedMessage,
} from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    user?: User | null;
}

export default function WelcomeMessage (props: Props) {
    const { user } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [ time, setTime ] = useState(Date.now());

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
                className={classes.welcomeTitle} >
                👋{` `}
                { (user && user.given_name !== null) ? (
                    <FormattedMessage
                        id="home_welcomeLabel"
                        values={{
                            userName: (
                                <span style={{
                                    color: theme.palette.primary.main,
                                }}>
                                    {user.given_name}
                                </span>
                            ),
                        }}
                    />
                ) : (
                    <FormattedMessage
                        id="home_welcomeGenericLabel"
                    />
                )}
            </Typography>
        </Box>
    );
}
