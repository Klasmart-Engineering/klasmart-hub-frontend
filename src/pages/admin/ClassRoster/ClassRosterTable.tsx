import { useMutation, useQuery } from "@apollo/client";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Delete } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import _get from "lodash/get";
import MaterialTable, { EditComponentProps } from "material-table";
import React, { ChangeEvent, useEffect, useState } from "react";
import { injectIntl, IntlFormatters } from "react-intl";
import { User } from "../../../models/Membership";
import { ADD_STUDENT_TO_CLASS } from "../../../operations/mutations/addStudentToClass";
import { ADD_TEACHER_TO_CLASS } from "../../../operations/mutations/addTeacherToClass";
import { REMOVE_STUDENT_FROM_CLASS } from "../../../operations/mutations/removeStudentFromClass";
import { REMOVE_TEACHER_FROM_CLASS } from "../../../operations/mutations/removeTeacherFromClass";
import {
    EligibleUser,
    EligibleUsers,
    GET_ELIGIBLE_USERS,
} from "../../../operations/queries/getEligibleUsers";
import { GET_TEACHER_IN_CLASS } from "../../../operations/queries/getTeacherInClass";
import { ParameterHOC } from "../../../utils/history";
import { constantValues } from "../constants";
import SnackBarAlert from "../SnackBarAlert/SnackBarAlert";

const useStyles = makeStyles((theme) => ({
    containerTable: {
        "width": "100%",
        "& table": {
            overflowY: "auto",
        },
    },
    dashedData: {
        borderBottom: "1px dashed",
        color: "#cacaca",
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
}));

/**
 * Returns function to show Class Roster Table in "View Class Roster section"
 */
function ClassRosterTable(props: { intl: IntlFormatters }) {
    const { intl } = props;
    const classes = useStyles();
    const { classId } = ParameterHOC();
    const teacherRole = "Teacher";
    const studentRole = "Student";
    const [dataTable, setData] = useState<User[]>([]);
    const [messageSnackBar, setMessageSnackBar] = useState("");
    const [severityBar, setSeverityBar] = useState("");
    const [open, setOpen] = useState(false);
    const [addTeacherToSchool] = useMutation(ADD_TEACHER_TO_CLASS);
    const [addStudentToSchool] = useMutation(ADD_STUDENT_TO_CLASS);
    const [removeTeacherFromClass] = useMutation(REMOVE_TEACHER_FROM_CLASS);
    const [removeStudentFromClass] = useMutation(REMOVE_STUDENT_FROM_CLASS);
    const [users, setUsers] = useState<User[]>([]);
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const { data: classUsers, refetch, loading: loadingTableUsers } = useQuery(
        GET_TEACHER_IN_CLASS,
        {
            fetchPolicy: "network-only",
            variables: {
                class_id: classId,
            },
        },
    );

    const { data: eligibleUsers, loading: loadingUsers } = useQuery(
        GET_ELIGIBLE_USERS,
        {
            fetchPolicy: "network-only",
            variables: {
                class_id: classId,
            },
        },
    );

    useEffect(() => {
        if (eligibleUsers && eligibleUsers.class) {
            const eligibleUserList: EligibleUsers = eligibleUsers;
            const students: User[] = [];
            const teachers: User[] = [];
            const hasGivenName = (user: EligibleUser): boolean | string =>
                _get(user, "given_name", false);
            const hasId = (user: EligibleUser): boolean | string =>
                _get(user, "user_id", false);

            eligibleUserList.class.eligibleStudents.forEach((student) => {
                if (hasId(student) && hasGivenName(student)) {
                    students.push({
                        role: studentRole,
                        user_id: student.user_id,
                        given_name: student.given_name + " " + student.family_name,
                    });

                    return;
                }
            });

            eligibleUserList.class.eligibleTeachers.forEach((teacher) => {
                if (hasId(teacher) && hasGivenName(teacher)) {
                    teachers.push({
                        role: teacherRole,
                        user_id: teacher.user_id,
                        given_name: teacher.given_name + " " + teacher.family_name,
                    });

                    return;
                }
            });

            setUsers([...teachers, ...students]);
        }
    }, [eligibleUsers]);

    useEffect(() => {
        if (classUsers) {
            const userRoleHelper = (
                users: User[],
                path: string,
                role: string,
            ): User[] => {
                return _get(users, path, []).reduce((acc: User[], user: User) => {
                    const hasGivenName = _get(user, "given_name", false);
                    const hasId = _get(user, "user_id", false);
                    const className = _get(users, "class.class_name", "");

                    if (hasId && hasGivenName) {
                        return acc.concat({
                            user_id: user.user_id,
                            role,
                            given_name: user.given_name,
                            class_name: className,
                        });
                    }

                    return acc;
                }, []);
            };

            const teachers = userRoleHelper(
                classUsers,
                "class.teachers",
                teacherRole,
            );
            const students = userRoleHelper(
                classUsers,
                "class.students",
                studentRole,
            );
            const teachersAndStudentsInClass = [...teachers, ...students];

            setData(teachersAndStudentsInClass);
        }
    }, [classUsers]);

    const saveRosterTable = async (user: User): Promise<void> => {
        try {
            const { user_id, role } = user;

            if (role === teacherRole) {
                await addTeacherToSchool({
                    variables: {
                        class_id: classId,
                        user_id,
                    },
                });
            }

            if (role === studentRole) {
                await addStudentToSchool({
                    variables: {
                        class_id: classId,
                        user_id,
                    },
                });
            }

            await refetch();
            setMessageSnackBar(
                intl.formatMessage({ id: "classRoster_userAddedMessage" }),
            );
            setSeverityBar("success");
            setOpen(true);
        } catch (error) {
            setMessageSnackBar(
                intl.formatMessage({ id: "classRoster_userAddedError" }),
            );
            setSeverityBar("error");
            setOpen(true);
        }
    };

    const removeUser = async (formData: User): Promise<void> => {
        try {
            const { user_id, role } = formData;

            if (role === teacherRole) {
                await removeTeacherFromClass({
                    variables: {
                        class_id: classId,
                        user_id,
                    },
                });
            }

            if (role === studentRole) {
                await removeStudentFromClass({
                    variables: {
                        class_id: classId,
                        user_id,
                    },
                });
            }

            await refetch();
            setMessageSnackBar(
                intl.formatMessage({ id: "classRoster_userRemovedMessage" }),
            );
            setSeverityBar("success");
        } catch (e) {
            console.error(e);
            setMessageSnackBar(
                intl.formatMessage({ id: "classRoster_userRemovedError" }),
            );
            setSeverityBar("error");
        } finally {
            setOpen(true);
        }
    };

    return (
        <div className={classes.containerTable}>
            <MaterialTable
                icons={constantValues.tableIcons}
                options={{
                    selection: true,
                    headerStyle: {
                        backgroundColor: "#fff",
                        color: "#000",
                        fontWeight: "bold",
                    },
                }}
                isLoading={loadingTableUsers && loadingUsers}
                title=""
                columns={[
                    {
                        title: intl.formatMessage({ id: "classRoster_nameTitle" }),
                        field: "user",
                        cellStyle: {
                            width: 200,
                            minWidth: 200,
                        },
                        render: (rowData) => <span>{rowData.given_name}</span>,
                        editComponent: (props: EditComponentProps<any>) => {
                            return (
                                <Autocomplete
                                    id="slContactName"
                                    onChange={(event: ChangeEvent<{}>, newValue: User | null) => {
                                        props.onChange(newValue);
                                    }}
                                    options={users}
                                    getOptionLabel={(option) => option.given_name}
                                    style={{ width: 200 }}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined" />
                                    )}
                                    groupBy={(option): string => option.role}
                                />
                            );
                        },
                    },
                    {
                        title: "Class name",
                        field: "role",
                        editable: "never",
                        cellStyle: {
                            width: 200,
                            minWidth: 200,
                        },
                        render: (rowData) => {
                            return <span>{rowData.class_name}</span>;
                        },
                    },
                    {
                        title: intl.formatMessage({ id: "classRoster_groupTitle" }),
                        field: "role",
                        editable: "never",
                        cellStyle: {
                            width: 200,
                            minWidth: 200,
                        },
                        render: (rowData) => {
                            return <span className={classes.dashedData}>{rowData.role}</span>;
                        },
                    },
                ]}
                data={dataTable}
                editable={{
                    onRowAdd: (newData: any): Promise<void> =>
                        new Promise((resolve, reject) => {
                            saveRosterTable(newData.user)
                                .then(() => {
                                    resolve();
                                })
                                .catch((error) => {
                                    reject(error);
                                });
                        }),
                    onRowUpdate: (): Promise<void> =>
                        new Promise((resolve) => {
                            resolve();
                        }),
                    onRowDelete: (newData): Promise<void> =>
                        new Promise((resolve, reject) => {
                            removeUser(newData)
                                .then(() => resolve())
                                .catch((error) => {
                                    reject(error);
                                });
                        }),
                }}
                localization={{
                    header: {
                        actions: "",
                    },
                    body: {
                        emptyDataSourceMessage: intl.formatMessage({
                            id: "classRoster_noRecords",
                        }),
                        addTooltip: intl.formatMessage({ id: "classRoster_addTooltip" }),
                        deleteTooltip: intl.formatMessage({
                            id: "classRoster_deleteRowTooltip",
                        }),
                        editTooltip: intl.formatMessage({
                            id: "classRoster_editRowTooltip",
                        }),
                        editRow: {
                            saveTooltip: intl.formatMessage({
                                id: "classRoster_saveRowTooltip",
                            }),
                            cancelTooltip: intl.formatMessage({
                                id: "classRoster_cancelSaveRowTooltip",
                            }),
                            deleteText: intl.formatMessage({
                                id: "classRoster_deleteRowText",
                            }),
                        },
                    },
                    toolbar: {
                        searchPlaceholder: intl.formatMessage({
                            id: "classRoster_searchPlaceholder",
                        }),
                        searchTooltip: intl.formatMessage({
                            id: "classRoster_searchTooltip",
                        }),
                        exportTitle: intl.formatMessage({
                            id: "classRoster_exportTooltip",
                        }),
                        exportCSVName: intl.formatMessage({
                            id: "classRoster_exportCSVName",
                        }),
                        exportPDFName: intl.formatMessage({
                            id: "classRoster_exportPDFName",
                        }),
                    },
                    pagination: {
                        labelDisplayedRows: `{from}-{to} ${intl.formatMessage({
                            id: "classRoster_labelDisplayedRows",
                        })} {count}`,
                        labelRowsSelect: intl.formatMessage({
                            id: "classRoster_labelRowsSelect",
                        }),
                        nextTooltip: intl.formatMessage({ id: "classRoster_nextTooltip" }),
                        previousTooltip: intl.formatMessage({
                            id: "classRoster_previousTooltip",
                        }),
                        firstTooltip: intl.formatMessage({
                            id: "classRoster_firstTooltip",
                        }),
                        lastTooltip: intl.formatMessage({ id: "classRoster_lastTooltip" }),
                    },
                }}
                actions={[
                    {
                        tooltip: intl.formatMessage({
                            id: "classRoster_actionsDeleteTooltip",
                        }),
                        icon: Delete,
                        onClick: (evt, data: any) =>
                            alert("You want to delete " + data.length + " rows"),
                    },
                ]}
            />

            <SnackBarAlert
                open={open}
                onClose={handleClose}
                message={messageSnackBar}
                severity={severityBar}
            />
        </div>
    );
}

export default injectIntl(ClassRosterTable);
