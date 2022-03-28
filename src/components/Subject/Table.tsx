import ViewSubjectDetailsDrawer from "./DetailsDrawer";
import { useDeleteSubject } from "@/api/subjects";
import CreateSubjectDialog from "@/components/Subject/Dialog/Create";
import EditSubjectDialog from "@/components/Subject/Dialog/Edit";
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
import {
    CursorTable,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { TableFilter } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import { TableColumn } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Head";
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

export interface SubjectRow {
    id: string;
    name: string;
    categories: string[];
    system: boolean;
}

interface Props extends TableProps<SubjectRow> {
}

export default function SubjectsTable (props: Props) {
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
        showSelectables,
        search,
        order,
        orderBy,
        hideFilters,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const deletePrompt = useDeleteEntityPrompt();
    const [ deleteSubject ] = useDeleteSubject();
    const [ openViewDetailsDrawer, setOpenViewDetailsDrawer ] = useState(false);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedSubjectId, setSelectedSubjectId ] = useState<string>();
    const [ tableSelectedIds, setTableSelectedIds ] = useState(selectedIds ?? []);
    const [ nonSpecifiedId, setNonSpecifiedId ] = useState<string>();
    const canCreate = usePermission(`create_subjects_20227`);
    const canView = usePermission(`view_subjects_20115`);
    const canEdit = usePermission(`edit_subjects_20337`);
    const canDelete = usePermission(`delete_subjects_20447`);
    const currentOrganization = useCurrentOrganization();
    const { required } = useValidations();
    const { categoriesFilterValueOptions } = useGetTableFilters(currentOrganization?.id ?? ``, {
        queryCategories: true,
    }, hideFilters);

    const filters: TableFilter<SubjectRow>[] = [
        {
            id: `categories`,
            label: intl.formatMessage({
                id: `subjects_categoriesLabel`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    multipleValues: true,
                    validations: [ required() ],
                    options: categoriesFilterValueOptions,
                    chipLabel: (column, value) => (
                        intl.formatMessage({
                            id: `generic_filtersEqualsChipLabel`,
                        }, {
                            column,
                            value,
                        })
                    ),
                },
            ],
        },
        {
            id: `system`,
            label: intl.formatMessage({
                id: `subjects_systemLabel`,
            }),
            operators: [
                {
                    label: intl.formatMessage({
                        id: `generic_filtersEqualsLabel`,
                    }),
                    value: `eq`,
                    multipleValues: true,
                    validations: [ required() ],
                    options: [
                        {
                            label: `System`,
                            value: `true`,
                        },
                        {
                            label: `Custom`,
                            value: `false`,
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

    const columns: TableColumn<SubjectRow>[] = [
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
                id: `subjects_nameLabel`,
            }),
            persistent: true,
            disableSearch: disabled,
        },
        {
            id: `categories`,
            label: intl.formatMessage({
                id: `subjects_categoriesLabel`,
            }),
            disableSort: true,
            disableSearch: true,
            render: (row) => <>
                {row.categories.map((category, i) => (
                    <Chip
                        key={`category-${i}`}
                        label={category}
                        className={classes.chip}
                    />
                ))}
            </>,
        },
        {
            id: `system`,
            label: intl.formatMessage({
                id: `subjects_systemLabel`,
            }),
            disableSearch: true,
            render: (row) => row.system ? `System Value` : `Custom Value`,
        },
    ];

    const handleViewDetailsRowClick = (row: SubjectRow) => {
        setSelectedSubjectId(row.id);
        setOpenViewDetailsDrawer(true);
    };

    const handleEditRowClick = (row: SubjectRow) => {
        setSelectedSubjectId(row.id);
        setOpenEditDialog(true);
    };

    const handleDeleteRowClick = async (row: SubjectRow) => {
        if (!(await deletePrompt({
            title: intl.formatMessage({
                id: `subjects_deleteSubjectLabel`,
            }),
            entityName: row.name,
        }))) return;
        try {
            await deleteSubject({
                variables: {
                    id: row.id,
                },
            });
            enqueueSnackbar(intl.formatMessage({
                id: `subjects_subjectDeleteMessage`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `subjects_subjectDeleteError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <>
            <Paper className={classes.root}>
                <CursorTable
                    filters={!hideFilters ? filters : undefined}
                    showSelectables={showSelectables}
                    idField="id"
                    orderBy={orderBy}
                    order={order}
                    rows={rows}
                    rowsPerPage={rowsPerPage}
                    columns={columns}
                    selectedRows={tableSelectedIds}
                    primaryAction={!disabled ? {
                        label: intl.formatMessage({
                            id: `subjects_createSubjectLabel`,
                        }),
                        icon: AddIcon,
                        onClick: () => setOpenCreateDialog(true),
                        disabled: !canCreate,
                    } : undefined}
                    rowActions={!disabled ? (row) => [
                        {
                            label: intl.formatMessage({
                                id: `subjects_viewDetailsLabel`,
                            }),
                            icon: ViewListIcon,
                            disabled: !canView,
                            onClick: handleViewDetailsRowClick,
                        },
                        {
                            label: intl.formatMessage({
                                id: `subjects_editLabel`,
                            }),
                            icon: EditIcon,
                            disabled: !canEdit || row.system,
                            onClick: handleEditRowClick,
                        },
                        {
                            label: intl.formatMessage({
                                id: `generic_deleteLabel`,
                            }),
                            icon: DeleteIcon,
                            disabled: !canDelete || row.system,
                            onClick: handleDeleteRowClick,
                        },
                    ] : undefined}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `subjects_subjectsLabel`,
                            }),
                        },
                    })}
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
            <ViewSubjectDetailsDrawer
                subjectId={selectedSubjectId}
                open={openViewDetailsDrawer}
                onClose={() => {
                    setSelectedSubjectId(undefined);
                    setOpenViewDetailsDrawer(false);
                }}
            />
            <CreateSubjectDialog
                open={openCreateDialog}
                onClose={() => {
                    setOpenCreateDialog(false);
                }}
            />
            <EditSubjectDialog
                open={openEditDialog}
                subjectId={selectedSubjectId}
                onClose={() => {
                    setSelectedSubjectId(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
