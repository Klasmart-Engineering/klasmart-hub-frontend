import ViewProgramDetailsDrawer from "./DetailsDrawer";
import CreateProgramDialog from "@/components/Program/Dialog/Create";
import EditProgramDialog from "@/components/Program/Dialog/Edit";
import {
    isActive,
    PageInfo,
    Program,
} from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
import { usePermission } from "@/utils/checkAllowed";
import { getTableLocalization } from "@/utils/table";
import { useValidations } from "@/utils/validations";
import {
    Chip,
    createStyles,
    DialogContentText,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ViewList as ViewListIcon,
} from "@material-ui/icons";
import {
    CursorTable,
    usePrompt,
} from "kidsloop-px";
import {
    Order,
    TableColumn,
} from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
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

export const organizationProgram = (program: Program, i: number) => {
    return {
        id: program.id ?? `row-${i}`,
        name: program.name ?? ``,
        grades: program.grades?.filter(isActive).map((grade) => grade.name ?? ``) ?? [],
        ageRanges: program.age_ranges?.filter(isActive).map(buildAgeRangeLabel) ?? [],
        subjects: program.subjects?.filter(isActive).map((subject) => subject.name ?? ``) ?? [],
        system: program.system ?? false,
    };
};

export interface ProgramRow {
    id: string;
    name: string;
    grades: string[];
    ageRanges: string[];
    subjects: string[];
    system: boolean;
}

interface Props {
    disabled?: boolean;
    selectedIds?: string[];
    programs?: Program[] | null;
    loading?: boolean;
    pageInfo?: PageInfo;
    total?: number;
    cursor?: string;
    rowsPerPage?: number;
    search?: string;
    order?: Order;
    orderBy?: string;
    showSelectables?: boolean;
    refetch?: () => void;
    onSelected?: (ids: string[]) => void;
    onPageChange?: (page: PageChange, order: Order, cursor: string | undefined, rowsPerPage: number) => Promise<void>;
    onTableChange?: (tableData: CursorTableData<ProgramRow>) => Promise<void>;
    onDeleteRow?: (id: string) => Promise<void>;
}

export default function ProgramTable (props: Props) {
    const {
        disabled,
        programs,
        selectedIds,
        onSelected,
        loading,
        pageInfo,
        total,
        cursor,
        onPageChange,
        rowsPerPage,
        onTableChange,
        search,
        refetch,
        onDeleteRow,
        showSelectables,
        order,
        orderBy,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const [ rows, setRows ] = useState<ProgramRow[]>([]);
    const [ openViewDetailsDrawer, setOpenViewDetailsDrawer ] = useState(false);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedProgramId, setSelectedProgramId ] = useState<string>();
    const [ tableSelectedIds, setTableSelectedIds ] = useState<string[]>(selectedIds || []);
    const [ nonSpecifiedId, setNonSpecifiedId ] = useState<string>();
    const canCreate = usePermission(`create_program_20221`);
    const canView = usePermission(`view_program_20111`);
    const canEdit = usePermission(`edit_program_20331`);
    const canDelete = usePermission(`delete_program_20441`);
    const { required, equals } = useValidations();
    const allPrograms = (programs ?? []).filter(isActive);

    useEffect(() => {
        if (!canView) {
            setRows([]);
            return;
        }
        const rows = allPrograms.map(organizationProgram) ?? [];
        setNonSpecifiedId(allPrograms.find(program => program.name === `None Specified` && program.system)?.id ?? ``);
        setRows(rows);
    }, [ canView, programs ]);

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
            disableSearch: disabled,
            disableSort: true,
            render: (row) => <>
                {row.grades.map((grade, i) => (
                    <Chip
                        key={`grade-${i}`}
                        label={grade}
                        className={classes.chip}
                    />
                ))}
            </>,
        },
        {
            id: `ageRanges`,
            label: intl.formatMessage({
                id: `programs_ageRanges`,
            }),
            disableSearch: disabled,
            disableSort: true,
            render: (row) => <>
                {row.ageRanges.map((ageRange, i) => (
                    <Chip
                        key={`ageRange-${i}`}
                        label={ageRange}
                        className={classes.chip}
                    />
                ))}
            </>,
        },
        {
            id: `subjects`,
            label: intl.formatMessage({
                id: `programs_subjects`,
            }),
            disableSearch: disabled,
            disableSort: true,
            render: (row) => <>
                {row.subjects.map((subject, i) => (
                    <Chip
                        key={`subject-${i}`}
                        label={subject}
                        className={classes.chip}
                    />
                ))}
            </>,
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
        if (!await prompt({
            variant: `error`,
            title: intl.formatMessage({
                id: `programs_deleteProgramLabel`,
            }),
            okLabel: intl.formatMessage({
                id: `programs_deleteLabel`,
            }),
            content: <>
                <DialogContentText>
                    {intl.formatMessage({
                        id: `editDialog_deleteConfirm`,
                    }, {
                        userName: row.name,
                    })}
                </DialogContentText>
                <DialogContentText>{intl.formatMessage({
                    id: `generic_typeToRemovePrompt`,
                }, {
                    value: <strong>{row.name}</strong>,
                })}</DialogContentText>
            </>,
            validations: [ required(), equals(row.name) ],
        })) return;
        await onDeleteRow?.(row.id);
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
        body: {
            noData: intl.formatMessage({
                id: `classes_noRecords`,
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
                    hasNextPage={!loading ? pageInfo?.hasNextPage : false}
                    hasPreviousPage={!loading ? pageInfo?.hasPreviousPage : false}
                    startCursor={pageInfo?.startCursor}
                    endCursor={pageInfo?.endCursor}
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
                onClose={(program) => {
                    if (program) refetch?.();
                    setOpenCreateDialog(false);
                }}
            />
            <EditProgramDialog
                open={openEditDialog}
                programId={selectedProgramId}
                onClose={(program) => {
                    if (program) refetch?.();
                    setSelectedProgramId(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
