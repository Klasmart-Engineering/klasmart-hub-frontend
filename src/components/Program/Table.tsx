import ViewProgramDetailsDrawer from "./DetailsDrawer";
import { useDeleteProgram } from "@/api/programs";
import CreateProgramDialog from "@/components/Program/Dialog/Create";
import EditProgramDialog from "@/components/Program/Dialog/Edit";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { useDeleteEntityPrompt } from "@/utils/common";
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
    Delete as DeleteIcon,
    Edit as EditIcon,
    ViewList as ViewListIcon,
} from "@mui/icons-material";
import {
    Chip,
    Paper,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
    },
    chip: {
        margin: theme.spacing(0.25),
    },
}));

export interface ProgramRow {
    id: string;
    name: string;
    grades: string[];
    ageRanges: string[];
    subjects: string[];
    system: boolean;
    ageRangeFrom?: string;
    ageRangeTo?: string;
}

interface Props extends TableProps<ProgramRow> {
}

export default function ProgramTable (props: Props) {
    const {
        disabled,
        rows,
        selectedIds,
        onSelected,
        loading,
        hasNextPage,
        hasPreviousPage,
        startCursor,
        endCursor,
        total,
        cursor,
        onPageChange,
        rowsPerPage,
        onTableChange,
        search,
        showSelectables,
        order,
        orderBy,
        hideFilters,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const deletePrompt = useDeleteEntityPrompt();
    const [ deleteProgram ] = useDeleteProgram();
    const [ openViewDetailsDrawer, setOpenViewDetailsDrawer ] = useState(false);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedProgramId, setSelectedProgramId ] = useState<string>();
    const [ tableSelectedIds, setTableSelectedIds ] = useState(selectedIds ?? []);
    const [ nonSpecifiedId, setNonSpecifiedId ] = useState<string>();
    const canCreate = usePermission(`create_program_20221`);
    const canView = usePermission(`view_program_20111`);
    const canEdit = usePermission(`edit_program_20331`);
    const canDelete = usePermission(`delete_program_20441`);
    const currentOrganization = useCurrentOrganization();
    const { required } = useValidations();
    const {
        gradeFilterValueOptions,
        subjectFilterValueOptions,
        ageRangesLowValueOptions,
        ageRangesHighValueOptions,
    } = useGetTableFilters(currentOrganization?.id ?? ``, {
        queryGrades: true,
        querySubjects: true,
        queryAgeRanges: true,
    }, hideFilters);

    const filters: TableFilter<ProgramRow>[] = [
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
    ];

    const selectIds = (ids: string[]) => {
        if (!ids.length) {
            setTableSelectedIds([]);
            return;
        }

        const last = ids[ids.length - 1];

        if (ids.length > 1 && last === nonSpecifiedId) {
            ids.splice(0, ids.length -1);
            setTableSelectedIds([ ...ids ]);
            return;
        }

        if (ids.length > 1 && ids[0] === nonSpecifiedId) {
            ids.shift();
            setTableSelectedIds([ ...ids ]);
            return;
        }

        const nonSpecifiedIndex = ids.findIndex((id) => id === nonSpecifiedId);

        // This is in case user checks on select all.
        if (ids.length > 1 && nonSpecifiedIndex !== -1) {
            ids.splice(nonSpecifiedIndex, 1);
            setTableSelectedIds([ ...ids ]);
            return;
        }

        setTableSelectedIds(ids);
    };

    useEffect(() => {
        const nonSpecifiedId = rows.find((row) => row.name === `None Specified` && row.system)?.id;
        if (!nonSpecifiedId) return;
        setNonSpecifiedId(nonSpecifiedId);
    }, [ rows ]);

    useEffect(() => {
        onSelected?.(tableSelectedIds);
    }, [ tableSelectedIds ]);

    const columns: TableColumn<ProgramRow>[] = [
        {
            id: `id`,
            label: intl.formatMessage({
                id: `generic_idLabel`,
            }),
            hidden: true,
            disableSearch: disabled,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `programs_name`,
            }),
            persistent: true,
            disableSearch: disabled,
        },
        {
            id: `grades`,
            label: intl.formatMessage({
                id: `programs_grades`,
            }),
            disableSearch: true,
            disableSort: true,
            render: (row) => (<>
                {row.grades.map((grade, i) => (
                    <Chip
                        key={`grade-${i}`}
                        label={grade}
                        className={classes.chip}
                    />
                ))}
            </>),
        },
        {
            id: `ageRanges`,
            label: intl.formatMessage({
                id: `programs_ageRanges`,
            }),
            disableSearch: true,
            disableSort: true,
            render: (row) => (<>
                {row.ageRanges.map((ageRange, i) => (
                    <Chip
                        key={`ageRange-${i}`}
                        label={ageRange}
                        className={classes.chip}
                    />
                ))}
            </>),
        },
        {
            id: `subjects`,
            label: intl.formatMessage({
                id: `programs_subjects`,
            }),
            disableSearch: true,
            disableSort: true,
            render: (row) => (<>
                {row.subjects.map((subject, i) => (
                    <Chip
                        key={`subject-${i}`}
                        label={subject}
                        className={classes.chip}
                    />
                ))}
            </>),
        },
    ];

    const handleViewDetailsRowClick = (row: ProgramRow) => {
        setSelectedProgramId(row.id);
        setOpenViewDetailsDrawer(true);
    };

    const handleEditRowClick = async (row: ProgramRow) => {
        setSelectedProgramId(row.id);
        setOpenEditDialog(true);
    };

    const handleDeleteRowClick = async (row: ProgramRow) => {
        if (!(await deletePrompt({
            title: intl.formatMessage({
                id: `programs_deleteProgramLabel`,
            }),
            entityName: row.name,
        }))) return;
        try {
            await deleteProgram({
                variables: {
                    id: row.id,
                },
            });
            enqueueSnackbar(intl.formatMessage({
                id: `programs_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `generic_createError`,
            }), {
                variant: `error`,
            });
        }
    };

    const rowActions = (row: ProgramRow) => ([
        {
            label: intl.formatMessage({
                id: `programs_viewDetailsLabel`,
            }),
            icon: ViewListIcon,
            disabled: !canView,
            onClick: handleViewDetailsRowClick,
        },
        {
            label: intl.formatMessage({
                id: `programs_editLabel`,
            }),
            icon: EditIcon,
            disabled: !canEdit || row.system,
            onClick: handleEditRowClick,
        },
        {
            label: intl.formatMessage({
                id: `programs_deleteLabel`,
            }),
            icon: DeleteIcon,
            disabled: !canDelete || row.system,
            onClick: handleDeleteRowClick,
        },
    ]);

    const localization = getTableLocalization(intl, {
        toolbar: {
            title: intl.formatMessage({
                id: `programs_title`,
            }),
        },
    });

    const primaryAction = ({
        label: intl.formatMessage({
            id: `programs_createProgramLabel`,
        }),
        icon: AddIcon,
        onClick: () => setOpenCreateDialog(true),
        disabled: !canCreate,
    });

    return (
        <>
            <Paper className={classes.root}>
                <CursorTable
                    hideSelectAll
                    filters={!hideFilters ? filters : undefined}
                    showSelectables={showSelectables}
                    idField="id"
                    orderBy={orderBy}
                    order={order}
                    rows={rows}
                    rowsPerPage={rowsPerPage}
                    columns={columns}
                    selectedRows={tableSelectedIds}
                    primaryAction={!disabled ? primaryAction : undefined}
                    rowActions={!disabled ? rowActions : undefined}
                    localization={localization}
                    loading={loading}
                    hasNextPage={!loading ? hasNextPage : false}
                    hasPreviousPage={!loading ? hasPreviousPage : false}
                    startCursor={startCursor}
                    endCursor={endCursor}
                    total={total}
                    cursor={cursor}
                    search={search}
                    onSelected={selectIds}
                    onPageChange={onPageChange}
                    onChange={onTableChange}
                />
            </Paper>
            <ViewProgramDetailsDrawer
                programId={selectedProgramId}
                open={openViewDetailsDrawer}
                onClose={() => {
                    setSelectedProgramId(undefined);
                    setOpenViewDetailsDrawer(false);
                }}
            />
            <CreateProgramDialog
                open={openCreateDialog}
                onClose={() => {
                    setOpenCreateDialog(false);
                }}
            />
            <EditProgramDialog
                open={openEditDialog}
                programId={selectedProgramId}
                onClose={() => {
                    setSelectedProgramId(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
