import {
    Box,
    Dialog,
    Divider,
    Theme,
    Typography,
    useTheme,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import { Button } from "@kl-engineering/kidsloop-px";
import React from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        '& .MuiDialog-paper': {
            background: theme.palette.common.white,
            width: `auto`,
            maxWidth: 520,
        },
    },
    header: {
        padding: theme.spacing(2),
        fontWeight: `bold`,
        fontSize: `1.2rem`,
        fontStyle: `normal`,
    },
    description: {
        padding: theme.spacing(2, 4),
        fontWeight: 500,
        fontSize: `1em`,
    },
    actions: {
        padding: theme.spacing(2),
    },
    action: {
        fontWeight: 400,
        color: theme.palette.action.active,
    },
}));

interface Props {
    open: boolean;
    confirm: () => void;
    onClose: () => void;
}

export default function ConfirmBox (props: Props) {
    const intl = useIntl();
    const theme = useTheme();
    const {
        open,
        onClose,
        confirm,
    } = props;
    const classes = useStyles();

    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth="md"
            className={classes.root}
            onClose={onClose}
        >
            <Box>
                <Typography className={classes.header}>
                    {intl.formatMessage({
                        id: `home.customization.warning.title`,
                        defaultMessage: `Warning`,
                    })}
                </Typography>
                <Divider />
                <Typography className={classes.description}>
                    {intl.formatMessage({
                        id: `home.customization.warning.desc`,
                        defaultMessage: `You have unsaved changes, are you sure you want to leave this page? Any unsaved changes will be lost.`,
                    })}
                </Typography>
                <Divider />
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    className={classes.actions}
                >
                    <Button
                        label={intl.formatMessage({
                            id: `home.customization.warning.cancel`,
                            defaultMessage: `Cancel`,
                        })}
                        variant="text"
                        size="medium"
                        className={classes.action}
                        color={theme.palette.info.dark}
                        onClick={onClose}></Button>
                    <Button
                        label={intl.formatMessage({
                            id: `home.customization.warning.confirm`,
                            defaultMessage: `Confirm`,
                        })}
                        variant="text"
                        className={classes.action}
                        color={theme.palette.info.dark}
                        size="medium"
                        onClick={() => { confirm(); onClose(); }}></Button>
                </Box>
            </Box>
        </Dialog>
    );
}
