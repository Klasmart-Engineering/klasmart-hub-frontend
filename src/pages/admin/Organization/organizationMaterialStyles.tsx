import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase/InputBase";
import { makeStyles } from "@material-ui/core/styles";

export const BootstrapInput = withStyles((theme) => ({
    root: {
        "label + &": {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        "borderRadius": 6,
        "position": "relative",
        backgroundColor: theme.palette.background.paper,
        "border": "1px solid #030303",
        "fontSize": 16,
        "padding": "8px 26px 13px 12px",
        "transition": theme.transitions.create(["border-color", "box-shadow"]),
        // Use the system font instead of the default Roboto font.
        "fontFamily": [
            "-apple-system",
            "BlinkMacSystemFont",
            "\"Segoe UI\"",
            "Roboto",
            "\"Helvetica Neue\"",
            "Arial",
            "sans-serif",
            "\"Apple Color Emoji\"",
            "\"Segoe UI Emoji\"",
            "\"Segoe UI Symbol\"",
        ].join(","),
        "&:focus": {
            borderRadius: 4,
            borderColor: "#80bdff",
            boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
        },
    },
}))(InputBase);

export const BootstrapInputDashed = withStyles((theme) => ({
    root: {
        "label + &": {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        "borderRadius": 6,
        "position": "relative",
        backgroundColor: theme.palette.background.paper,
        "border": "1px dashed #030303",
        "fontSize": 16,
        "padding": "8px 26px 13px 12px",
        "transition": theme.transitions.create(["border-color", "box-shadow"]),
        // Use the system font instead of the default Roboto font.
        "fontFamily": [
            "-apple-system",
            "BlinkMacSystemFont",
            "\"Segoe UI\"",
            "Roboto",
            "\"Helvetica Neue\"",
            "Arial",
            "sans-serif",
            "\"Apple Color Emoji\"",
            "\"Segoe UI Emoji\"",
            "\"Segoe UI Symbol\"",
        ].join(","),
        "&:focus": {
            borderRadius: 4,
            borderColor: "#80bdff",
            boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
        },
    },
}))(InputBase);

export const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: "30px",
        margin: "auto",
        width: "80%",
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: "25ch",
    },
    containerFormControl: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
    },
    fieldDashed: {
        backgroundColor: "transparent",
        border: "1px dashed #000",
    },
    formControl: {
        minWidth: "100%",
        marginBottom: 25,
    },
    fileInput: {
        display: "none",
        borderStyle: "dashed",
    },
    containerPhoneInput: {
        border: "1px solid red",
        fontSize: 16,
        padding: "8px 26px 13px 12px",
    },
    selectPrimaryContact: {
        width: "100%",
    },
    paper: {
        marginTop: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    btnCancel: {
        backgroundColor: "#FF3030",
    },
    swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
    },
    popover: {
        position: "absolute",
        zIndex: 2,
    },
    cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
    },
    largeLogoPreview: {
        position: "absolute",
        width: theme.spacing(7),
        height: theme.spacing(7),
        right: "0px",
    },
    orgColorContainer: {
        textAlign: "center",
    },
}));
