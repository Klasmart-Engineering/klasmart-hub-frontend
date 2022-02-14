import { Theme } from "@mui/material";
import createStyles from '@mui/styles/createStyles';

export default (theme: Theme) => createStyles({
    primaryText: {
        color: theme.palette.primary.contrastText,
    },
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
        textDecoration: `none`,
        '&:hover': {
            textDecoration: `underline`,
        },
    },
    fontWeightBold: {
        fontWeight: `bold`,
    },
});
