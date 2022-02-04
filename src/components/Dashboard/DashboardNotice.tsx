import {
    Box,
    Button,
    createStyles,
    darken,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core';
import React from "react";

type NoticeButtonProps = {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
}

export interface Props {
    title: string;
    subtitle?: string;
    button?: NoticeButtonProps;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: `flex`,
        textAlign: `center`,
        justifyContent: `space-between`,
        alignItems: `center`,
        flexDirection: `column`,
        padding: theme.spacing(2),
        background: theme.palette.primary.main,
        [theme.breakpoints.up(`sm`)]: {
            flexDirection: `row`,
            textAlign: `left`,
            padding: theme.spacing(2, 5),
        },
    },
    title: {
        textAlign: `center`,
        color: theme.palette.common.white,
        fontWeight: `bold`,
        paddingBottom: theme.spacing(1),
        [theme.breakpoints.up(`sm`)]: {
            textAlign: `left`,
            paddingBottom: theme.spacing(0),
        },
    },
    subtitle: {
        color: theme.palette.common.white,
        paddingBottom: theme.spacing(2),
        [theme.breakpoints.up(`sm`)]: {
            paddingBottom: theme.spacing(0),
        },
    },
    button: {
        borderRadius: 25,
        backgroundColor: theme.palette.common.white,
        color: theme.palette.primary.main,
        fontWeight: `bold`,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        '&:hover': {
            backgroundColor: darken(theme.palette.common.white, .1),
            color: darken(theme.palette.primary.main, .1),
        },
    },
}));

export default function DashboardNotice (props: Props) {
    const {
        title,
        subtitle,
        button,
    } = props;
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Box>
                <Typography
                    component="h2"
                    variant='h5'
                    className={classes.title}>
                    { title }
                </Typography>
                { subtitle &&
                    <Typography
                        component="p"
                        className={classes.subtitle}>
                        { subtitle }
                    </Typography>
                }
            </Box>
            { button &&
                <Button
                    className={classes.button}
                    startIcon={ button.icon }
                    size="large"
                    onClick={ button.onClick } >
                    { button.label }
                </Button>
            }
        </Box>
    );

}
