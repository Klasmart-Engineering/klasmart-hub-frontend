import { useDeleteClass } from "@/api/classes";
import ClassRoster from "@/components/Class/ClassRoster/Table";
import ClassDetailsDrawer from "@/components/Class/DetailsDrawer";
import CreateClassDialog from "@/components/Class/Dialog/Create";
import UploadClassCsvDialog from "@/components/Class/Dialog/CsvUpload";
import EditClassDialog from "@/components/Class/Dialog/Edit";
import globalStyles from "@/globalStyles";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    Class,
    Status,
    Subject,
} from "@/types/graphQL";
import { useDeleteEntityPrompt } from "@/utils/common";
import {
    buildCsvTemplateOptions,
    EMPTY_CSV_DATA,
} from "@/utils/csv";
import { useGetTableFilters } from "@/utils/filters";
import { usePermission } from "@/utils/permissions";
import {
    getTableLocalization,
    TableProps,
} from "@/utils/table";
import { useValidations } from "@/utils/validations";
import {
    CursorTable,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { TableFilter } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Filter/Filters";
import { TableColumn } from "@kl-engineering/kidsloop-px/dist/src/components/Table/Common/Head";
import {
    Add as AddIcon,
    AssignmentReturned as AssignmentReturnedIcon,
    CloudUpload as CloudIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ViewList as ViewListIcon,
} from "@mui/icons-material";
import {
    Chip,
    Link,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import React,
{ useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => {
    const { clickable, primaryText } = globalStyles(theme);
    return createStyles({
        clickable,
        primaryText,
        containerTable: {
            width: `100%`,
            "& table": {
                overflowY: `auto`,
            },
        },
        activeColor: {
            color: `#2BA600`,
            fontWeight: `bold`,
        },
        inactiveColor: {
            color: `#FF0000`,
            fontWeight: `bold`,
        },
        statusText: {
            fontWeight: `bold`,
            textTransform: `capitalize`,
        },
        chip: {
            margin: theme.spacing(0.25),
        },
    });
});

export const isActive = (classItem: Class) => classItem.status === Status.ACTIVE;

interface ProgramSubject {
    programName: string;
    subjects: Subject[];
}

export interface ClassDetails {
    className: string;
    programSubjects: ProgramSubject[];
    teachers: string[];
    students: string[];
}

export interface ClassRow {
    id: string;
    name: string;
    ageRanges: string[];
    schoolNames: string[];
    grades: string[];
    programs: string[];
    subjects: string[];
    status: string;
    ageRangeFrom?: string;
    ageRangeTo?: string;
    academicTerm?: string;
}

interface Props extends TableProps<ClassRow> {
    showAcademicTermFilter: boolean;
    filteredSchoolId: string;
}

export default function ClassesTable (props: Props) {
    const {
        disabled,
        showSelectables,
        selectedIds,
        onSelected,
        rows,
        hasNextPage,
        hasPreviousPage,
        startCursor,
        endCursor,
        total,
        order,
        orderBy,
        onPageChange,
        rowsPerPage,
        onTableChange,
        refetch,
        loading,
        showAcademicTermFilter,
        filteredSchoolId,
    } = props;

    const classes = useStyles();
    const [ uploadCsvDialogOpen, setUploadCsvDialogOpen ] = useState(false);
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const canCreate = usePermission(`create_class_20224`);
    const canEdit = usePermission(`edit_class_20334`);
    const canDelete = usePermission(`delete_class_20444`);
    const [ editDialogOpen, setEditDialogOpen ] = useState(false);
    const [ createDialogOpen, setCreateDialogOpen ] = useState(false);
    const [ detailsDrawerOpen, setDetailsDrawerOpen ] = useState(false);
    const currentOrganization = useCurrentOrganization();
    const [ selectedClassId, setSelectedClassId ] = useState<string>();
    const [ classRosterDialogOpen, setClassRosterDialogOpen ] = useState(false);
    const [ selectedIds_, setSelectedIds ] = useState<string[]>(selectedIds ?? []);
    const [ deleteClass ] = useDeleteClass();
    const { required } = useValidations();
    const deletePrompt = useDeleteEntityPrompt();
    const {
        schoolsFilterValueOptions,
        programsFilterValueOptions,
        ageRangesLowValueOptions,
        ageRangesHighValueOptions,
        subjectFilterValueOptions,
        gradeFilterValueOptions,
        academicTermValueOptions,
    } = useGetTableFilters(currentOrganization?.id ?? ``, {
        querySchools: true,
        queryPrograms: true,
        queryAgeRanges: true,
        querySubjects: true,
        queryGrades: true,
        queryAcademicTerm: {
            schoolId: filteredSchoolId,
        },
    });

    const classCsvTemplateHeaders = [
        `organization_name`,
        `class_name`,
        `class_shortcode`,
        `school_name`,
        `program_name`,
        `grade_name`,
        `subject_name`,
        `age_range_low_value`,
        `age_range_high_value`,
        `age_range_unit`,
        `academic_period`,
    ];

    const csvExporter = buildCsvTemplateOptions({
        filename: intl.formatMessage({
            id: `entity.class.importTemplate.filename`,
        }),
        headers: classCsvTemplateHeaders,
    });

    const setIds = (ids: string[]) => {
        setSelectedIds(ids);
        onSelected?.(ids);
    };

    const editSelectedRow = (row: ClassRow) => {
        setSelectedClassId(row.id);
        setEditDialogOpen(true);
    };

    const goToClassRoster = (classId: string) => {
        if(selectedClassId !== undefined) {
            setClassRosterDialogOpen(false);
            setSelectedClassId(undefined);
            setTimeout(() => {
                setSelectedClassId(classId);
                setClassRosterDialogOpen(true);
            }, 500);
            return;
        }
        setSelectedClassId(classId);
        setClassRosterDialogOpen(true);
    };

    const academicTermFilter: TableFilter<ClassRow> = {
        id: `academicTerm`,
        label: intl.formatMessage({
            id: `academicTerm.label`,
            defaultMessage: `Academic Term`,
        }),
        operators: [
            {
                label: intl.formatMessage({
                    id: `generic_filtersEqualsLabel`,
                }),
                value: `eq`,
                multipleValues: true,
                validations: [ required() ],
                options: academicTermValueOptions,
                chipLabel: (column, value) => (
                    intl.formatMessage({
                        id: `generic_filtersEqualsChipLabel`,
                    }, {
                        column,
                        value,
                    })
                ),
                valueComponent: `select`,
            },
        ],
    };

    const filters: TableFilter<ClassRow>[] = [
        {
            id: `schoolNames`,
            label: intl.formatMessage({
                id: `classes_schoolsNameLabel`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    multipleValues: true,
                    validations: [ required() ],
                    options: schoolsFilterValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `select`,
                },
            ],
        },
        {
            id: `ageRangeFrom`,
            label: intl.formatMessage({
                id: `generic_filtersAgeRangesFrom`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    multipleValues: true,
                    validations: [ required() ],
                    options: ageRangesLowValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `select`,
                },
            ],
        },
        {
            id: `ageRangeTo`,
            label: intl.formatMessage({
                id: `generic_filtersAgeRangesTo`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    multipleValues: true,
                    validations: [ required() ],
                    options: ageRangesHighValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `select`,
                },
            ],
        },
        {
            id: `grades`,
            label: intl.formatMessage({
                id: `generic_filtersGradesLabel`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    multipleValues: true,
                    validations: [ required() ],
                    options: gradeFilterValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `select`,
                },
            ],
        },
        {
            id: `programs`,
            label: intl.formatMessage({
                id: `programs_title`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    multipleValues: true,
                    validations: [ required() ],
                    options: programsFilterValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `select`,
                },
            ],
        },
        {
            id: `subjects`,
            label: intl.formatMessage({
                id: `generic_filtersSubjectsLabel`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    multipleValues: true,
                    validations: [ required() ],
                    options: subjectFilterValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `select`,
                },
            ],
        },
        ...showAcademicTermFilter ? [ academicTermFilter ] : [],
        {
            id: `status`,
            label: intl.formatMessage({
                id: `classes_statusTitle`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    validations: [ required() ],
                    options: [
                        {
                            value: Status.ACTIVE,
                            label: intl.formatMessage({
                                id: `data_activeStatus`,
                            }),
                        },
                        {
                            value: Status.INACTIVE,
                            label: intl.formatMessage({
                                id: `data_inactiveStatus`,
                            }),
                        },
                    ],
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                    valueComponent: `select`,
                },
            ],
        },
    ];

    const handleDeleteRowClick = async (row: ClassRow) => {
        if (!(await deletePrompt({
            title: intl.formatMessage({
                id: `class_deleteClassTitle`,
            }),
            entityName: row.name,
        }))) return;
        try {
            await deleteClass({
                variables: {
                    class_id: row.id,
                },
            });
            enqueueSnackbar(intl.formatMessage({
                id: `classes_classDeletedMessage`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `classes_classDeletedError`,
            }), {
                variant: `error`,
            });
        }
    };

    const columns: TableColumn<ClassRow>[] = [
        {
            id: `id`,
            label: intl.formatMessage({
                id: `generic_idLabel`,
            }),
            hidden: true,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `classes_classTitle`,
            }),
            persistent: true,
            render: (row) => (
                <Link
                    href={undefined}
                    className={clsx(classes.clickable, classes.primaryText)}
                    onClick={() => {
                        goToClassRoster(row.id);
                    }}
                >
                    {row.name}
                </Link>
            ),
        },
        {
            id: `schoolNames`,
            label: intl.formatMessage({
                id: `classes_schoolsNameLabel`,
            }),
            disableSort: true,
            disableSearch: disabled,
            render: (row) => (
                <>
                    {row.schoolNames.map((school, i) => (
                        <Chip
                            key={`school-${i}`}
                            label={school}
                            className={classes.chip}
                        />
                    ))}
                </>),
        },
        {
            id: `ageRanges`,
            label: intl.formatMessage({
                id: `schools_ageRangesLabel`,
            }),
            disableSort: true,
            disableSearch: disabled,
            render: (row) => (
                <>
                    {row.ageRanges.map((ageRange, i) => (
                        <Chip
                            key={`ageRange-${i}`}
                            label={ageRange}
                            className={classes.chip}
                        />
                    ))}
                </>
            ),
        },
        {
            id: `academicTerm`,
            label: intl.formatMessage({
                id: `academicTerm.label`,
                defaultMessage: `Academic Term`,
            }),
            disableSort: true,
            disableSearch: disabled,
            hidden: true,
            render: (row) => (
                <>
                    {row.academicTerm &&
                        <Chip
                            label={row.academicTerm}
                            className={classes.chip}
                        />
                    }
                </>
            ),
        },
        {
            id: `grades`,
            label: intl.formatMessage({
                id: `schools_gradesLabel`,
            }),
            disableSort: true,
            disableSearch: disabled,
            render: (row) => (
                <>
                    {row.grades.map((grade, i) => (
                        <Chip
                            key={`grade-${i}`}
                            label={grade}
                            className={classes.chip}
                        />
                    ))}
                </>
            ),
        },
        {
            id: `programs`,
            label: intl.formatMessage({
                id: `schools_programsLabel`,
            }),
            disableSort: true,
            disableSearch: disabled,
            render: (row) => (
                <>
                    {row.programs.map((program, i) => (
                        <Chip
                            key={`program-${i}`}
                            label={program}
                            className={classes.chip}
                        />
                    ))}
                </>
            ),
        },
        {
            id: `subjects`,
            label: intl.formatMessage({
                id: `schools_subjectsLabel`,
            }),
            disableSort: true,
            disableSearch: disabled,
            render: (row) => (
                <>
                    {row.subjects.map((subject, i) => (
                        <Chip
                            key={`subject-${i}`}
                            label={subject}
                            className={classes.chip}
                        />
                    ))}
                </>
            ),
        },
        {
            id: `status`,
            label: intl.formatMessage({
                id: `classes_statusTitle`,
            }),
            disableSort: true,
            disableSearch: disabled,
            render: (row) => (
                <span
                    className={clsx(classes.statusText, {
                        [classes.activeColor]: row.status === Status.ACTIVE,
                        [classes.inactiveColor]: row.status === Status.INACTIVE,
                    })}
                >
                    {intl.formatMessage({
                        id: `data_${row.status}Status`,
                    })}
                </span>
            ),
        },
    ];

    const rowActions = (row: ClassRow) => ([
        {
            label: intl.formatMessage({
                id: `class_viewDetailsLabel`,
            }),
            icon: ViewListIcon,
            onClick: (row: ClassRow) => {
                setSelectedClassId(row.id);
                setDetailsDrawerOpen(true);
            },
        },
        {
            label: intl.formatMessage({
                id: `classes_editRowTooltip`,
            }),
            icon: EditIcon,
            disabled: !(row.status === Status.ACTIVE && canEdit),
            onClick: editSelectedRow,
        },
        {
            label: intl.formatMessage({
                id: `classes_deleteRowTooltip`,
            }),
            icon: DeleteIcon,
            disabled: !(row.status === Status.ACTIVE && canDelete),
            onClick: handleDeleteRowClick,
        },
    ]);

    const localization = getTableLocalization(intl, {
        title: intl.formatMessage({
            id: `adminHeader_viewClasses`,
        }),
        placeholder: intl.formatMessage({
            id: `classes_searchPlaceholder`,
        }),
    });

    const primaryAction = ({
        label: intl.formatMessage({
            id: `classes_createClassLabel`,
        }),
        icon: AddIcon,
        disabled: !canCreate,
        onClick: () => setCreateDialogOpen(true),
    });

    const secondaryActions = [
        {
            label: intl.formatMessage({
                id: `entity.user.template.download.button`,
            }),
            icon: AssignmentReturnedIcon,
            disabled: !canCreate,
            onClick: () => csvExporter.generateCsv(EMPTY_CSV_DATA),
        },
        {
            label: intl.formatMessage({
                id: `entity.user.bulkImport.button`,
            }),
            icon: CloudIcon,
            disabled: !canCreate,
            onClick: () => {
                setUploadCsvDialogOpen(true);
            },
        },
    ];

    return (
        <>
            <CursorTable
                filters={filters}
                showSelectables={showSelectables}
                idField="id"
                orderBy={orderBy}
                order={order}
                rows={rows}
                rowsPerPage={rowsPerPage}
                selectedRows={selectedIds_}
                hasNextPage={!loading ? hasNextPage : false}
                hasPreviousPage={!loading ? hasPreviousPage : false}
                startCursor={startCursor}
                endCursor={endCursor}
                total={total}
                columns={columns}
                loading={loading}
                primaryAction={!disabled ? primaryAction : undefined}
                secondaryActions={secondaryActions}
                rowActions={!disabled ? rowActions : undefined}
                localization={localization}
                onSelected={setIds}
                onPageChange={onPageChange}
                onChange={onTableChange}
            />

            <EditClassDialog
                open={editDialogOpen}
                classId={selectedClassId}
                onClose={(value) => {
                    setSelectedClassId(undefined);
                    setEditDialogOpen(false);
                    if (value) refetch?.();
                }}
            />

            <CreateClassDialog
                open={createDialogOpen}
                onClose={(value) => {
                    setCreateDialogOpen(false);
                    if (value) refetch?.();
                }}
            />

            <ClassDetailsDrawer
                open={detailsDrawerOpen}
                classId={selectedClassId}
                setClassRosterDialogOpen={setClassRosterDialogOpen}
                setSelectedClassId={setSelectedClassId}
                onClose={() => {
                    setSelectedClassId(undefined);
                    setDetailsDrawerOpen(false);
                }}
            />

            {selectedClassId &&
                <ClassRoster
                    open={classRosterDialogOpen}
                    organizationId={currentOrganization?.id ?? ``}
                    classId={selectedClassId}
                    goToClassRoster={goToClassRoster}
                    onClose={() => {
                        setClassRosterDialogOpen(false);
                    }}
                />
            }

            <UploadClassCsvDialog
                open={uploadCsvDialogOpen}
                onClose={(value) => {
                    setUploadCsvDialogOpen(false);
                    if (value) refetch?.();
                }}
            />
        </>
    );
}
