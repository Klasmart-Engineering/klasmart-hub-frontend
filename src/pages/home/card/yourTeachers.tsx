import {
    Avatar,
    Box,
    Grid,
    Paper,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import {
    UserAvatar,
    utils,
} from "kidsloop-px";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paperContainer: {
            borderRadius: 12,
            border: `1px solid ${theme.palette.grey[300]}`,
            boxShadow:
                theme.palette.type === `dark`
                    ? `0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)`
                    : `0px 4px 8px 0px rgba(0, 0, 0, 0.1)`,
            padding: theme.spacing(2, 4),
        },
        avatar: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            color: `white`,
            marginRight: theme.spacing(1),
            fontSize: 10,
        },
        rowTitle: {
            textTransform: `uppercase`,
            fontWeight: `bold`,
            padding: theme.spacing(2, 4),
        },
        blocTitle: {
            fontWeight: `bold`,
        },
        blocSubTitle: {
            color: theme.palette.grey[500],
            fontSize: `0.8em`,
            marginBottom: theme.spacing(1),
        },
        cardNoResult: {
            padding: theme.spacing(2, 4),
            margin: theme.spacing(2, 4),
            borderRadius: 12,
            backgroundColor: theme.palette.primary.light,
        },
    }));

export default function YourTeachers () {
    const classes = useStyles();
    const theme = useTheme();

    const teachers = [
        `TEacher A`,
        `TEacher B`,
        `TEacher C`,
        `TEacher D`,
        `TEacher E`,
        `TEacher F`,
    ];

    return (
        <Box>
            <Typography className={classes.rowTitle}>
                <FormattedMessage id="Your Teachers" />
            </Typography>
            <Box>
                <Grid
                    container
                    spacing={4}>
                    {teachers && teachers.length !== 0 ? (
                        teachers?.map((teacher, i) => (
                            <Grid
                                key={i}
                                item
                                xs={6}
                                lg={3}>
                                <Card>
                                    <Box>
                                        <Typography className={classes.blocSubTitle}>
                                            Universite de Montbeliard
                                        </Typography>

                                        <Box
                                            display="flex"
                                            flexDirection="row"
                                            alignItems="center">
                                            <UserAvatar
                                                name={teacher}
                                                className={classes.avatar}
                                                size="small"
                                            />
                                            <Typography
                                                variant="h5"
                                                className={classes.blocTitle}>
                                                {teacher}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid
                            item
                            xs
                            className={classes.cardNoResult}>
                            <Typography variant="body2">
                                <FormattedMessage id="No teachers yet" />
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Box>
    );
}

function Card ({ children }: { children: React.ReactNode }) {
    const classes = useStyles();

    return <Paper className={classes.paperContainer}>{children}</Paper>;
}
