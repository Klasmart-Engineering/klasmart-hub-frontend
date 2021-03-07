import {
    createStyles,
    Theme,
} from "@material-ui/core";

export default (theme: Theme) => createStyles({
    statusText: {
        fontWeight: `bold`,
        textTransform: `capitalize`,
    },
    disabledColor: {
        color: theme.palette.grey[500],
    },
    errorColor: {
        color: theme.palette.error.main,
    },
    infoColor: {
        color: theme.palette.info.main,
    },
    successColor: {
        color: theme.palette.success.main,
    },
    warningColor: {
        color: theme.palette.warning.main,
    },
    clickable: {
        cursor: `pointer`,
    },
});
