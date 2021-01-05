import { useMutation, useQuery } from "@apollo/client";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Delete } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { useSnackbar } from "kidsloop-px";
import _get from "lodash/get";
import MaterialTable, { EditComponentProps } from "material-table";
import React, { ChangeEvent, useEffect, useState } from "react";
import { injectIntl, IntlFormatters } from "react-intl";
import { User } from "../../../models/Membership";
import { School } from "../../../models/UserSchool";
import { ADD_STUDENT_TO_CLASS } from "../../../operations/mutations/addStudentToClass";
import { ADD_TEACHER_TO_CLASS } from "../../../operations/mutations/addTeacherToClass";
import { REMOVE_STUDENT_FROM_CLASS } from "../../../operations/mutations/removeStudentFromClass";
import { REMOVE_TEACHER_FROM_CLASS } from "../../../operations/mutations/removeTeacherFromClass";
import { GET_CLASS_USERS } from "../../../operations/queries/getClassUsers";
import {
    EligibleUser,
    EligibleUsers,
    GET_ELIGIBLE_USERS,
} from "../../../operations/queries/getEligibleUsers";
import { ParameterHOC } from "../../../utils/history";
import { constantValues } from "../constants";

const useStyles = makeStyles((theme) => ({
    containerTable: {
        width: "100%",
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

interface ClassRosterSchool {
    school_id: string;
    user: {
        user_id: string;
    };
}

/**
 * Returns function to show Class Roster Table in "View Class Roster section"
 */
function ClassRosterTable(props: { intl: IntlFormatters }) {
    const { intl } = props;
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { classId } = ParameterHOC();
    const teacherRole = "Teacher";
    const studentRole = "Student";
    const [dataTable, setData] = useState<User[]>([]);
    const [addTeacherToClass] = useMutation(ADD_TEACHER_TO_CLASS);
    const [addStudentToClass] = useMutation(ADD_STUDENT_TO_CLASS);
    const [removeTeacherFromClass] = useMutation(REMOVE_TEACHER_FROM_CLASS);
    const [removeStudentFromClass] = useMutation(REMOVE_STUDENT_FROM_CLASS);
    const [users, setUsers] = useState<User[]>([]);
    const { data: classUsers, refetch, loading: loadingTableUsers } = useQuery(
        GET_CLASS_USERS,
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
        if (eligibleUsers && eligibleUsers.class && classUsers) {
            const eligibleUserList: EligibleUsers = eligibleUsers;
            const students: User[] = [];
            const teachers: User[] = [];
            const schools = _get(classUsers, "class.schools", []).map(
                (e: School) => e.school_id,
            );

            eligibleUserList.class.eligibleStudents.forEach(
                (eligible_students) => {
                    if (eligible_students.school_memberships.length) {
                        const schoolMemberships = eligible_students.school_memberships.reduce(
                            (
                                acc: Map<string, { user_id: string }>,
                                e: ClassRosterSchool,
                            ) => {
                                if (schools.includes(e.school_id)) {
                                    acc.set(e.user.user_id, e.user);
                                }

                                return acc;
                            },
                            new Map(),
                        );
                        schoolMemberships.forEach((student: EligibleUser) => {
                            students.push({
                                role: studentRole,
                                user_id: student.user_id,
                                given_name:
                                    student.given_name +
                                    " " +
                                    student.family_name,
                            });
                        });
                    }
                },
            );

            eligibleUserList.class.eligibleTeachers.forEach(
                (eligibleTeachers) => {
                    if (eligibleTeachers.school_memberships.length) {
                        const schoolMemberships = eligibleTeachers.school_memberships.reduce(
                            (
                                acc: Map<string, { user_id: string }>,
                                e: ClassRosterSchool,
                            ) => {
                                if (schools.includes(e.school_id)) {
                                    acc.set(e.user.user_id, e.user);
                                }

                                return acc;
                            },
                            new Map(),
                        );

                        schoolMemberships.forEach((value: EligibleUser) => {
                            teachers.push({
                                role: teacherRole,
                                user_id: value.user_id,
                                given_name:
                                    value.given_name + " " + value.family_name,
                            });
                        });
                    }
                },
            );

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
                return _get(users, path, []).reduce(
                    (acc: User[], user: User) => {
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
                    },
                    [],
                );
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

    const addUser = async (user: User): Promise<void> => {
        try {
            const { user_id, role } = user;

            if (role === teacherRole) {
                const response = await addTeacherToClass({
                    variables: {
                        class_id: classId,
                        user_id,
                    },
                });
                const validationError = _get(
                    response,
                    "data.class.addTeacher",
                    true,
                );

                if (validationError === null) {
                    throw Error("Validation error");
                }
            }

            if (role === studentRole) {
                const response = await addStudentToClass({
                    variables: {
                        class_id: classId,
                        user_id,
                    },
                });

                const validationError = _get(
                    response,
                    "data.class.addStudent",
                    true,
                );

                if (validationError === null) {
                    throw Error("Validation error");
                }
            }

            await refetch();
            enqueueSnackbar(intl.formatMessage({ id: "classRoster_userAddedMessage" }), { variant: "success" });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({ id: "classRoster_userAddedError" }), { variant: "error" });
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
            enqueueSnackbar(intl.formatMessage({ id: "classRoster_userRemovedMessage" }), { variant: "success" });
        } catch (e) {
            enqueueSnackbar(intl.formatMessage({ id: "classRoster_userRemovedError" }), { variant: "error" });
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
                        title: intl.formatMessage({
                            id: "classRoster_nameTitle",
                        }),
                        field: "user",
                        cellStyle: {
                            minWidth: 200,
                            width: 200,
                        },
                        render: (rowData) => <span>{rowData.given_name}</span>,
                        editComponent: (props: EditComponentProps<any>) => {
                            const user_id = _get(
                                props,
                                "rowData.user_id",
                                false,
                            );
                            if (!user_id) {
                                const userIds = dataTable.map(
                                    (e: User) => e.user_id,
                                );
                                const unassignedUsers = users.filter(
                                    (e: User) => !userIds.includes(e.user_id),
                                );

                                return (
                                    <Autocomplete
                                        id="slContactName"
                                        onChange={(
                                            event: ChangeEvent<
                                                Record<string, unknown>
                                            >,
                                            newValue: User | null,
                                        ) => {
                                            props.onChange(newValue);
                                        }}
                                        options={unassignedUsers}
                                        getOptionLabel={(option) =>
                                            option.given_name
                                        }
                                        style={{ width: 200 }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                            />
                                        )}
                                        groupBy={(option): string =>
                                            option.role
                                        }
                                    />
                                );
                            }

                            const role = _get(props, "rowData.role", "");
                            const defaultValue = users.find(
                                (e: User) =>
                                    e.user_id === user_id && e.role === role,
                            );
                            const given_name = _get(
                                defaultValue,
                                "given_name",
                                "",
                            );

                            return (
                                <Autocomplete
                                    id="slContactName"
                                    onChange={(
                                        event: ChangeEvent<
                                            Record<string, unknown>
                                        >,
                                        newValue: User | null,
                                    ) => {
                                        props.onChange(newValue);
                                    }}
                                    options={users}
                                    defaultValue={{
                                        given_name,
                                        role,
                                        user_id,
                                    }}
                                    getOptionSelected={(option, value) => {
                                        return (
                                            option.given_name ===
                                            value.given_name
                                        );
                                    }}
                                    getOptionLabel={(option) =>
                                        option.given_name
                                    }
                                    style={{ width: 200 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                        />
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
                        title: intl.formatMessage({
                            id: "classRoster_groupTitle",
                        }),
                        field: "role",
                        editable: "never",
                        cellStyle: {
                            width: 200,
                            minWidth: 200,
                        },
                        render: (rowData) => {
                            return (
                                <span className={classes.dashedData}>
                                    {rowData.role}
                                </span>
                            );
                        },
                    },
                ]}
                data={dataTable}
                editable={{
                    onRowAdd: (newData: any): Promise<void> =>
                        new Promise((resolve, reject) => {
                            addUser(newData.user)
                                .then(() => {
                                    resolve();
                                })
                                .catch((error) => {
                                    reject(error);
                                });
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
                        addTooltip: intl.formatMessage({
                            id: "classRoster_addTooltip",
                        }),
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
                        nextTooltip: intl.formatMessage({
                            id: "classRoster_nextTooltip",
                        }),
                        previousTooltip: intl.formatMessage({
                            id: "classRoster_previousTooltip",
                        }),
                        firstTooltip: intl.formatMessage({
                            id: "classRoster_firstTooltip",
                        }),
                        lastTooltip: intl.formatMessage({
                            id: "classRoster_lastTooltip",
                        }),
                    },
                }}
                actions={[
                    {
                        tooltip: intl.formatMessage({
                            id: "classRoster_actionsDeleteTooltip",
                        }),
                        icon: Delete,
                        onClick: (evt, data: any) =>
                            alert(
                                "You want to delete " + data.length + " rows",
                            ),
                    },
                ]}
            />
        </div>
    );
}

export default injectIntl(ClassRosterTable);
