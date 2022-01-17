import {
    useGetMyUser,
    UserNode,
} from "@/api/users";
import {
    Box,
    lighten,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    useTheme,
} from "@material-ui/core/styles";
import React from "react";
import {
    FormattedDate,
    FormattedMessage,
} from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    welcomeTitle: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(4),
    },
    welcomeTitleGivenName: {
        fontWeight: `bold`,
        fontSize: `1em`,
        marginBottom: 0,
        marginTop: theme.spacing(1),
    },
}));

interface Props {}

export default function WidgetDashboardWelcomeMessage (props: Props) {
    const classes = useStyles();
    const { data: userData } = useGetMyUser();
    const givenName = userData?.myUser.node.givenName;

    return (
        <Box>
            <Typography
                variant="h4"
                className={classes.welcomeTitle}
            >
                {(givenName)
                    ? (
                        <FormattedMessage
                            id="home_welcomeLabel"
                            values={{
                                userName: (
                                    <span className={classes.welcomeTitleGivenName}>
                                        {givenName}
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
