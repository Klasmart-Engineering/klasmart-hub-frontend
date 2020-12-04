import { useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Delete } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { injectIntl, IntlFormatters } from "react-intl";
import { currentMembershipVar } from "../../../cache";
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
import { GET_ORGANIZATION_USERS } from "../../../operations/queries/getOrganizationUsers";
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

interface ParamTypes {
  classId: string;
}

/**
 * Returns function to show Class Roster Table in "View Class Roster section"
 */
function ClassRosterTable(props: { intl: IntlFormatters }) {
  const { intl } = props;
  const classes = useStyles();
  const { classId } = ParameterHOC();
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

  const { data: userInClass, refetch, loading: loadingTableUsers } = useQuery(
    GET_TEACHER_IN_CLASS,
    {
      fetchPolicy: "network-only",
      variables: {
        class_id: classId,
      },
    },
  );

  const { data: userList, loading: loadingUsers } = useQuery(
    GET_ELIGIBLE_USERS,
    {
      fetchPolicy: "network-only",
      variables: {
        class_id: classId,
      },
    },
  );

  useEffect(() => {
    const eligibleUserList: EligibleUsers = userList;

    if (eligibleUserList && eligibleUserList.class) {
      const students: User[] = [];
      const teachers: User[] = [];

      eligibleUserList.class.eligibleStudents.forEach((userItem) => {
        students.push({
          role: "Student",
          user_id: userItem.user_id,
          user_name: userItem.given_name + " " + userItem.family_name,
        });
      });

      eligibleUserList.class.eligibleTeachers.forEach((userItem) => {
        teachers.push({
          role: "Teacher",
          user_id: userItem.user_id,
          user_name: userItem.given_name + " " + userItem.family_name,
        });
      });

      setUsers([...teachers, ...students]);
    }
  }, [userList]);

  useEffect(() => {
    console.log("userInClass: ", userInClass);
    if (
      userInClass &&
      (userInClass?.class?.teachers || userInClass?.class?.students)
    ) {
      const teachers = userInClass?.class?.teachers.map((teacherItem: any) => {
        return {
          user_id: teacherItem?.user_id,
          role: "Teacher",
          user_name: teacherItem?.given_name + " " + teacherItem?.family_name,
        };
      });
      const students = userInClass?.class?.students.map((studentItem: any) => {
        return {
          user_id: studentItem?.user_id,
          role: "Student",
          user_name: studentItem?.given_name + " " + studentItem?.family_name,
        };
      });
      const usersInClass = [...teachers, ...students];

      setData(usersInClass);
    }
  }, [userInClass]);

  if (loadingTableUsers && loadingUsers) {
    return <></>;
  }

  const saveRosterTable = async (user: User) => {
    try {
      const { user_id, role } = user;
      let response;

      if (role === "Teacher") {
        response = await addTeacherToSchool({
          variables: {
            class_id: classId,
            user_id,
          },
        });
      } else {
        response = await addStudentToSchool({
          variables: {
            class_id: classId,
            user_id,
          },
        });
      }

      if (Object.keys(response.data).length !== 0) {
        refetch();
        setMessageSnackBar(
          intl.formatMessage({ id: "classRoster_userAddedMessage" }),
        );
        setSeverityBar("success");
        setOpen(true);
      }
    } catch (error) {
      setMessageSnackBar(
        intl.formatMessage({ id: "classRoster_userAddedError" }),
      );
      setSeverityBar("error");
      setOpen(true);
    }
  };

  const removeUser = async (formData: any) => {
    try {
      const { user_id, role } = formData;

      if (role === "teacher") {
        await removeTeacherFromClass({
          variables: {
            class_id: classId,
            user_id,
          },
        });
      } else {
        await removeStudentFromClass({
          variables: {
            class_id: classId,
            user_id,
          },
        });
      }
      refetch();
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
        /** Material icons that the table uses */
        icons={constantValues.tableIcons}
        /** All options of table */
        options={{
          selection: true,
          headerStyle: {
            backgroundColor: "#fff",
            color: "#000",
            fontWeight: "bold",
          },
        }}
        /** Table Title (only render if toolbar option is true */
        title=""
        /** Column definitions */
        columns={[
          {
            title: intl.formatMessage({ id: "classRoster_nameTitle" }),
            field: "user",
            cellStyle: {
              width: 200,
              minWidth: 200,
            },
            render: (rowData) => <span>{rowData.user_name}</span>,
            editComponent: (props: any) => {
              return (
                <Autocomplete
                  id="slContactName"
                  onChange={(event: any, newValue: any | null) => {
                    props.onChange(newValue);
                  }}
                  options={users}
                  getOptionLabel={(option) => option.user_name}
                  style={{ width: 200 }}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" />
                  )}
                  groupBy={(option) => option.role}
                />
              );
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
              return <span>{rowData.role}</span>;
            },
          },
        ]}
        /** Data to be rendered */
        data={dataTable}
        /** Object for add, update and delete functions */
        editable={{
          onRowAdd: (newData: any) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                saveRosterTable(newData.user);
                resolve();
              }, 1000);
            }),
          // onRowUpdate: () =>
          //   new Promise((resolve, reject) => {
          //     resolve();
          //   }),
          onRowDelete: (newData) => removeUser(newData),
          // new Promise((resolve, reject) => {
          //   resolve();
          // }),
        }}
        /** All text for localization */
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
        /** Action list. An icon button will be rendered for each actions */
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
      ></SnackBarAlert>
    </div>
  );
}

export default injectIntl(ClassRosterTable);
