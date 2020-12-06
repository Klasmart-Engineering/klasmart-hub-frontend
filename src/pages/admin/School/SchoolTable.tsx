import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import {
    FormControl,
    MenuItem,
    OutlinedInput,
    Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Delete } from "@material-ui/icons";
import _get from "lodash/get";
import MaterialTable, { EditComponentProps } from "material-table";
import React, { useEffect, useState } from "react";
import { injectIntl, IntlFormatters } from "react-intl";
import { currentMembershipVar } from "../../../cache";
import { School } from "../../../models/School";
import { EDIT_SCHOOL } from "../../../operations/mutations/editSchool";
import { CREATE_SCHOOL } from "../../../operations/mutations/newSchool";
import { GET_SCHOOLS_FROM_ORGANIZATION } from "../../../operations/queries/getSchoolsFromOrganization";
import { constantValues } from "../constants";
import SnackBarAlert from "../SnackBarAlert/SnackBarAlert";

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

const useStyles = makeStyles(() => ({
    date: {
        color: "#919398",
        width: "max-content",
    },
    containerTable: {
        "width": "100%",
        "& table": {
        overflowY: "auto",
        },
    },
    fileInput: {
        display: "none",
        borderStyle: "dashed",
    },
    swatch: {
        height: "27px",
        width: "27px",
        border: "1px solid #000",
    },
    buttonChangeEmail: {
        fontSize: "15px",
        fontWeight: "bold",
        color: "#898686",
        borderColor: "#FF3030",
    },
    colorLink: {
        color: "#898686",
        textDecoration: "none",
    },
    dashedData: {
        borderBottom: "1px dashed",
        color: "#cacaca",
    },
}));

/**
 * Returns function to show School Table in "View School section"
 */
function SchoolTable(props: { intl: IntlFormatters }) {
    const { intl } = props;
    const classes = useStyles();
    const [dataTable, setData] = useState<School[]>([]);
    const [createSchool] = useMutation(CREATE_SCHOOL);
    const [messageSnackBar, setMessageSnackBar] = useState("");
    const [severityBar, setSeverityBar] = useState("");
    const [open, setOpen] = useState(false);
    const membership = useReactiveVar(currentMembershipVar);
    const [editSchool, { loading: editSchoolLoading }] = useMutation(EDIT_SCHOOL);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const {
        data: organizationSchools,
        refetch,
        loading: loadingSchools,
        error,
        } = useQuery(GET_SCHOOLS_FROM_ORGANIZATION, {
        variables: {
            organization_id: membership.organization_id,
        },
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if (organizationSchools) {
            const schools = _get(organizationSchools, "organization.schools", []);
            const schoolArray = schools.map((userItem: School) => ({ ...userItem }));
            setData(schoolArray);
        }
    }, [organizationSchools]);

    useEffect(() => {
        if (error) {
            setMessageSnackBar(intl.formatMessage({ id: "schools_errorDisplay" }));
            setSeverityBar("error");
            setOpen(true);
        }
    }, [error, intl]);

    const addSchool = async (school: School): Promise<void> => {
        try {
            const { school_name } = school;

            await createSchool({
            variables: {
                organization_id: membership.organization_id,
                school_name,
            },
            });

            await refetch();
            setMessageSnackBar(
            intl.formatMessage({ id: "schools_saveSuccessfulMessage" }),
            );
            setSeverityBar("success");
            setOpen(true);
        } catch (error) {
            setMessageSnackBar(intl.formatMessage({ id: "schools_saveFailMessage" }));
            setSeverityBar("error");
            setOpen(true);
        }
        };

    const edit = async (school: School): Promise<void> => {
        try {
            const { school_id, school_name } = school;

            await editSchool({
            variables: {
                school_id,
                school_name,
            },
            });

            await refetch();
            setMessageSnackBar(
            intl.formatMessage({ id: "schools_saveSuccessfulMessage" }),
            );
            setSeverityBar("success");
            setOpen(true);
        } catch (error) {
            setMessageSnackBar(intl.formatMessage({ id: "schools_saveFailMessage" }));
            setSeverityBar("error");
            setOpen(true);
        }
        };

    return (
        <div className={classes.containerTable}>
            <MaterialTable
                icons={constantValues.tableIcons}
                isLoading={loadingSchools || editSchoolLoading}
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
                    title: intl.formatMessage({ id: "schools_schoolNameTitle" }),
                    field: "school_name",
                    type: "string",
                    cellStyle: {
                    width: 200,
                    minWidth: 200,
                    },
                    initialEditValue: "",
                    // TODO: validation causes overload error
                    // validate: (
                    //     rowData
                    // ): boolean | { isValid: boolean; helperText: string } => {
                    //     return rowData.school_name!.length < 1
                    //     ? {
                    //         isValid: false,
                    //         helperText: "School name can't be empty",
                    //         }
                    //     : true;
                    // },
                },
                {
                    title: intl.formatMessage({ id: "schools_gradesTitle" }),
                    field: "grades",
                    initialEditValue: [constantValues.noSpecificGradeValue],
                    render: (rowData: any) => {
                    if (rowData.grades?.length) {
                        return rowData.grades.map((item: string, index: number) => {
                        return (
                            <span key={`demo_snap_${index}`}>
                            {(index ? ", " : "") + item}
                            </span>
                        );
                        });
                    } else {
                        return <span>{constantValues.noSpecificGradeValue}</span>;
                    }
                    },
                    editComponent: (props: EditComponentProps<any>) => {
                    return (
                        <FormControl variant="outlined">
                        <Select
                            multiple
                            value={props.value || [constantValues.noSpecificGradeValue]}
                            onChange={(
                            event: React.ChangeEvent<{ value: unknown }>,
                            ): void => {
                            let valueSelected: string[] = event.target
                                .value as string[];

                            if (
                                valueSelected.includes(constantValues.allGradesValue)
                            ) {
                                if (
                                valueSelected[valueSelected.length - 1] ===
                                constantValues.allGradesValue
                                ) {
                                valueSelected = valueSelected.filter(
                                    (item: string) =>
                                    item === constantValues.allGradesValue,
                                );
                                } else {
                                valueSelected = valueSelected.filter(
                                    (item: string) =>
                                    item !== constantValues.allGradesValue,
                                );
                                }
                            }

                            if (
                                valueSelected.includes(
                                constantValues.noSpecificGradeValue,
                                )
                            ) {
                                if (
                                valueSelected[valueSelected.length - 1] ===
                                constantValues.noSpecificGradeValue
                                ) {
                                valueSelected = valueSelected.filter(
                                    (item: string) =>
                                    item === constantValues.noSpecificGradeValue,
                                );
                                } else {
                                valueSelected = valueSelected.filter(
                                    (item: string) =>
                                    item !== constantValues.noSpecificGradeValue,
                                );
                                }
                            }
                            props.onChange(valueSelected);
                            }}
                            input={<OutlinedInput />}
                            MenuProps={MenuProps}
                            variant="outlined"
                        >
                            <MenuItem
                            key={constantValues.allGradesValue}
                            value={constantValues.allGradesValue}
                            >
                            All Grades
                            </MenuItem>
                            <MenuItem
                            key={constantValues.noSpecificGradeValue}
                            value={constantValues.noSpecificGradeValue}
                            >
                            Non Specific
                            </MenuItem>
                        </Select>
                        </FormControl>
                    );
                    },
                },
                ]}
                data={dataTable}
                editable={{
                onRowAdd: (newData): Promise<void> =>
                    new Promise((resolve, reject) => {
                    if (newData.grades) {
                        if (newData.grades.includes(constantValues.allGradesValue)) {
                        newData.grades = constantValues.gradesData.map(
                            (itemGrade) => itemGrade.id,
                        );
                        } else if (
                        newData.grades.includes(constantValues.noSpecificGradeValue)
                        ) {
                        newData.grades = [];
                        }
                    }

                    addSchool(newData)
                        .then((e) => {
                        console.log("School created successfully", e);
                        resolve();
                        })
                        .catch((e) => {
                        console.log("Error at creating school", e);
                        reject();
                        });
                    }),
                onRowUpdate: (newData): Promise<void> =>
                    new Promise((resolve, reject) => {
                    edit(newData)
                        .then((e) => {
                        console.log("School edited successfully", e);
                        resolve();
                        })
                        .catch((e) => {
                        console.log("Error at editing school", e);
                        reject();
                        });
                    }),
                onRowDelete: (): Promise<void> =>
                    new Promise((resolve) => {
                    resolve();
                    }),
                }}
                localization={{
                header: {
                    actions: "",
                },
                body: {
                    emptyDataSourceMessage: intl.formatMessage({
                    id: "schools_noRecords",
                    }),
                    addTooltip: intl.formatMessage({ id: "schools_addTooltip" }),
                    deleteTooltip: intl.formatMessage({
                    id: "schools_deleteRowTooltip",
                    }),
                    editTooltip: intl.formatMessage({ id: "schools_editRowTooltip" }),
                    editRow: {
                    saveTooltip: intl.formatMessage({ id: "schools_saveRowTooltip" }),
                    cancelTooltip: intl.formatMessage({
                        id: "schools_cancelSaveRowTooltip",
                    }),
                    deleteText: intl.formatMessage({ id: "schools_deleteRowText" }),
                    },
                },
                toolbar: {
                    searchPlaceholder: intl.formatMessage({
                    id: "schools_searchPlaceholder",
                    }),
                    searchTooltip: intl.formatMessage({ id: "schools_searchTooltip" }),
                    exportTitle: intl.formatMessage({ id: "schools_exportTooltip" }),
                    exportCSVName: intl.formatMessage({ id: "schools_exportCSVName" }),
                    exportPDFName: intl.formatMessage({ id: "schools_exportPDFName" }),
                },
                pagination: {
                    labelDisplayedRows: `{from}-{to} ${intl.formatMessage({
                    id: "schools_labelDisplayedRows",
                    })} {count}`,
                    labelRowsSelect: intl.formatMessage({
                    id: "schools_labelRowsSelect",
                    }),
                    nextTooltip: intl.formatMessage({ id: "schools_nextTooltip" }),
                    previousTooltip: intl.formatMessage({
                    id: "schools_previousTooltip",
                    }),
                    firstTooltip: intl.formatMessage({ id: "schools_firstTooltip" }),
                    lastTooltip: intl.formatMessage({ id: "schools_lastTooltip" }),
                },
                }}
                actions={[
                {
                    tooltip: intl.formatMessage({ id: "schools_actionsDeleteTooltip" }),
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

export default injectIntl(SchoolTable);
