import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Delete } from "@material-ui/icons";
import _get from "lodash/get";
import MaterialTable, { EditComponentProps } from "material-table";
import React, { useEffect } from "react";
import { injectIntl, IntlFormatters } from "react-intl";
import { currentMembershipVar } from "../../../cache";
import { filterClassItem } from "../../../domain/filterClassItem";
import { selectionItems } from "../../../domain/selectionItems";
import { Class } from "../../../models/Class";
import { School } from "../../../models/School";
import { ADD_SCHOOL_TO_CLASS } from "../../../operations/mutations/addSchoolToClass";
import { DELETE_CLASS } from "../../../operations/mutations/deleteClass";
import { CREATE_CLASS } from "../../../operations/mutations/newClass";
import { GET_ALL_CLASSES } from "../../../operations/queries/getAllClasses";
import { GET_SCHOOLS } from "../../../operations/queries/getSchools";
import { constantValues } from "../constants";
import { useMessageSnackBar } from "../SnackBarAlert/hooks/useMessageSnackBar";
import { useShowSnackBar } from "../SnackBarAlert/hooks/useShowSnackBar";
import { useSeverityBar } from "../SnackBarAlert/hooks/useSnackBar";
import SnackBarAlert from "../SnackBarAlert/SnackBarAlert";
import { useClasses } from "./hooks/useClass";
import { useSchools } from "./hooks/useSchool";
import { history } from "../../../utils/history";

const useStyles = makeStyles(() => ({
  date: {
    color: "#919398",
  },
  containerTable: {
    "width": "100%",
    "& table": {
      overflowY: "auto",
    },
  },
  swatch: {
    height: "27px",
    width: "27px",
    border: "1px solid #000",
  },
  activeColor: { color: "#2BA600", fontWeight: "bold" },
  inactiveColor: { color: "#FF0000", fontWeight: "bold" },
  buttonClassRoster: {
    color: "#7C7C7C",
    fontWeight: "bold",
  },
  dashedData: {
    borderBottom: "1px dashed",
    color: "#cacaca",
  },
  formHelperText: {
    margin: 0,
  },
}));

/**
 * Returns function to show Classes Table in "Classes" section
 * @param  props {Object} intl - The object has a function (formatMessage) that support multiple languages
 */
function ClasessTable(props: { intl: IntlFormatters }) {
  const { intl } = props;
  const classes = useStyles();
  const { classesData, setClasses } = useClasses();
  const { schools, setSchools } = useSchools();
  const membership = useReactiveVar(currentMembershipVar);
  const { messageSnackBar, setMessageSnackBar } = useMessageSnackBar();
  const { severityBar, setSeverityBar } = useSeverityBar();
  const { showSnackBar, setShowSnackBar } = useShowSnackBar();
  const [createClass] = useMutation(CREATE_CLASS);
  const [deleteClass] = useMutation(DELETE_CLASS);
  const [addSchoolToClass] = useMutation(ADD_SCHOOL_TO_CLASS);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackBar(false);
  };

  const {
    data: schoolsResponseList,
    loading: loadingSchool,
    error: errorGetSchoolsList,
  } = useQuery(GET_SCHOOLS, {
    variables: { organizationId: membership.organization_id },
    fetchPolicy: "network-only",
  });

  const {
    data: classesList,
    refetch,
    loading: loadingClasses,
    error: errorGetAllClasses,
  } = useQuery(GET_ALL_CLASSES, {
    fetchPolicy: "network-only",
    variables: {
      organization_id: membership.organization_id,
    },
  });

  const addClass = async (classItem: Class): Promise<void> => {
    try {
      const { class_name, schools } = classItem;

      const newClass = await createClass({
        variables: {
          organization_id: membership.organization_id,
          class_name,
        },
      });

      const schoolsHandler = async (): Promise<void> => {
        for (let i = 0; i < schools.length; i++) {
          await addSchoolToClass({
            variables: {
              class_id: newClass.data.organization.createClass.class_id,
              school_id: schools[i],
            },
          });
        }
      };

      await schoolsHandler();

      await refetch();

      setMessageSnackBar(
        intl.formatMessage({ id: "classes_classSavedMessage" }),
      );
      setSeverityBar("success");
      setShowSnackBar(true);
    } catch (error) {
      setMessageSnackBar(intl.formatMessage({ id: "classes_classSaveError" }));
      setSeverityBar("error");
      setShowSnackBar(true);
    }
  };

  const removeClass = async (classItem: Class): Promise<void> => {
    try {
      const { class_id } = classItem;

      const result = await deleteClass({
        variables: {
          class_id,
        },
      });

      await refetch();

      setMessageSnackBar(
        intl.formatMessage({ id: "classes_classDeletedMessage" }),
      );
      setSeverityBar("success");
      setShowSnackBar(true);
    } catch (error) {
      setMessageSnackBar(
        intl.formatMessage({ id: "classes_classDeletedError" }),
      );
      setSeverityBar("error");
      setShowSnackBar(true);
    }
  };

  useEffect(() => {
    if (schoolsResponseList) {
      const organizationSchools = _get(
        schoolsResponseList,
        "me.membership.organization.schools",
        [],
      );

      setSchools(organizationSchools);
    }
  }, [schoolsResponseList, setSchools]);

  useEffect(() => {
    if (classesList) {
      const organizationClasses = _get(
        classesList,
        "me.membership.organization.classes",
        [],
      );

      const classList = filterClassItem(organizationClasses);
      setClasses(classList);
    }
  }, [classesList, setClasses]);

  useEffect(() => {
    if (errorGetSchoolsList) {
      setMessageSnackBar(
        intl.formatMessage({ id: "classes_savedSchoolsError" }),
      );
      setSeverityBar("error");
      setShowSnackBar(true);
    }
  }, [
    errorGetSchoolsList,
    intl,
    setMessageSnackBar,
    setSeverityBar,
    setShowSnackBar,
  ]);

  useEffect(() => {
    if (errorGetAllClasses) {
      setMessageSnackBar(intl.formatMessage({ id: "classes_errorDisplay" }));
      setSeverityBar("error");
      setShowSnackBar(true);
    }
  }, [
    errorGetAllClasses,
    intl,
    setMessageSnackBar,
    setSeverityBar,
    setShowSnackBar,
  ]);

  if (loadingSchool && loadingClasses) {
    return <></>;
  }

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
        title=""
        columns={[
          {
            title: "",
            render: (rowData) => {
              const url = `/admin/classRoster/${rowData.class_id}`;
              return (
                <Button size="small">
                  <Link
                    href="#"
                    onClick={(e) => {
                      history.push(url);
                      e.preventDefault();
                    }}
                    className={classes.buttonClassRoster}
                  >
                    <Typography variant="caption" style={{ color: "#000" }}>
                      {intl.formatMessage({ id: "classes_classRosterButton" })}
                    </Typography>
                  </Link>
                </Button>
              );
            },
          },
          {
            title: intl.formatMessage({ id: "classes_classTitle" }),
            field: "class_name",
            type: "string",
            cellStyle: {
              width: 140,
              minWidth: 140,
            },
          },
          {
            title: intl.formatMessage({ id: "classes_schoolTitle" }),
            field: "schools",
            type: "string",
            initialEditValue: [constantValues.schoolDefaultValue],
            cellStyle: {
              width: 140,
              minWidth: 140,
            },
            render: (rowData) => {
              return (
                <span>
                  {rowData.schools?.map((school: any) => {
                    return (
                      <div key={school.school_id}>{school.school_name}</div>
                    );
                  })}
                </span>
              );
            },
            editComponent: (props: EditComponentProps<any>) => {
              return (
                <FormControl variant="outlined" fullWidth>
                  <Select
                    id="slSchool"
                    value={props.value || [constantValues.schoolDefaultValue]}
                    multiple
                    onChange={(
                      event: React.ChangeEvent<{ value: unknown }>,
                    ) => {
                      let valueSelected: string[] = event.target
                        .value as string[];

                      valueSelected = selectionItems(
                        valueSelected,
                        constantValues.schoolDefaultValue,
                        constantValues.noSpecificGradeValue,
                      );
                      props.onChange(valueSelected);
                    }}
                  >
                    {schools.map((schoolItem: School) => (
                      <MenuItem
                        key={schoolItem.school_id}
                        value={schoolItem.school_id}
                      >
                        {schoolItem.school_name}
                      </MenuItem>
                    ))}

                    <MenuItem
                      key={constantValues.schoolDefaultValue}
                      value={constantValues.schoolDefaultValue}
                    >
                      {constantValues.schoolDefaultValue}
                    </MenuItem>
                  </Select>
                </FormControl>
              );
            },
          },
          {
            title: intl.formatMessage({ id: "classes_statusTitle" }),
            field: "status",
            editable: "never",
            cellStyle: {
              width: 140,
              minWidth: 140,
            },
            render: () => {
              const status = "Active";

              return <span className={`${classes.activeColor}`}>{status}</span>;
            },
          },
        ]}
        data={classesData}
        editable={{
          onRowAdd: (newData): Promise<void> =>
            new Promise((resolve, reject) => {
              if (newData.schools.includes(constantValues.schoolDefaultValue)) {
                newData.schools = schools.map(
                  (item) => item.school_id,
                ) as string[];
              }
              addClass(newData)
                .then((e) => {
                  console.log("class created successfully", e);
                  resolve();
                })
                .catch((e) => {
                  console.log("catch e", e);
                  reject();
                });
            }),
          onRowUpdate: (): Promise<void> =>
            new Promise((resolve) => {
              resolve();
            }),
          onRowDelete: (data): Promise<void> =>
            new Promise((resolve, reject) => {
              removeClass(data)
                .then((e) => {
                  console.log("class deleted successfully", e);
                  resolve();
                })
                .catch((e) => {
                  console.log("catch e", e);
                  reject();
                });
            }),
        }}
        localization={{
          header: {
            actions: "",
          },
          body: {
            emptyDataSourceMessage: intl.formatMessage({
              id: "classes_noRecords",
            }),
            addTooltip: intl.formatMessage({ id: "classes_addTooltip" }),
            deleteTooltip: intl.formatMessage({
              id: "classes_deleteRowTooltip",
            }),
            editTooltip: intl.formatMessage({ id: "classes_editRowTooltip" }),
            editRow: {
              saveTooltip: intl.formatMessage({ id: "classes_saveRowTooltip" }),
              cancelTooltip: intl.formatMessage({
                id: "classes_cancelSaveRowTooltip",
              }),
              deleteText: intl.formatMessage({ id: "classes_deleteRowText" }),
            },
          },
          toolbar: {
            searchPlaceholder: intl.formatMessage({
              id: "classes_searchPlaceholder",
            }),
            searchTooltip: intl.formatMessage({ id: "classes_searchTooltip" }),
            exportTitle: intl.formatMessage({ id: "classes_exportTooltip" }),
            exportCSVName: intl.formatMessage({ id: "classes_exportCSVName" }),
            exportPDFName: intl.formatMessage({ id: "classes_exportPDFName" }),
          },
          pagination: {
            labelDisplayedRows: `{from}-{to} ${intl.formatMessage({
              id: "classes_labelDisplayedRows",
            })} {count}`,
            labelRowsSelect: intl.formatMessage({
              id: "classes_labelRowsSelect",
            }),
            nextTooltip: intl.formatMessage({ id: "classes_nextTooltip" }),
            previousTooltip: intl.formatMessage({
              id: "classes_previousTooltip",
            }),
            firstTooltip: intl.formatMessage({ id: "classes_firstTooltip" }),
            lastTooltip: intl.formatMessage({ id: "classes_lastTooltip" }),
          },
        }}
        actions={[
          {
            tooltip: intl.formatMessage({ id: "classes_actionsDeleteTooltip" }),
            icon: Delete,
            onClick: (evt, data: any) =>
              alert("You want to delete " + data.length + " rows"),
          },
        ]}
      />

      <SnackBarAlert
        open={showSnackBar}
        onClose={handleClose}
        message={messageSnackBar}
        severity={severityBar}
      />
    </div>
  );
}

export default injectIntl(ClasessTable);
