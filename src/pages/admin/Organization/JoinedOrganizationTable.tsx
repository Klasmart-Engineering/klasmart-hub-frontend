import { useQuery } from "@apollo/client/react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import _get from "lodash/get";
import MaterialTable from "material-table";
import React, { useState } from "react";
import { useEffect } from "react";
import { injectIntl, IntlFormatters } from "react-intl";
import "react-phone-input-2/lib/style.css";
import { GET_ORGANIZATIONS } from "../../../operations/queries/getOrganizations";
import { constantValues } from "../constants";
import {
  JoinedOrganizationsTitle,
  OrganizationNameTitle,
  OwnerEmailTitle,
  OwnerRoleTitle,
  PhoneTitle,
  RoleTitle,
} from "./Labels";

interface OrgRowData {
  __typename: string;
  organization: {
    __typename: string;
    organization_id: string;
    organization_name: string;
    phone: string | number | null;
    owner: { __typename: string; email: string };
  };
  roles: Array<{ __typename: string; role_id: string; role_name: string }>;
}

// @ts-ignore
const useStyles = makeStyles(() => ({
  root: {
    maxWidth: "100%",
  },
  buttonLeave: {
    fontSize: "15px",
    fontWeight: "bold",
    width: "max-content",
    color: "#FF3030",
    borderColor: "#FF3030",
  },
}));

/**
 * Returns function to show Joined Organizations table
 */
function JoinedOrganizationTable(props: { intl: IntlFormatters }) {
  const { intl } = props;
  const classes = useStyles();

  const { data, loading } = useQuery(GET_ORGANIZATIONS, {
    fetchPolicy: "network-only",
  });

  const [dataTable, setData] = useState<OrgRowData[]>([]);

  useEffect(() => {
    if (data) {
      const myEmail = data.me.email;
      const memberships: OrgRowData[] = _get(data, "me.memberships", false);
      if (memberships) {
        const joined_organization: any[] = memberships.filter(
          (m: any) => myEmail !== m.organization.owner.email,
        );
        const editable: OrgRowData[] = joined_organization.map(
          (o: OrgRowData) => ({ ...o }),
        );
        setData(editable);
      }
    }
  }, [data]);

  const [
    dialogMessageConfirmEmailParent,
    setConfirmLeaveOrganization,
  ] = useState(false);

  const showConfirmLeaveOrganization = () => {
    setConfirmLeaveOrganization(true);
  };

  const closeConfirmLeaveOrganization = () => {
    setConfirmLeaveOrganization(false);
  };

  const [dialogMessageConfirmMessage, setConfirmationMessage] = useState(false);

  const showConfimationMessage = () => {
    setConfirmLeaveOrganization(false);
    setConfirmationMessage(true);
  };

  const closeConfimationMessage = () => {
    setConfirmationMessage(false);
  };

  return (
    <div className={classes.root}>
      <MaterialTable
        isLoading={loading}
        /** Material icons that the table uses */
        icons={constantValues.tableIcons}
        /** All options of table */
        options={{
          headerStyle: {
            backgroundColor: "#fff",
            color: "#000",
            fontWeight: "bold",
          },
          actionsColumnIndex: -1,
        }}
        /** Table Title (only render if toolbar option is true */
        title={JoinedOrganizationsTitle()}
        /** Column definitions */
        columns={[
          {
            title: OrganizationNameTitle(),
            field: "name",
            type: "string",
            render: (rowData: OrgRowData) => (
              <span>{rowData.organization.organization_name}</span>
            ),
          },
          {
            title: PhoneTitle(),
            field: "phone",
            type: "string",
            render: (rowData: OrgRowData) => (
              <span>
                {rowData.organization.phone ? rowData.organization.phone : "-"}
              </span>
            ),
          },
          {
            title: OwnerEmailTitle(),
            field: "email",
            type: "string",
            render: (rowData: OrgRowData) => (
              <span>{rowData.organization.owner.email}</span>
            ),
          },
          {
            title: OwnerRoleTitle(),
            field: "role",
            type: "string",
            render: (rowData: OrgRowData) => (
              <span>
                {rowData.roles?.map((e: any) => {
                  return <div key={e.role_id}>{e.role_name}</div>;
                })}
              </span>
            ),
          },
        ]}
        /** Data to be rendered */
        data={dataTable}
        /** All text for localization */
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
        /** Action list. An icon button will be rendered for each actions */
        actions={[
          {
            icon: "save",
            tooltip: "Save User",
            onClick: (event, rowData) => showConfirmLeaveOrganization(),
          },
        ]}
        components={{
          Action: (props) => (
            <Button
              className={classes.buttonLeave}
              onClick={(event) => props.action.onClick(event, props.data)}
            >
              {intl.formatMessage({
                id: "allOrganization_leaveOrganizationButton",
              })}
            </Button>
          ),
        }}
      />

      <Dialog
        open={dialogMessageConfirmEmailParent}
        onClose={closeConfirmLeaveOrganization}
      >
        <DialogTitle></DialogTitle>
        <DialogContent dividers>
          <p>
            {intl.formatMessage({
              id: "allOrganization_leaveOrganizationConfirm",
            })}
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={showConfimationMessage} color="primary">
            {intl.formatMessage({ id: "allOrganization_okButton" })}
          </Button>
          <Button color="primary" onClick={closeConfirmLeaveOrganization}>
            {intl.formatMessage({ id: "allOrganization_cancelButton" })}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogMessageConfirmMessage}
        onClose={closeConfirmLeaveOrganization}
      >
        <DialogTitle></DialogTitle>
        <DialogContent dividers>
          <p>
            {intl.formatMessage({
              id: "allOrganization_leftOrganizationMessage",
            })}
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfimationMessage} color="primary">
            {intl.formatMessage({ id: "allOrganization_okButton" })}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default injectIntl(JoinedOrganizationTable);
