import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import "react-phone-input-2/lib/style.css";
import JoinedOrganizationTable from "./JoinedOrganizationTable";
import MyOrganizationTable from "./MyOrganizationTable";

// @ts-ignore
const useStyles = makeStyles((theme) => ({
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
        width: "100%",
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
    buttonLeave: {
        width: "max-content",
        color: "#FF3030",
        borderColor: "#FF3030",
    },
}));

/**
 * Returns function to show Organizations table
 */
export default function AllOrganization() {
    const classes = useStyles();

    return (
    // <Container component="main" maxWidth="xl">
        <div className={classes.paper}>
            <MyOrganizationTable />
            <br />
            <JoinedOrganizationTable />
        </div>
    // </Container>
    );
}
