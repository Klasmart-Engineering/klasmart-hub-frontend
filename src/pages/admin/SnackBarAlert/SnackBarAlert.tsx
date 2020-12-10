import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React from "react";
import { SnackBarAlertMessage } from "../../../models/SnackBarAlert";

/**
 * Returns the function to display notifications
 */
export default function SnackBarAlert(props: SnackBarAlertMessage) {
    const { onClose, open, message, severity } = props;
    return (
        <Snackbar open={open} autoHideDuration={1000} onClose={onClose}>
            <Alert onClose={onClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
}
