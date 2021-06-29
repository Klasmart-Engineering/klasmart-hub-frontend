import ViewProgramDetailsDrawer from "./DetailsDrawer";
import {
    ProgramEdge,
    ProgramFilter,
    useDeleteProgram,
    useGetAllPrograms,
} from "@/api/programs";
import CreateProgramDialog from "@/components/Program/Dialog/Create";
import EditProgramDialog from "@/components/Program/Dialog/Edit";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    Program,
    Status,
} from "@/types/graphQL";
import { buildAgeRangeLabelForPrograms } from "@/utils/ageRanges";
import { usePermission } from "@/utils/checkAllowed";
import { isUUID } from "@/utils/pagination";
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
    useSnackbar,
    utils,
} from "kidsloop-px";
import {
    Order,
    TableColumn,
} from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from "kidsloop-px/dist/types/components/Table/Cursor/Table";
import React,
{
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

export const organizationProgram = (edge: ProgramEdge, i: number) => {
    const program = edge.node;
    return {
        id: program.id ?? `row-${i}`,
        name: program.name ?? ``,
        grades: program.grades
            ?.filter(grade => grade.status ===  Status.ACTIVE)
            .map((grade) => grade.name ?? ``) ?? [],
        ageRanges: program.ageRanges
            ?.filter(ageRange => ageRange.status === Status.ACTIVE)
            .map(buildAgeRangeLabelForPrograms) ?? [],
        subjects: program.subjects
            ?.filter(subject => subject.status === Status.ACTIVE)
            .map((subject) => subject.name ?? ``) ?? [],
        system: program.system ?? false,
    };
};

const ROWS_PER_PAGE = 10;

interface ProgramRow {
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
    onSelected?: (ids: string[]) => void;
}

export default function ProgramTable (props: Props) {
    const {
        disabled,
        programs,
        selectedIds,
        onSelected,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const { enqueueSnackbar } = useSnackbar();
    const currentOrganization = useCurrentOrganization();
    const [ rows, setRows ] = useState<ProgramRow[]>([]);
    const [ openViewDetailsDrawer, setOpenViewDetailsDrawer ] = useState(false);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedProgram, setSelectedProgram ] = useState<ProgramEdge>();
    const [ rowsPerPage, setRowsPerPage ] = useState(ROWS_PER_PAGE);
    const [ cursor, setCursor ] = useState<string>();
    const [ tableSelectedIds, setTableSelectedIds ] = useState<string[]>(selectedIds || []);
    const [ nonSpecifiedId, setNonSpecifiedId ] = useState<string>();
    const [ search, setSearch ] = useState(``);
    const canCreate = usePermission(`create_program_20221`);
    const canView = usePermission(`view_program_20111`);
    const canEdit = usePermission(`edit_program_20331`);
    const canDelete = usePermission(`delete_program_20441`);
    const { required, equals } = useValidations();
    const queryFilter: ProgramFilter = {
        ...isUUID(search)
            ? {
                id: {
                    operator: `eq`,
                    value: search,
                },
            }
            : {
                name: {
                    operator: `contains`,
                    value: search,
                    caseInsensitive: true,
                },
            },
    };
    const {
        data,
        refetch,
        fetchMore: fetchMorePrograms,
        loading: loadingPrograms,
    } = useGetAllPrograms({
        variables: {
            direction: `FORWARD`,
            count: rowsPerPage,
            organizationId: currentOrganization?.organization_id ?? ``,
            orderBy: `name`,
            order: `ASC`,
            filter: queryFilter,
        },
        notifyOnNetworkStatusChange: true,
    });
    const [ deleteProgram ] = useDeleteProgram();
    const allPrograms = (data?.programsConnection?.edges ?? []);
    const pageInfo = data?.programsConnection?.pageInfo;

    useEffect(() => {
        if (!canView) {
            setRows([]);
            return;
        }
        const rows = allPrograms.map(organizationProgram) ?? [];

        setNonSpecifiedId(allPrograms.find(edge => edge.node.name === `None Specified` && edge.node.system)?.node.id ?? ``);
        setRows(rows);
    }, [
        data,
        canView,
        programs,
    ]);

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
            disableSort: true,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `programs_name`,
            }),
            persistent: true,
            disableSearch: disabled,
            disableSort: true,
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

    const findProgram = (row: ProgramRow) => allPrograms.find((edge) => edge.node.id === row.id);

    const handleViewDetailsRowClick = (row: ProgramRow) => {
        const selectedProgram = findProgram(row);
        if (!selectedProgram) return;
        setSelectedProgram(selectedProgram);
        setOpenViewDetailsDrawer(true);
    };

    const handleEditRowClick = async (row: ProgramRow) => {
        const selectedProgram = findProgram(row);
        if (!selectedProgram) return;
        setSelectedProgram(selectedProgram);
        setOpenEditDialog(true);
    };

    const handleDeleteRowClick = async (row: ProgramRow) => {
        const selectedProgram = findProgram(row);
        if (!selectedProgram) return;
        setSelectedProgram(selectedProgram);
        const { id, name } = selectedProgram?.node;
        if (!id) throw Error(`invalid-program-id`);
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
                        userName: name,
                    })}
                </DialogContentText>
                <DialogContentText>{intl.formatMessage({
                    id: `generic_typeToRemovePrompt`,
                }, {
                    value: <strong>{name}</strong>,
                })}</DialogContentText>
            </>,
            validations: [ required(), equals(name) ],
        })) return;
        await deleteProgram({
            variables: {
                id,
            },
        });
        await refetch();
        try {
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

    const handlePageChange = async (page: PageChange, order: Order, cursor: string | undefined, rowsPerPage: number) => {
        const rowsPerPage_ = page === `last`
            ? ((data?.programsConnection?.totalCount ?? 0) % rowsPerPage) || rowsPerPage
            : rowsPerPage;
        const pageInfo = utils.getCursorPageInfo(page, order, cursor, rowsPerPage_);

        await setCursor(cursor);
        await fetchMorePrograms({
            variables: {
                ...pageInfo,
                name: search,
                filter: queryFilter,
            },
        });
    };

    const handleTableChange = async (tableData: CursorTableData<ProgramRow>) => {
        setRowsPerPage(tableData.rowsPerPage);
        setSearch(tableData.search);
    };

    const fetchMoreHandler = () => {
        fetchMorePrograms({
            variables: {
                count: rowsPerPage,
                direction: `FORWARD`,
                cursor: null,
                filter: queryFilter,
            },
        });
    };

    useEffect(() => {
        fetchMoreHandler();
    }, [ rowsPerPage, search ]);

    return (
        <>
            <Paper className={classes.root}>
                <CursorTable
                    columns={columns}
                    rows={rows}
                    loading={loadingPrograms}
                    idField="id"
                    orderBy="name"
                    order="desc"
                    rowsPerPage={rowsPerPage}
                    hasNextPage={pageInfo?.hasNextPage}
                    hasPreviousPage={pageInfo?.hasPreviousPage}
                    startCursor={pageInfo?.startCursor}
                    endCursor={pageInfo?.endCursor}
                    total={data?.programsConnection?.totalCount}
                    cursor={cursor}
                    search={search}
                    showSelectables={!disabled}
                    selectedRows={tableSelectedIds}
                    primaryAction={!disabled ? {
                        label: intl.formatMessage({
                            id: `programs_createProgramLabel`,
                        }),
                        icon: AddIcon,
                        onClick: () => setOpenCreateDialog(true),
                        disabled: !canCreate,
                    } : undefined}
                    rowActions={!disabled ? (row) => [
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
                    ] : undefined}
                    localization={getTableLocalization(intl, {
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
                    })}
                    onSelected={selectIds}
                    onPageChange={handlePageChange}
                    onChange={handleTableChange}
                />
            </Paper>
            <ViewProgramDetailsDrawer
                value={selectedProgram}
                open={openViewDetailsDrawer}
                onClose={() => {
                    setSelectedProgram(undefined);
                    setOpenViewDetailsDrawer(false);
                }}
            />
            <CreateProgramDialog
                open={openCreateDialog}
                onClose={(program) => {
                    if (program) fetchMoreHandler();

                    setOpenCreateDialog(false);
                }}
            />
            <EditProgramDialog
                open={openEditDialog}
                value={selectedProgram}
                onClose={(program) => {
                    if (program) refetch();
                    setSelectedProgram(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
