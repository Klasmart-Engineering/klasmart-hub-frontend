import { useQuery, useReactiveVar } from "@apollo/client/react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputLabel,
    MenuItem,
    Select,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import { AddBox, Delete, Edit } from "@material-ui/icons";
import _get from "lodash/get";
import MaterialTable from "material-table";
import React from "react";
import { useEffect, useState } from "react";
import { injectIntl, IntlFormatters } from "react-intl";
import { userIdVar } from "../../../cache";
import { Group } from "../../../models/Group";
import { GET_MY_ORGANIZATION } from "../../../operations/queries/getMyOrganization";
import { history } from "../../../utils/history";
import { constantValues } from "../constants";
import SnackBarAlert from "../SnackBarAlert/SnackBarAlert";
import {
    ChangeOwnerButton,
    ChangePasswordButton,
    EmailTitle,
    MyOrganizationsTitle,
    OrganizationNameTitle,
    PhoneTitle,
    // Commented for MVP
    // ChangePasswordButton,
    // ChangeOwnerButton,
    RolesTitle,
} from "./Labels";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: "100%",
    },
    buttonChangeEmail: {
        fontSize: "15px",
        fontWeight: "bold",
        width: "max-content",
        color: "#898686",
        borderColor: "#FF3030",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "fit-content",
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120,
    },
    dashedData: {
        borderBottom: "1px dashed",
        color: "#cacaca",
    },
}));

/**
 * Returns function to show My Organizations Table for "All Organizations" section
 */
function MyOrganizationTable(props: { intl: IntlFormatters }) {
    const { intl } = props;
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [severityBar] = useState("");
    const [messageSnackBar] = useState("");
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const user_id = useReactiveVar(userIdVar);

    const [
        dialogMessageConfirmEmailParent,
        setMessageConfirmEmailParent,
    ] = useState(false);

    // Commented for MVP
    // const showMessageConfirmEmailParent = () => {
    //   setMessageConfirmEmailParent(true);
    // };

    const handleMessageConfirmEmailParentClose = () => {
        setMessageConfirmEmailParent(false);
    };

    const { data, loading } = useQuery(GET_MY_ORGANIZATION, {
        fetchPolicy: "network-only",
        variables: {
            user_id,
        },
    });

    const [dataTable, setData] = useState([]);

    useEffect(() => {
        if (data) {
            const arr: any = [];
            const my_organization = _get(data, "user.my_organization", false);
            if (my_organization) {
                arr.push(my_organization);
                const editable = arr.map((o: any) => ({ ...o }));
                setData(editable);
                console.log(editable);
            }
        }
    }, [data]);

    return (
        <div className={classes.root}>
            <MaterialTable
                isLoading={loading}
                icons={constantValues.tableIcons}
                options={{
                    selection: true,
                    headerStyle: {
                        backgroundColor: "#fff",
                        color: "#000",
                        fontWeight: "bold",
                    },
                }}
                title={MyOrganizationsTitle()}
                columns={[
                    {
                        title: OrganizationNameTitle(),
                        field: "name",
                        type: "string",
                        render: (rowData) => <span>{rowData.organization_name}</span>,
                    },
                    {
                        title: PhoneTitle(),
                        field: "phone",
                        type: "string",
                        render: (rowData) => <span>{rowData.phone}</span>,
                    },
                    {
                        title: EmailTitle(),
                        field: "email",
                        type: "string",
                        render: (rowData) => <span>{rowData.owner.email}</span>,
                    },
                    {
                        title: RolesTitle(),
                        field: "primaryContact",
                        render: (rowData) => (
                            <span>
                                {rowData.roles?.map((e: any) => {
                                    return <div key={e.role_id}>{e.role_name}</div>;
                                })}
                            </span>
                        ),
                    },
                    // Commented for MVP
                    // {
                    //   title: '',
                    //   render: (rowData) => (
                    //     <>
                    //       <Button
                    //         href="https://pass.badanamu.net/#/password-forgot"
                    //         target="_blank"
                    //         className={classes.buttonChangeEmail}
                    //       >
                    //         <span>{ChangePasswordButton()}</span>
                    //       </Button>
                    //     </>
                    //   ),
                    // },
                    // {
                    //   title: '',
                    //   render: (rowData) => (
                    //     <>
                    //       <Button
                    //         className={classes.buttonChangeEmail}
                    //         onClick={() => showMessageConfirmEmailParent()}
                    //       >
                    //         {ChangeOwnerButton()}
                    //       </Button>
                    //     </>
                    //   ),
                    // },
                ]}
                data={dataTable}
                editable={{
                    onRowDelete: (oldData: any) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                resolve();
                            }, 1000);
                        }),
                }}
                localization={{
                    header: {
                        actions: "",
                    },
                    body: {
                        deleteTooltip: intl.formatMessage({
                            id: "allOrganization_deleteRowTooltip",
                        }),
                        emptyDataSourceMessage: intl.formatMessage({
                            id: "allOrganization_noRecords",
                        }),
                    },
                    toolbar: {
                        searchPlaceholder: intl.formatMessage({
                            id: "allOrganization_searchPlaceholder",
                        }),
                        searchTooltip: intl.formatMessage({
                            id: "allOrganization_searchTooltip",
                        }),
                    },
                    pagination: {
                        labelDisplayedRows: `{from}-{to} ${intl.formatMessage({
                            id: "allOrganization_labelDisplayedRows",
                        })} {count}`,
                        labelRowsSelect: intl.formatMessage({
                            id: "allOrganization_labelRowsSelect",
                        }),
                        nextTooltip: intl.formatMessage({
                            id: "allOrganization_nextTooltip",
                        }),
                        previousTooltip: intl.formatMessage({
                            id: "allOrganization_previousTooltip",
                        }),
                        firstTooltip: intl.formatMessage({
                            id: "allOrganization_firstTooltip",
                        }),
                        lastTooltip: intl.formatMessage({
                            id: "allOrganization_lastTooltip",
                        }),
                    },
                }}
                actions={[
                    {
                        tooltip: intl.formatMessage({
                            id: "allOrganization_actionsDeleteTooltip",
                        }),
                        icon: Delete,
                        isFreeAction: false,
                        onClick: (evt, data: any) =>
                            alert("You want to delete " + data.length + " rows"),
                    },
                    {
                        icon: AddBox,
                        tooltip: intl.formatMessage({
                            id: "allOrganization_actionsAddTooltip",
                        }),
                        isFreeAction: true,
                        onClick: () => history.push("/admin/create-organization"),
                    },
                    {
                        icon: Edit,
                        tooltip: intl.formatMessage({
                            id: "allOrganization_actionsEditTooltip",
                        }),
                        position: "row",
                        onClick: (event, data: any) => {
                            history.push(`/admin/edit-organization/${data.organization_id}`);
                        },
                    },
                ]}
            />

            <Dialog
                open={dialogMessageConfirmEmailParent}
                onClose={handleMessageConfirmEmailParentClose}
            >
                <DialogTitle>
                    {intl.formatMessage({ id: "allOrganization_changeOwner" })}
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>
                        {intl.formatMessage({ id: "allOrganization_changeOwnerText" })}
                    </DialogContentText>
                    <form className={classes.form} noValidate>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="slUsers">
                                {intl.formatMessage({ id: "allOrganization_userLabel" })}
                            </InputLabel>
                            <Select
                                autoFocus
                                inputProps={{
                                    name: "slUsers",
                                    id: "slUsers",
                                }}
                            >
                                {constantValues.userNamesData.map((itemGroup: Group) => (
                                    <MenuItem value={itemGroup.id} key={itemGroup.id}>
                                        {itemGroup.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleMessageConfirmEmailParentClose}
                        color="primary"
                    >
                        {intl.formatMessage({ id: "allOrganization_okButton" })}
                    </Button>
                    <Button
                        onClick={handleMessageConfirmEmailParentClose}
                        color="primary"
                        autoFocus
                    >
                        {intl.formatMessage({ id: "allOrganization_cancelButton" })}
                    </Button>
                </DialogActions>
            </Dialog>
            <SnackBarAlert
                open={open}
                onClose={handleClose}
                message={messageSnackBar}
                severity={severityBar}
            ></SnackBarAlert>
        </div>
    );
}

export default injectIntl(MyOrganizationTable);
