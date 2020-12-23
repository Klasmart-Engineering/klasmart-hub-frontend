import { useMutation, useQuery } from "@apollo/client";
import { useReactiveVar } from "@apollo/client/react";
import { OutlinedInput, Snackbar } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Delete, Publish } from "@material-ui/icons";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import _get from "lodash/get";
import MaterialTable, { EditComponentProps } from "material-table";
import React, { useEffect, useState } from "react";
import { injectIntl, IntlFormatters } from "react-intl";
import { currentMembershipVar, userIdVar } from "../../../cache";
import { FormData } from "../../../models/FormData";
import { Role } from "../../../models/Role";
import { UserMembership } from "../../../models/UserMembership";
import { School, Schools } from "../../../models/UserSchool";
import { EDIT_MEMBERSHIP_OF_ORGANIZATION } from "../../../operations/mutations/editMembershipOfOrganization";
import { INVITE_USER_TO_ORGANIZATION } from "../../../operations/mutations/inviteUserToOrganization";
import { LEAVE_MEMBERSHIP } from "../../../operations/mutations/leaveMembership";
import { GET_ORGANIZATION_USERS } from "../../../operations/queries/getOrganizationUsers";
import { constantValues } from "../constants";
import { useSchoolRoles } from "./hooks/useSchoolRoles";
import { useSchools } from "./hooks/useSchools";
import { useUserRoles } from "./hooks/useUserRoles";
import { useStyles } from "./userMaterialStyles";
import { checkAllowed } from "../../../utils/checkAllowed";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const menuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/**
 * Returns function to show Users table for "View Users" section
 */
function UserTable(props: { intl: IntlFormatters }) {
    const { intl } = props;
    const classes = useStyles();
    const [dataTable, setData] = useState<FormData[]>([]);
    const { roles, setRoles } = useUserRoles();
    const { setSchoolRoles } = useSchoolRoles();
    const { schools, setSchools } = useSchools();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "info" | "warning" | "error" | undefined
    >("success");

    const handleSnackbarClose = (
        event?: React.SyntheticEvent,
        reason?: string,
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenSnackbar(false);
    };
    const userId = useReactiveVar(userIdVar);
    const organization = useReactiveVar(currentMembershipVar);
    const organization_id = organization.organization_id;
    const [inviteUser] = useMutation(INVITE_USER_TO_ORGANIZATION);
    const [editMembership] = useMutation(EDIT_MEMBERSHIP_OF_ORGANIZATION);
    const [canCreate, setCanCreate] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const createAllowed = checkAllowed(organization_id, "create_users_40220");
    const editAllowed = checkAllowed(organization_id, "edit_users_40330");
    const deleteAllowed = checkAllowed(organization_id, "delete_users_40440");

    const { data: users, refetch, loading } = useQuery(GET_ORGANIZATION_USERS, {
        fetchPolicy: "network-only",
        variables: { organization_id },
    });
    const [leaveMembership] = useMutation(LEAVE_MEMBERSHIP);

    const schoolsSelectedHandler: (
        schoolsSelected: Array<School | string>,
        schools: School[],
    ) => string[] = (
        schoolsSelected: Array<School | string> = [],
        schools: School[],
    ) => {
        if (schoolsSelected.length && schoolsSelected[0] === "All Schools") {
            return schools.map((e: School) => e.school_id);
        }

        if (schoolsSelected.length && schoolsSelected[0] === "No Schools") {
            return [];
        }

        return schoolsSelected.map((e) => {
            if (typeof e === "string") {
                return e;
            }

            return e.school_id;
        });
    };

    useEffect(() => {
        if (
            createAllowed?.me?.membership &&
            editAllowed?.me?.membership &&
            deleteAllowed?.me?.membership
        ) {
            setCanCreate(
                _get(createAllowed, "me.membership.checkAllowed", false),
            );
            setCanEdit(_get(editAllowed, "me.membership.checkAllowed", false));
            setCanDelete(
                _get(deleteAllowed, "me.membership.checkAllowed", false),
            );

            setIsLoading(false);
        }
    }, [createAllowed, editAllowed, deleteAllowed]);

    // prettier-ignore
    const editableOptions = () => {
        return canCreate
            ? {
                isDeletable: (rowData: any) => rowData.status === "active" && canDelete,
                isEditable: (rowData: any) =>
                    rowData.status === "active" && canEdit, // *** POC
                onRowAdd: (newData: FormData): Promise<void> =>
                    new Promise((resolve, reject) => {
                        create(newData)
                            .then((e) => {
                                console.log("user created successfully", e);
                                resolve();
                            })
                            .catch((e) => {
                                console.log("catch e", e);
                                reject();
                            });
                    }),
                onRowUpdate: (newData: any): Promise<void> =>
                    new Promise((resolve, reject) => {
                        update(newData)
                            .then((e) => {
                                console.log("user updated successfully", e);
                                resolve();
                            })
                            .catch((e) => {
                                console.log("catch e", e);
                                reject();
                            });
                    }),
                onRowDelete: (newData: any): Promise<void> =>
                    new Promise((resolve, reject) => {
                        remove(newData)
                            .then((e) => {
                                console.log("user removed successfully", e);
                                resolve();
                            })
                            .catch((e) => {
                                console.log("catch e", e);
                                reject();
                            });
                    }),
            }
            : {
                isDeletable: (rowData: any) => rowData.status === "active",
                isEditable: (rowData: any) =>
                    rowData.status === "active" && canEdit, // *** POC
                onRowUpdate: (newData: any): Promise<void> =>
                    new Promise((resolve, reject) => {
                        update(newData)
                            .then((e) => {
                                console.log("user updated successfully", e);
                                resolve();
                            })
                            .catch((e) => {
                                console.log("catch e", e);
                                reject();
                            });
                    }),
                onRowDelete: (newData: any): Promise<void> =>
                    new Promise((resolve, reject) => {
                        remove(newData)
                            .then((e) => {
                                console.log("user removed successfully", e);
                                resolve();
                            })
                            .catch((e) => {
                                console.log("catch e", e);
                                reject();
                            });
                    }),
            };
    };

    useEffect(() => {
        if (users) {
            const memberships = _get(users, "organization.memberships", []);
            const userArray = memberships.map((userItems: UserMembership) => {
                const school_memberships = _get(
                    userItems,
                    "schoolMemberships",
                    [],
                );

                const schools = school_memberships
                    .map((e: Schools) => e.school)
                    .filter((e: School) => e?.status === "active");
                const school_roles = school_memberships.map(
                    (e: UserMembership) => e.roles,
                );

                return {
                    avatar: userItems.user.avatar,
                    email: userItems.user.email,
                    phone: userItems.user.phone,
                    user_id: userItems.user.user_id,
                    given_name: userItems.user.given_name,
                    family_name: userItems.user.family_name,
                    roles: userItems.roles,
                    schools,
                    school_roles,
                    status: userItems.status,
                };
            });

            setData(userArray);

            const roles = _get(users, "organization.roles", []);
            setRoles(roles);

            const rolSchool = roles.filter(
                (item: Role) =>
                    !constantValues.rolesNotAllowed.includes(item.role_name),
            );
            setSchoolRoles(rolSchool);

            const organizationSchools = _get(
                users,
                "organization.schools",
                [],
            ).filter((e: School) => e?.status === "active");

            setSchools([...organizationSchools]);
        }
    }, [setRoles, setSchoolRoles, setSchools, userId, users]);

    const create = async (formData: FormData): Promise<void> => {
        try {
            const {
                email,
                given_name,
                family_name,
                roles,
                schools: schoolsSelected,
            } = formData;
            setSnackbarMessage("");
            setOpenSnackbar(false);

            const variables = {
                organization_id,
                email,
                given_name,
                family_name,
                organization_role_ids: roles,
                school_ids: schoolsSelectedHandler(schoolsSelected, schools),
            };

            await inviteUser({
                variables,
            });

            await refetch();

            setSnackbarSeverity("success");
            setSnackbarMessage("The user has been created successfully");
        } catch (error) {
            console.log(error);
            setSnackbarMessage("An error occurred while creating the user");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
        }
    };

    const update = async (formData: FormData): Promise<void> => {
        try {
            setSnackbarMessage("");
            setOpenSnackbar(false);
            const {
                given_name,
                family_name,
                email,
                roles: rolesSelected,
                schools: schoolsSelected,
            } = formData;

            const organization_role_ids = rolesSelected.map((e: Role) =>
                e.role_id ? e.role_id : e,
            );
            const school_ids = schoolsSelected.map((e: School) =>
                e.school_id ? e.school_id : e,
            );

            const schoolsSelectedHandler: (
                school_ids: Array<School | string>,
            ) => string[] = (school_ids: Array<School | string> = []) => {
                if (school_ids.length && school_ids[0] === "All Schools") {
                    return schools.map((e: School) => e.school_id);
                }

                if (school_ids.length && school_ids[0] === "No Schools") {
                    return [];
                }

                return school_ids.map((e) => {
                    if (typeof e === "string") {
                        return e;
                    }

                    return e.school_id;
                });
            };

            const variables = {
                organization_id,
                email,
                given_name,
                family_name,
                organization_role_ids,
                school_ids: schoolsSelectedHandler(school_ids),
            };

            await editMembership({
                variables,
            });

            await refetch();

            setSnackbarSeverity("success");
            setSnackbarMessage("The user has been edited successfully");
        } catch (error) {
            console.log(error);
            setSnackbarMessage("An error occurred while editing the user");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
        }
    };

    const remove = async (formData: FormData): Promise<void> => {
        try {
            setSnackbarMessage("");
            setOpenSnackbar(false);
            const { user_id } = formData;

            const variables = {
                organization_id,
                user_id,
            };

            await leaveMembership({
                variables,
            });

            await refetch();

            setSnackbarSeverity("success");
            setSnackbarMessage("The user has been removed successfully");
        } catch (error) {
            console.log(error);
            setSnackbarMessage("An error occurred while removing the user");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <MaterialTable
                icons={constantValues.tableIcons}
                isLoading={loading || isLoading}
                options={{
                    selection: true,
                    headerStyle: {
                        backgroundColor: "#fff",
                        color: "#000",
                        fontWeight: "bold",
                    },
                    exportButton: true,
                }}
                title=""
                data={dataTable}
                columns={[
                    {
                        title: "Given Name",
                        field: "given_name",
                        type: "string",
                        cellStyle: {
                            width: 140,
                            minWidth: 140,
                        },
                        render: (rowData) => {
                            return <span>{rowData.given_name}</span>;
                        },
                    },
                    {
                        title: "Family Name",
                        field: "family_name",
                        type: "string",
                        cellStyle: {
                            width: 140,
                            minWidth: 140,
                        },
                        render: (rowData) => <span>{rowData.family_name}</span>,
                    },
                    {
                        title: "Organization Roles",
                        field: "roles",
                        cellStyle: {
                            width: 140,
                            minWidth: 140,
                        },
                        editComponent: (props: EditComponentProps<any>) => {
                            // prettier-ignore
                            const value = props.value
                                ? props.value.map(
                                    (rolItem: Role) =>
                                        rolItem.role_id || rolItem,
                                )
                                : [""];

                            return (
                                <FormControl fullWidth>
                                    <Select
                                        id="slRoles"
                                        value={value}
                                        onChange={(
                                            event: React.ChangeEvent<{
                                                value: any;
                                            }>,
                                        ): void => {
                                            const valueSelected: string[] = event.target.value.filter(
                                                (rolItemSelected: string) =>
                                                    rolItemSelected !== "",
                                            );

                                            props.onChange(valueSelected);
                                        }}
                                        input={<OutlinedInput />}
                                        MenuProps={menuProps}
                                        multiple
                                    >
                                        {roles.map((role: Role) => (
                                            <MenuItem
                                                key={role.role_id}
                                                value={role.role_id}
                                            >
                                                {role.role_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            );
                        },
                        render: (rowData) => {
                            return (
                                <span>
                                    {rowData.roles.map((role: Role) => {
                                        return (
                                            <div key={role.role_id}>
                                                {role.role_name}
                                            </div>
                                        );
                                    })}
                                </span>
                            );
                        },
                    },
                    {
                        title: intl.formatMessage({ id: "users_school" }),
                        field: "schools",
                        initialEditValue: [constantValues.allSchoolsValue],
                        cellStyle: {
                            width: 140,
                            minWidth: 140,
                        },
                        editComponent: (props: EditComponentProps<any>) => {
                            // prettier-ignore
                            const value = props.value
                                ? props.value.map(
                                    (school: School) =>
                                        school.school_id || school,
                                )
                                : [""];

                            return (
                                <FormControl fullWidth>
                                    <Select
                                        id="slSchools"
                                        value={value}
                                        input={<OutlinedInput />}
                                        MenuProps={menuProps}
                                        onChange={(
                                            event: React.ChangeEvent<{
                                                value: unknown;
                                            }>,
                                        ): void => {
                                            let valueSelected: string[] = event
                                                .target.value as string[];

                                            if (
                                                valueSelected.includes(
                                                    constantValues.allSchoolsValue,
                                                )
                                            ) {
                                                if (
                                                    valueSelected[
                                                        valueSelected.length - 1
                                                    ] ===
                                                    constantValues.allSchoolsValue
                                                ) {
                                                    valueSelected = valueSelected.filter(
                                                        (item: string) =>
                                                            item ===
                                                            constantValues.allSchoolsValue,
                                                    );
                                                } else {
                                                    valueSelected = valueSelected.filter(
                                                        (item: string) =>
                                                            item !==
                                                            constantValues.allSchoolsValue,
                                                    );
                                                }
                                            }

                                            if (
                                                valueSelected.includes(
                                                    constantValues.noSchoolsValue,
                                                )
                                            ) {
                                                if (
                                                    valueSelected[
                                                        valueSelected.length - 1
                                                    ] ===
                                                    constantValues.noSchoolsValue
                                                ) {
                                                    valueSelected = valueSelected.filter(
                                                        (item: string) =>
                                                            item ===
                                                            constantValues.noSchoolsValue,
                                                    );
                                                } else {
                                                    valueSelected = valueSelected.filter(
                                                        (item: string) =>
                                                            item !==
                                                            constantValues.noSchoolsValue,
                                                    );
                                                }
                                            }
                                            props.onChange(valueSelected);
                                        }}
                                        multiple
                                    >
                                        {schools.map((school: School) => (
                                            <MenuItem
                                                key={school.school_id}
                                                value={school.school_id}
                                            >
                                                {school.school_name}
                                            </MenuItem>
                                        ))}

                                        <MenuItem
                                            key={constantValues.allSchoolsValue}
                                            value={
                                                constantValues.allSchoolsValue
                                            }
                                        >
                                            {constantValues.allSchoolsValue}
                                        </MenuItem>
                                        <MenuItem
                                            key={constantValues.noSchoolsValue}
                                            value={
                                                constantValues.noSchoolsValue
                                            }
                                        >
                                            {constantValues.noSchoolsValue}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            );
                        },
                        render: (rowData) => {
                            return (
                                <span>
                                    {rowData?.schools?.map((school: School) => {
                                        if (school) {
                                            return (
                                                <div key={school.school_id}>
                                                    {school.school_name}
                                                </div>
                                            );
                                        }
                                    })}
                                </span>
                            );
                        },
                    },
                    {
                        title: intl.formatMessage({ id: "users_email" }),
                        field: "email",
                        editable: "onAdd",
                        type: "string",
                        render: (rowData) => (
                            <div>
                                <span>{rowData.email || rowData.phone }</span>
                            </div>
                        ),
                    },
                    {
                        title: intl.formatMessage({
                            id: "classes_statusTitle",
                        }),
                        field: "status",
                        render: (rowData) => {
                            const status = _get(
                                rowData,
                                "status",
                                "",
                            ).replace(/\w/, (c: string) => c.toUpperCase());
                            const activeColor =
                                status === "Active"
                                    ? classes.activeColor
                                    : classes.inactiveColor;

                            return (
                                <span className={`${activeColor}`}>
                                    {status}
                                </span>
                            );
                        },
                    },
                    {
                        title: intl.formatMessage({ id: "users_createDate" }),
                        field: "date",
                        editable: "never",
                        cellStyle: {
                            width: 200,
                            minWidth: 200,
                        },
                        render: (rowData) => (
                            <span className={classes.date}>
                                {rowData.join_timestamp}
                            </span>
                        ),
                    },
                ]}
                localization={{
                    header: {
                        actions: "",
                    },
                    body: {
                        emptyDataSourceMessage: intl.formatMessage({
                            id: "users_noRecords",
                        }),
                        addTooltip: intl.formatMessage({
                            id: "users_addTooltip",
                        }),
                    },
                    toolbar: {
                        exportTitle: intl.formatMessage({
                            id: "users_exportTooltip",
                        }),
                        searchPlaceholder: intl.formatMessage({
                            id: "users_searchPlaceholder",
                        }),
                        searchTooltip: intl.formatMessage({
                            id: "users_searchTooltip",
                        }),
                        exportCSVName: intl.formatMessage({
                            id: "users_exportCSVName",
                        }),
                        exportPDFName: intl.formatMessage({
                            id: "users_exportPDFName",
                        }),
                    },
                    pagination: {
                        labelDisplayedRows: `{from}-{to} ${intl.formatMessage({
                            id: "users_labelDisplayedRows",
                        })} {count}`,
                        labelRowsSelect: intl.formatMessage({
                            id: "users_labelRowsSelect",
                        }),
                        nextTooltip: intl.formatMessage({
                            id: "users_nextTooltip",
                        }),
                        previousTooltip: intl.formatMessage({
                            id: "users_previousTooltip",
                        }),
                        firstTooltip: intl.formatMessage({
                            id: "users_firstTooltip",
                        }),
                        lastTooltip: intl.formatMessage({
                            id: "users_lastTooltip",
                        }),
                    },
                }}
                actions={[
                    {
                        tooltip: intl.formatMessage({
                            id: "users_actionsDeleteTooltip",
                        }),
                        icon: Delete,
                        onClick: (evt, data: any): void =>
                            alert(
                                "You want to delete " + data.length + " rows",
                            ),
                    },
                    {
                        icon: Publish,
                        onClick: (event: any, rowData: any): void => {
                            console.log("Loading file", event, rowData);
                        },
                        isFreeAction: true,
                        tooltip: intl.formatMessage({
                            id: "users_uploadTooltip",
                        }),
                    },
                ]}
                editable={editableOptions()}
            />
            <Snackbar
                open={openSnackbar}
                autoHideDuration={1000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default injectIntl(UserTable);
