import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { AddBox, Delete } from "@material-ui/icons";
import MaterialTable from "material-table";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { injectIntl, IntlFormatters } from "react-intl";
import { constantValues } from "../constants";

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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
  dashedData: {
    borderBottom: "1px dashed",
    color: "#cacaca",
  },
}));

/**
 * Returns function to show Programs Table in "View Program section"
 */
function ProgramsTable(props: { intl: IntlFormatters }) {
  const { intl } = props;
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [school, setSchool] = useState("");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSchool(event.target.value as string);
  };

  const [
    dialogMessageConfirmEmailParent,
    setMessageConfirmEmailParent,
  ] = useState(false);

  const showMessageConfirmEmailParent = () => {
    setMessageConfirmEmailParent(true);
  };

  const handleMessageConfirmEmailParentClose = () => {
    setMessageConfirmEmailParent(false);
  };

  return (
    <div className={classes.containerTable}>
      <br />
      <FormControl className={classes.formControl}>
        <InputLabel id="slSchool">
          {intl.formatMessage({ id: "programs_schoolLabel" })}
        </InputLabel>
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
            title: intl.formatMessage({ id: "programs_programTitle" }),
            field: "program",
            type: "string",
            render: (rowData) => (
              <span className={classes.dashedData}>{rowData.program}</span>
            ),
          },
          {
            title: intl.formatMessage({ id: "programs_subjectTitle" }),
            field: "subject",
            cellStyle: {
              width: 140,
              minWidth: 140,
            },
            render: (rowData) => (
              <span className={classes.dashedData}>{rowData.subject}</span>
            ),
            editComponent: (props: any) => {
              const value = !props.value ? "General" : props.value;
              return (
                <FormControl fullWidth>
                  <Select
                    id="slSubject"
                    fullWidth
                    value={value}
                    onChange={(e: any) => {
                      props.onChange(e.target.value);
                    }}
                    input={<OutlinedInput />}
                  >
                    {constantValues.subjectElements.map((subjectItem) => (
                      <MenuItem key={subjectItem.id} value={subjectItem.id}>
                        {subjectItem.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            },
          },
          {
            title: intl.formatMessage({ id: "programs_gradeTitle" }),
            field: "grade",
            initialEditValue: [constantValues.noSpecificGradeValue],
            cellStyle: {
              width: 140,
              minWidth: 140,
            },
            render: (rowData: any) => (
              <div>
                {rowData.grade.map((item: string, index: number) => {
                  return (
                    <span key={`demo_snap_${index}`}>
                      {(index ? ", " : "") + item}
                    </span>
                  );
                })}
              </div>
            ),
            editComponent: (props: any) => {
              const value = props.value?.length
                ? props.value
                : [constantValues.noSpecificGradeValue];

              return (
                <FormControl fullWidth>
                  <Select
                    id="slGrades"
                    fullWidth
                    multiple
                    value={value}
                    onChange={(e: any) => {
                      props.onChange(e.target.value);
                    }}
                    input={<OutlinedInput />}
                    MenuProps={MenuProps}
                  >
                    {constantValues.gradesData.map((gradeItem) => (
                      <MenuItem key={gradeItem.id} value={gradeItem.id}>
                        {gradeItem.name}
                      </MenuItem>
                    ))}
                    <MenuItem
                      key={constantValues.noSpecificGradeValue}
                      value={constantValues.noSpecificGradeValue}
                    >
                      {constantValues.noSpecificGradeValue}
                    </MenuItem>
                  </Select>
                </FormControl>
              );
            },
          },
          {
            title: "",
            editable: "never",
            render: (rowData) => (
              <>
                <Button
                  className={classes.buttonChangeEmail}
                  onClick={() => showMessageConfirmEmailParent()}
                >
                  {intl.formatMessage({ id: "programs_addCommentButton" })}
                </Button>
              </>
            ),
          },
          {
            title: "",
            editable: "never",
            render: (rowData) => (
              <>
                <Button className={classes.buttonChangeEmail}>
                  {intl.formatMessage({
                    id: "programs_viewProgramDetailsButton",
                  })}
                </Button>
              </>
            ),
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
              id: "programs_noRecords",
            }),
            addTooltip: intl.formatMessage({ id: "programs_addTooltip" }),
            deleteTooltip: intl.formatMessage({
              id: "programs_deleteRowTooltip",
            }),
            editTooltip: intl.formatMessage({ id: "programs_editRowTooltip" }),
            editRow: {
              saveTooltip: intl.formatMessage({
                id: "programs_saveRowTooltip",
              }),
              cancelTooltip: intl.formatMessage({
                id: "programs_cancelSaveRowTooltip",
              }),
              deleteText: intl.formatMessage({ id: "programs_deleteRowText" }),
            },
          },
          toolbar: {
            searchPlaceholder: intl.formatMessage({
              id: "programs_searchPlaceholder",
            }),
            searchTooltip: intl.formatMessage({ id: "programs_searchTooltip" }),
            exportTitle: intl.formatMessage({ id: "programs_exportTooltip" }),
            exportCSVName: intl.formatMessage({ id: "programs_exportCSVName" }),
            exportPDFName: intl.formatMessage({ id: "programs_exportPDFName" }),
          },
          pagination: {
            labelDisplayedRows: `{from}-{to} ${intl.formatMessage({
              id: "classes_labelDisplayedRows",
            })} {count}`,
            labelRowsSelect: intl.formatMessage({
              id: "programs_labelRowsSelect",
            }),
            nextTooltip: intl.formatMessage({ id: "programs_nextTooltip" }),
            previousTooltip: intl.formatMessage({
              id: "programs_previousTooltip",
            }),
            firstTooltip: intl.formatMessage({ id: "programs_firstTooltip" }),
            lastTooltip: intl.formatMessage({ id: "programs_lastTooltip" }),
          },
        }}
        /** Action list. An icon button will be rendered for each actions */
        actions={[
          {
            tooltip: intl.formatMessage({
              id: "programs_actionsDeleteTooltip",
            }),
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

      <Dialog
        open={dialogMessageConfirmEmailParent}
        onClose={handleMessageConfirmEmailParentClose}
      >
        <DialogTitle>Add comments</DialogTitle>
        <DialogContent dividers>
          <form className={classes.form} noValidate>
            <TextField
              id="outlined-multiline-static"
              label="Comments"
              multiline
              rows={4}
              defaultValue=""
              variant="outlined"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleMessageConfirmEmailParentClose}
            color="primary"
          >
            Ok
          </Button>
          <Button
            onClick={handleMessageConfirmEmailParentClose}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default injectIntl(ProgramsTable);
