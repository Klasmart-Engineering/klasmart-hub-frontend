import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import {
    FormControl,
    MenuItem,
    OutlinedInput,
    Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Delete } from "@material-ui/icons";
import { useSnackbar } from "kidsloop-px";
import _get from "lodash/get";
import MaterialTable, { EditComponentProps } from "material-table";
import React, { useEffect, useState } from "react";
import { injectIntl, IntlFormatters } from "react-intl";
import { currentMembershipVar } from "../../../cache";
import { School } from "../../../models/School";
import { DELETE_SCHOOL } from "../../../operations/mutations/deleteSchool";
import { EDIT_SCHOOL } from "../../../operations/mutations/editSchool";
import { CREATE_SCHOOL } from "../../../operations/mutations/newSchool";
import { GET_SCHOOLS_FROM_ORGANIZATION } from "../../../operations/queries/getSchoolsFromOrganization";
import { checkAllowed } from "../../../utils/checkAllowed";
import { constantValues } from "../constants";

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

const useStyles = makeStyles(() => ({
    buttonChangeEmail: {
        borderColor: "#FF3030",
        color: "#898686",
        fontSize: "15px",
        fontWeight: "bold",
    },
    colorLink: {
        color: "#898686",
        textDecoration: "none",
    },
    containerTable: {
        "& table": {
            overflowY: "auto",
        },
        width: "100%",
    },
    dashedData: {
        borderBottom: "1px dashed",
        color: "#cacaca",
    },
    date: {
        color: "#919398",
        width: "max-content",
    },
    fileInput: {
        borderStyle: "dashed",
        display: "none",
    },
    swatch: {
        border: "1px solid #000",
        height: "27px",
        width: "27px",
    },
    activeColor: { color: "#2BA600", fontWeight: "bold" },
    inactiveColor: { color: "#FF0000", fontWeight: "bold" },
}));

/**
 * Returns function to show School Table in "View School section"
 */
function SchoolTable(props: { intl: IntlFormatters }) {
    const { intl } = props;
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [dataTable, setData] = useState<School[]>([]);
    const [createSchool] = useMutation(CREATE_SCHOOL);
    const membership = useReactiveVar(currentMembershipVar);
    const [editSchool, { loading: editSchoolLoading }] = useMutation(
        EDIT_SCHOOL,
    );
    const [deleteSchoolMutation] = useMutation(DELETE_SCHOOL);
    const organization = useReactiveVar(currentMembershipVar);
    const organization_id = organization.organization_id;
    const [canCreate, setCanCreate] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const createAllowed = checkAllowed(organization_id, "create_school_20220");
    const editAllowed = checkAllowed(organization_id, "edit_school_20330");
    const deleteAllowed = checkAllowed(organization_id, "delete_school_20440");

    const {
        data: organizationSchools,
        refetch,
        loading: loadingSchools,
    } = useQuery(GET_SCHOOLS_FROM_ORGANIZATION, {
        fetchPolicy: "network-only",
        variables: {
            organization_id: membership.organization_id,
        },
    });

    useEffect(() => {
        if (organizationSchools) {
            const schools = _get(
                organizationSchools,
                "organization.schools",
                [],
            );

            const schoolArray = schools.map((userItem: School) => ({
                ...userItem,
            }));
            setData(schoolArray);
        }
    }, [organizationSchools, loadingSchools]);

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
                isEditable: (rowData: any) => rowData.status === "active" && canEdit,
                onRowAdd: (newData: any): Promise<void> =>
                    new Promise((resolve, reject) => {
                        if (newData.grades) {
                            if (
                                newData.grades.includes(
                                    constantValues.allGradesValue,
                                )
                            ) {
                                newData.grades = constantValues.gradesData.map(
                                    (itemGrade) => itemGrade.id,
                                );
                            } else if (
                                newData.grades.includes(
                                    constantValues.noSpecificGradeValue,
                                )
                            ) {
                                newData.grades = [];
                            }
                        }

                        create(newData)
                            .then((e) => {
                                console.log("School created successfully", e);
                                resolve();
                            })
                            .catch((e) => {
                                console.log("Error at creating school", e);
                                reject();
                            });
                    }),
                onRowUpdate: (newData: any): Promise<void> =>
                    new Promise((resolve, reject) => {
                        update(newData)
                            .then((e) => {
                                console.log("School edited successfully", e);
                                resolve();
                            })
                            .catch((e) => {
                                console.log("Error at editing school", e);
                                reject();
                            });
                    }),
                onRowDelete: (newData: any): Promise<void> =>
                    new Promise((resolve, reject) => {
                        remove(newData)
                            .then((e) => {
                                console.log("School removed successfully", e);
                                resolve();
                            })
                            .catch((e) => {
                                console.log("Error at editing school", e);
                                reject();
                            });
                    }),
            }
            : {
                isDeletable: (rowData: any) => rowData.status === "active" && canDelete,
                isEditable: (rowData: any) => rowData.status === "active" && canEdit,
                onRowUpdate: (newData: any): Promise<void> =>
                    new Promise((resolve, reject) => {
                        update(newData)
                            .then((e) => {
                                console.log("School edited successfully", e);
                                resolve();
                            })
                            .catch((e) => {
                                console.log("Error at editing school", e);
                                reject();
                            });
                    }),
                onRowDelete: (newData: any): Promise<void> =>
                    new Promise((resolve, reject) => {
                        remove(newData)
                            .then((e) => {
                                console.log("School removed successfully", e);
                                resolve();
                            })
                            .catch((e) => {
                                console.log("Error at editing school", e);
                                reject();
                            });
                    }),
            };
    };

    const create = async (school: School): Promise<void> => {
        try {
            const { school_name } = school;

            await createSchool({
                variables: {
                    organization_id: membership.organization_id,
                    school_name,
                },
            });
            enqueueSnackbar("School has been created successfully", { variant: "success" });
            await refetch();
        } catch (error) {
            enqueueSnackbar("An error occurred while creating the School", { variant: "error" });
        }
    };

    const update = async (school: School): Promise<void> => {
        try {
            const { school_id, school_name } = school;

            await editSchool({
                variables: {
                    school_id,
                    school_name,
                },
            });

            await refetch();
            enqueueSnackbar("School has been updated successfully", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("An error occurred while updating the School", { variant: "error" });
        }
    };

    const remove = async (school: School): Promise<void> => {
        try {
            const { school_id } = school;

            await deleteSchoolMutation({
                variables: {
                    school_id,
                },
            });

            await refetch();
            enqueueSnackbar("School has been removed successfully", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("An error occurred while removing the School", { variant: "error" });
        }
    };

    return (
        <div className={classes.containerTable}>
            <MaterialTable
                icons={constantValues.tableIcons}
                isLoading={loadingSchools || editSchoolLoading || isLoading}
                options={{
                    headerStyle: {
                        backgroundColor: "#fff",
                        color: "#000",
                        fontWeight: "bold",
                    },
                    selection: true,
                }}
                title=""
                columns={[
                    {
                        cellStyle: {
                            minWidth: 200,
                            width: 200,
                        },
                        field: "school_name",
                        initialEditValue: "",
                        title: intl.formatMessage({
                            id: "schools_schoolNameTitle",
                        }),
                        type: "string",
                        validate: (
                            rowData,
                        ):
                            | boolean
                            | { isValid: boolean; helperText: string } => {
                            // prettier-ignore
                            return rowData.school_name!.length < 1
                                ? {
                                    helperText: "School name can't be empty",
                                    isValid: false,
                                }
                                : true;
                        },
                    },
                    {
                        field: "grades",
                        initialEditValue: [constantValues.noSpecificGradeValue],
                        title: intl.formatMessage({
                            id: "schools_gradesTitle",
                        }),
                        render: (rowData) => {
                            const grades = _get(rowData, "grades", []);
                            if (grades.length) {
                                return grades.map(
                                    (item: string, index: number) => {
                                        return (
                                            <span key={`demo_snap_${index}`}>
                                                {(index ? ", " : "") + item}
                                            </span>
                                        );
                                    },
                                );
                            } else {
                                return (
                                    <span>
                                        {constantValues.noSpecificGradeValue}
                                    </span>
                                );
                            }
                        },
                        editComponent: (props: EditComponentProps<any>) => {
                            return (
                                <FormControl variant="outlined">
                                    <Select
                                        multiple
                                        value={
                                            props.value || [
                                                constantValues.noSpecificGradeValue,
                                            ]
                                        }
                                        onChange={(
                                            event: React.ChangeEvent<{
                                                value: unknown;
                                            }>,
                                        ): void => {
                                            let valueSelected: string[] = event
                                                .target.value as string[];

                                            if (
                                                valueSelected.includes(
                                                    constantValues.allGradesValue,
                                                )
                                            ) {
                                                if (
                                                    valueSelected[
                                                        valueSelected.length - 1
                                                    ] ===
                                                    constantValues.allGradesValue
                                                ) {
                                                    valueSelected = valueSelected.filter(
                                                        (item: string) =>
                                                            item ===
                                                            constantValues.allGradesValue,
                                                    );
                                                } else {
                                                    valueSelected = valueSelected.filter(
                                                        (item: string) =>
                                                            item !==
                                                            constantValues.allGradesValue,
                                                    );
                                                }
                                            }

                                            if (
                                                valueSelected.includes(
                                                    constantValues.noSpecificGradeValue,
                                                )
                                            ) {
                                                if (
                                                    valueSelected[
                                                        valueSelected.length - 1
                                                    ] ===
                                                    constantValues.noSpecificGradeValue
                                                ) {
                                                    valueSelected = valueSelected.filter(
                                                        (item: string) =>
                                                            item ===
                                                            constantValues.noSpecificGradeValue,
                                                    );
                                                } else {
                                                    valueSelected = valueSelected.filter(
                                                        (item: string) =>
                                                            item !==
                                                            constantValues.noSpecificGradeValue,
                                                    );
                                                }
                                            }
                                            props.onChange(valueSelected);
                                        }}
                                        input={<OutlinedInput />}
                                        MenuProps={menuProps}
                                        variant="outlined"
                                    >
                                        <MenuItem
                                            key={constantValues.allGradesValue}
                                            value={
                                                constantValues.allGradesValue
                                            }
                                        >
                                            All Grades
                                        </MenuItem>
                                        <MenuItem
                                            key={
                                                constantValues.noSpecificGradeValue
                                            }
                                            value={
                                                constantValues.noSpecificGradeValue
                                            }
                                        >
                                            Non Specific
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            );
                        },
                    },
                    {
                        title: intl.formatMessage({
                            id: "classes_statusTitle",
                        }),
                        field: "status",
                        cellStyle: {
                            width: 140,
                            minWidth: 140,
                        },
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
                ]}
                data={dataTable}
                editable={editableOptions()}
                localization={{
                    header: {
                        actions: "",
                    },
                    body: {
                        emptyDataSourceMessage: intl.formatMessage({
                            id: "schools_noRecords",
                        }),
                        addTooltip: intl.formatMessage({
                            id: "schools_addTooltip",
                        }),
                        deleteTooltip: intl.formatMessage({
                            id: "schools_deleteRowTooltip",
                        }),
                        editTooltip: intl.formatMessage({
                            id: "schools_editRowTooltip",
                        }),
                        editRow: {
                            saveTooltip: intl.formatMessage({
                                id: "schools_saveRowTooltip",
                            }),
                            cancelTooltip: intl.formatMessage({
                                id: "schools_cancelSaveRowTooltip",
                            }),
                            deleteText: intl.formatMessage({
                                id: "schools_deleteRowText",
                            }),
                        },
                    },
                    toolbar: {
                        searchPlaceholder: intl.formatMessage({
                            id: "schools_searchPlaceholder",
                        }),
                        searchTooltip: intl.formatMessage({
                            id: "schools_searchTooltip",
                        }),
                        exportTitle: intl.formatMessage({
                            id: "schools_exportTooltip",
                        }),
                        exportCSVName: intl.formatMessage({
                            id: "schools_exportCSVName",
                        }),
                        exportPDFName: intl.formatMessage({
                            id: "schools_exportPDFName",
                        }),
                    },
                    pagination: {
                        labelDisplayedRows: `{from}-{to} ${intl.formatMessage({
                            id: "schools_labelDisplayedRows",
                        })} {count}`,
                        labelRowsSelect: intl.formatMessage({
                            id: "schools_labelRowsSelect",
                        }),
                        nextTooltip: intl.formatMessage({
                            id: "schools_nextTooltip",
                        }),
                        previousTooltip: intl.formatMessage({
                            id: "schools_previousTooltip",
                        }),
                        firstTooltip: intl.formatMessage({
                            id: "schools_firstTooltip",
                        }),
                        lastTooltip: intl.formatMessage({
                            id: "schools_lastTooltip",
                        }),
                    },
                }}
                actions={[
                    {
                        tooltip: intl.formatMessage({
                            id: "schools_actionsDeleteTooltip",
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

export default injectIntl(SchoolTable);
