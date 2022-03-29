import {
    Box,
    Grid,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import {
    Card,
    UserAvatar,
} from "@kl-engineering/kidsloop-px";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    paperContainer: {
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
                                <Card className={classes.paperContainer}>
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
