import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { AddBox, Delete } from "@material-ui/icons";
import MaterialTable from "material-table";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { injectIntl, IntlFormatters } from "react-intl";
import { constantValues } from "../constants";
import DialogAgeRange from "./DialogAgeRange";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// @ts-ignore
const useStyles = makeStyles((theme: Theme) => ({
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

/**
 * Returns function to show Grade Table in "Grade" section
 */
function GradesTable(props: { intl: IntlFormatters }) {
  const { intl } = props;
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [school, setSchool] = useState("");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSchool(event.target.value as string);
  };

  return (
    <div className={classes.containerTable}>
      <br />
      <FormControl className={classes.formControl}>
        <InputLabel id="slSchool">School</InputLabel>
        <Select
          labelId="slSchool"
          value={school}
          onChange={handleChange}
          inputProps={{ readOnly: true }}
        ></Select>
      </FormControl>
      <br />
      <br />
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
            title: intl.formatMessage({ id: "grades_gradeTitle" }),
            field: "grade",
          },
          {
            title: intl.formatMessage({ id: "grades_ageRangeTitle" }),
            field: "age",
            render: (rowData: any) => (
              <div>
                <p>
                  {rowData.age[0].value} {rowData.age[0].type} -{" "}
                  {rowData.age[1].value} {rowData.age[1].type}
                </p>
              </div>
            ),
            editComponent: (props: any) => {
              return (
                <DialogAgeRange value={props.value} onChange={props.onChange} />
              );
            },
          },
          {
            title: intl.formatMessage({ id: "grades_programsTitle" }),
            field: "color",
            sorting: false,
            render: (rowData: any) => (
              <div className={classes.swatch}>
                <div
                  style={{
                    width: "inherit",
                    height: "inherit",
                    borderRadius: "2px",
                    backgroundColor: rowData.color,
                  }}
                />
              </div>
            ),
            editComponent: (props: any) => {
              const color = props.value || constantValues.colorDefaultPicker;
              return (
                <SketchPicker
                  onChange={(e: any) => {
                    props.onChange(e.hex);
                  }}
                  color={color}
                />
              );
            },
          },
          {
            title: intl.formatMessage({ id: "grades_programsTitle" }),
            field: "program",
            initialEditValue: [constantValues.allGradesValue],
            editComponent: (props: any) => {
              const value = props.value?.length
                ? props.value
                : [constantValues.allGradesValue];
              return (
                <FormControl fullWidth>
                  <Select
                    id="slGrades"
                    multiple
                    value={value}
                    onChange={(e: any) => {
                      props.onChange(e.target.value);
                    }}
                    input={<OutlinedInput />}
                    MenuProps={MenuProps}
                  >
                    <MenuItem
                      key={constantValues.allGradesValue}
                      value={constantValues.allGradesValue}
                    >
                      {constantValues.allGradesValue}
                    </MenuItem>
                  </Select>
                </FormControl>
              );
            },
          },
          {
            title: intl.formatMessage({ id: "grades_progressToTitle" }),
            field: "progressTo",
            initialEditValue: [constantValues.notSpecificGradeValue],
            editComponent: (props: any) => {
              const value = props.value?.length
                ? props.value
                : [constantValues.notSpecificGradeValue];

              return (
                <FormControl fullWidth>
                  <Select
                    value={value}
                    onChange={(e: any) => {
                      props.onChange(e.target.value);
                    }}
                    input={<OutlinedInput />}
                    MenuProps={MenuProps}
                  >
                    <MenuItem
                      key={constantValues.notSpecificGradeValue}
                      value={constantValues.notSpecificGradeValue}
                    >
                      {constantValues.notSpecificGradeValue}
                    </MenuItem>
                  </Select>
                </FormControl>
              );
            },
          },
        ]}
        /** Data to be rendered */
        data={data}
        /** Object for add, update and delete functions */
        editable={{
          onRowUpdate: (newData: any, oldData: any) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData: any) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                setData([]);
                resolve();
              }, 1000);
            }),
        }}
        /** All text for localization */
        localization={{
          header: {
            actions: "",
          },
          body: {
            emptyDataSourceMessage: intl.formatMessage({
              id: "grades_noRecords",
            }),
            addTooltip: intl.formatMessage({ id: "grades_addTooltip" }),
            deleteTooltip: intl.formatMessage({
              id: "grades_deleteRowTooltip",
            }),
            editTooltip: intl.formatMessage({ id: "grades_editRowTooltip" }),
            editRow: {
              saveTooltip: intl.formatMessage({ id: "grades_saveRowTooltip" }),
              cancelTooltip: intl.formatMessage({
                id: "grades_cancelSaveRowTooltip",
              }),
              deleteText: intl.formatMessage({ id: "grades_deleteRowText" }),
            },
          },
          toolbar: {
            searchPlaceholder: intl.formatMessage({
              id: "grades_searchPlaceholder",
            }),
            searchTooltip: intl.formatMessage({ id: "grades_searchTooltip" }),
            exportTitle: intl.formatMessage({ id: "grades_exportTooltip" }),
            exportCSVName: intl.formatMessage({ id: "grades_exportCSVName" }),
            exportPDFName: intl.formatMessage({ id: "grades_exportPDFName" }),
          },
          pagination: {
            labelDisplayedRows: `{from}-{to} ${intl.formatMessage({
              id: "grades_labelDisplayedRows",
            })} {count}`,
            labelRowsSelect: intl.formatMessage({
              id: "grades_labelRowsSelect",
            }),
            nextTooltip: intl.formatMessage({ id: "grades_nextTooltip" }),
            previousTooltip: intl.formatMessage({
              id: "grades_previousTooltip",
            }),
            firstTooltip: intl.formatMessage({ id: "grades_firstTooltip" }),
            lastTooltip: intl.formatMessage({ id: "grades_lastTooltip" }),
          },
        }}
        /** Action list. An icon button will be rendered for each actions */
        actions={[
          {
            tooltip: intl.formatMessage({ id: "grades_actionsDeleteTooltip" }),
            icon: Delete,
            onClick: (evt, data: any) =>
              alert("You want to delete " + data.length + " rows"),
          },
          {
            icon: AddBox,
            disabled: true,
            isFreeAction: true,
            onClick: (evt, data: any) => true,
          },
        ]}
      />
    </div>
  );
}

export default injectIntl(GradesTable);
