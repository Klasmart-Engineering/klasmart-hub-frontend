
import progressBarIcon from "@/assets/img/AdaptiveLearningJourney/progressBarIcon.png";
import {
    Box,
    LinearProgress,
    Typography,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import withStyles from '@mui/styles/withStyles';
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root : {
            height : 20,
            position : `absolute`,
            right : 20,
            top : 20,
            zIndex : 2,
            display: `flex`,
            [theme.breakpoints.down(`sm`)]: {
                transform : `rotate(-90deg)`,
                top: 120,
                right : -70,
            },
        },
        progressBar : {
            position: `relative`,
            width : 260,
            [theme.breakpoints.down(`sm`)]: {
                width : 220,
            },
        },
        progressIcon : {
            width : 40,
            zIndex: 2,
            position : `absolute`,
            top: -8,
            left : `calc(70% - 20px)`,
            [theme.breakpoints.down(`sm`)]: {
                transform : `rotate(90deg)`,
            },
        },
        progressBarLabel : {
            width : 100,
            marginRight: theme.spacing(2),
            lineHeight: 1,
            textAlign: `right`,
            color: theme.palette.info.main,
            [theme.breakpoints.down(`sm`)]: {
                display : `none`,
            },
        },
    }));

interface Props {}

export default function ProgressBar (props: Props) {
    const classes = useStyles();

    const BorderLinearProgress = withStyles((theme: Theme) => ({
        root: {
            width: 260,
            height: 25,
            borderRadius: theme.spacing(1.5),
            border: `4px solid ${theme.palette.info.light}`,
            [theme.breakpoints.down(`sm`)]: {
                width : 220,
            },
        },
        colorPrimary: {
            backgroundColor: theme.palette.info.main,
        },
        bar1Buffer : {
            backgroundColor: `#FFBC00`,
        },
        bar2Buffer : {
            backgroundColor: `#FF5FE4`,
            borderRadius: theme.spacing(1.5),
        },
        dashed : {
            display : `none`,
        },
    }))(LinearProgress);

    return (
        <Box
            className={classes.root}>
            <Typography
                variant="subtitle2"
                className={classes.progressBarLabel}>
                <FormattedMessage id="home.student.adaptiveLearningJourney.progressBarLabel" />
            </Typography>
            <Box className={classes.progressBar}>
                <img
                    src={progressBarIcon}
                    className={classes.progressIcon}/>
                <BorderLinearProgress
                    variant="buffer"
                    value={40}
                    valueBuffer={70} />
            </Box>
        </Box>
    );
}
