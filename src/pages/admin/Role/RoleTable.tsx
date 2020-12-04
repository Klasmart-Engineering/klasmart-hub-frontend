import { useQuery, useReactiveVar } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { injectIntl, IntlFormatters } from "react-intl";
import "react-phone-input-2/lib/style.css";
import { currentMembershipVar } from "../../../cache";
import { Rol } from "../../../models/Rol";
import { GET_ALL_GROUPS } from "../../../operations/queries/getAllGroups";
import { constantValues } from "../constants";
import SnackBarAlert from "../SnackBarAlert/SnackBarAlert";

// @ts-ignore
const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
  },
  swatch: {
    height: "27px",
    width: "27px",
    border: "1px solid #000",
  },
  dashedData: {
    borderBottom: "1px dashed",
    color: "#cacaca",
  },
}));

/**
 * Returns function to show Rol Table in "View roles"
 */
function RolTable(props: { intl: IntlFormatters }) {
  const { intl } = props;
  const classes = useStyles();
  const [data, setData] = useState<Rol[]>([]);
  const membership = useReactiveVar(currentMembershipVar);
  const [messageSnackBar, setMessageSnackBar] = useState("");
  const [severityBar, setSeverityBar] = useState("");
  const [open, setOpen] = useState(false);

  const {
    data: rolList,
    loading: loadingGroups,
    error: errorLoadingGroups,
  } = useQuery(GET_ALL_GROUPS, {
    fetchPolicy: "network-only",
    variables: {
      organization_id: membership.organization_id,
    },
  });

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (rolList && rolList?.organization?.roles) {
      const rolesList = rolList?.organization?.roles.map((rolItem: Rol) => ({
        ...rolItem,
      }));

      setData(rolesList);
    }
  }, [rolList]);

  useEffect(() => {
    if (errorLoadingGroups) {
      setMessageSnackBar(intl.formatMessage({ id: "groups_errorDisplay" }));
      setSeverityBar("error");
      setOpen(true);
    }
  }, [errorLoadingGroups, intl]);

  if (loadingGroups) {
    return <></>;
  }

  return (
    <div className={classes.root}>
      <MaterialTable
        /** Material icons that the table uses */
        icons={constantValues.tableIcons}
        /** All options of table */
        options={{
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
            title: intl.formatMessage({ id: "groups_roleTitle" }),
            field: "role_name",
          },
        ]}
        /** Data to be rendered */
        data={data}
        /** All text for localization */
        localization={{
          header: {
            actions: "",
          },
          body: {
            addTooltip: intl.formatMessage({ id: "groups_addTooltip" }),
            deleteTooltip: intl.formatMessage({
              id: "groups_deleteRowTooltip",
            }),
            editTooltip: intl.formatMessage({ id: "groups_editRowTooltip" }),
            emptyDataSourceMessage: intl.formatMessage({
              id: "groups_noRecords",
            }),
            editRow: {
              saveTooltip: intl.formatMessage({ id: "groups_saveRowTooltip" }),
              cancelTooltip: intl.formatMessage({
                id: "groups_cancelSaveRowTooltip",
              }),
              deleteText: intl.formatMessage({ id: "groups_deleteRowText" }),
            },
          },
          toolbar: {
            searchPlaceholder: intl.formatMessage({
              id: "groups_searchPlaceholder",
            }),
            searchTooltip: intl.formatMessage({ id: "groups_searchTooltip" }),
          },
          pagination: {
            labelDisplayedRows: `{from}-{to} ${intl.formatMessage({
              id: "groups_labelDisplayedRows",
            })} {count}`,
            labelRowsSelect: intl.formatMessage({
              id: "groups_labelRowsSelect",
            }),
            nextTooltip: intl.formatMessage({ id: "groups_nextTooltip" }),
            previousTooltip: intl.formatMessage({
              id: "groups_previousTooltip",
            }),
            firstTooltip: intl.formatMessage({ id: "groups_firstTooltip" }),
            lastTooltip: intl.formatMessage({ id: "groups_lastTooltip" }),
          },
        }}
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

export default injectIntl(RolTable);
