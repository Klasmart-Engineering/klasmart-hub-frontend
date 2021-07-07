import {
    GradeEdge,
    GradeFilter,
    useDeleteGrade,
    useGetPaginatedOrganizationGrades,
} from "@/api/grades";
import CreateGradeDialog from "@/components/Grades/Dialog/Create";
import EditGradeDialog from "@/components/Grades/Dialog/Edit";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    Grade,
    NON_SPECIFIED,
} from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { isUUID } from "@/utils/pagination";
import {
    DEFAULT_ROWS_PER_PAGE,
    getTableLocalization,
    pageChangeToDirection,
    serverToTableOrder,
    TableState,
    tableToServerOrder,
} from "@/utils/table";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    DialogContentText,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@material-ui/icons";
import {
    CursorTable,
    usePrompt,
    useSnackbar,
} from "kidsloop-px";
import {
    Order,
    TableColumn,
} from "kidsloop-px/dist/types/components/Table/Common/Head";
import { PageChange } from "kidsloop-px/dist/types/components/Table/Common/Pagination/shared";
import { CursorTableData } from 'kidsloop-px/dist/types/components/Table/Cursor/Table';
import React, {
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
    },
}));

interface GradeRow {
    id: string;
    name?: string;
    progressFrom?: string;
    progressTo?: string;
}

interface Props {
}

export default function (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const { enqueueSnackbar } = useSnackbar();
    const [ rows, setRows ] = useState<GradeRow[]>([]);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ grades, setGrades ] = useState<GradeEdge[]>([]);
    const [ selectedGrade, setSelectedGrade ] = useState<Grade>();
    const { equals, required } = useValidations();
    const currentOrganization = useCurrentOrganization();
    const canCreate = usePermission(`create_grade_20223`);
    const canEdit = usePermission(`edit_grade_20333`);
    const canDelete = usePermission(`delete_grade_20443`);
    const [ deleteGrade ] = useDeleteGrade();
    const [ tableState, setTableState ] = useState<TableState>({
        search: ``,
        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
        order: `ASC`,
        orderBy: `name`,
    });
    const queryFilter: GradeFilter = {
        ...isUUID(tableState.search)
            ? {
                id: {
                    operator: `eq`,
                    value: tableState.search,
                },
            } :
            {
                name: {
                    operator: `contains`,
                    value: tableState.search,
                    caseInsensitive: true,
                },
            },
    };

    const {
        loading,
        data,
        refetch,
        fetchMore,
    } = useGetPaginatedOrganizationGrades({
        variables: {
            organizationId: currentOrganization?.organization_id ?? ``,
            direction: `FORWARD`,
            count: tableState.rowsPerPage,
            orderBy: tableState.orderBy,
            order: tableState.order,
            filter: queryFilter,
        },
    });

    useEffect(() => {
        if (data) {
            const rows = data.gradesConnection.edges?.map((edge) => ({
                id: edge.node.id ?? ``,
                name: edge.node.name ?? ``,
                progressFrom: edge.node.fromGrade?.name ?? NON_SPECIFIED,
                progressTo: edge.node.toGrade?.name ?? NON_SPECIFIED,
            })) ?? [];
            setRows(rows);
            setGrades(data?.gradesConnection.edges);
        }
    }, [ data ]);

    const columns: TableColumn<GradeRow>[] = [
        {
            id: `id`,
            label: intl.formatMessage({
                id: `grades_idLabel`,
            }),
            hidden: true,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `grades_nameLabel`,
            }),
            persistent: true,
        },
        {
            id: `progressFrom`,
            label: intl.formatMessage({
                id: `grades_progressFromLabel`,
            }),
            disableSort: true,
        },
        {
            id: `progressTo`,
            label: intl.formatMessage({
                id: `grades_progressToLabel`,
            }),
            disableSort: true,
        },
    ];

    const findGrade = (row: GradeRow) => grades?.find((grade) => grade.node.id === row.id);
    const mapGrade = (grade: GradeEdge['node']): Grade => ({
        id: grade.id,
        name: grade.name,
        status: grade.status,
        system: grade.system,
        progress_from_grade: grade.fromGrade ? mapGrade(grade.fromGrade) : null,
        progress_to_grade: grade.toGrade ? mapGrade(grade.toGrade) : null,
    });

    const handleEditRowClick = async (row: GradeRow) => {
        const selectedGrade = findGrade(row);
        if (!selectedGrade) return;

        setSelectedGrade(mapGrade(selectedGrade.node));
        setOpenEditDialog(true);
    };

    const handlePageChange = async (pageChange: PageChange, order: Order, cursor: string | undefined, count: number) => {
        const direction = pageChangeToDirection(pageChange);

        await fetchMore({
            variables: {
                count,
                cursor,
                direction,
            },
        });
    };

    const handleTableChange = async (tableData: CursorTableData<GradeRow>) => {
        setTableState({
            order: tableToServerOrder(tableData.order),
            orderBy: tableData.orderBy,
            rowsPerPage: tableData.rowsPerPage,
            search: tableData.search,
        });
    };

    useEffect(() => {
        refetch({
            count: tableState.rowsPerPage,
            order: tableState.order,
            orderBy: tableState.orderBy,
            filter: queryFilter,
        });
    }, [
        tableState.search,
        tableState.order,
        tableState.orderBy,
        tableState.rowsPerPage,
    ]);

    const handleDeleteRowClick = async (row: GradeRow) => {
        const selectedGrade = findGrade(row);
        if (!selectedGrade) return;
        setSelectedGrade(mapGrade(selectedGrade.node));
        const name = selectedGrade.node.name;
        if (!await prompt({
            variant: `error`,
            title: intl.formatMessage({
                id: `grades_deleteGradePrompt`,
            }),
            okLabel: intl.formatMessage({
                id: `grades_deleteConfirmButton`,
            }),
            content: <>
                <DialogContentText>{intl.formatMessage({
                    id: `class_confirmDelete`,
                }, {
                    name,
                })}</DialogContentText>
                <DialogContentText>{intl.formatMessage({
                    id: `generic_typeToRemovePrompt`,
                }, {
                    value: <strong>{name}</strong>,
                })}</DialogContentText>
            </>,
            validations: [ required(), equals(name) ],
        })) return;
        try {
            await deleteGrade({
                variables: {
                    id: row.id,
                },
            });
            refetch();
            enqueueSnackbar(intl.formatMessage({
                id: `grades_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `grades_deleteError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <>
            <Paper className={classes.root}>
                <CursorTable
                    idField="id"
                    loading={loading}
                    hasNextPage={data?.gradesConnection?.pageInfo.hasNextPage}
                    hasPreviousPage={data?.gradesConnection?.pageInfo.hasPreviousPage}
                    startCursor={data?.gradesConnection?.pageInfo.startCursor}
                    endCursor={data?.gradesConnection?.pageInfo.endCursor}
                    rows={rows}
                    columns={columns}
                    order={serverToTableOrder(tableState.order)}
                    orderBy={tableState.orderBy}
                    rowsPerPage={tableState.rowsPerPage}
                    total={data?.gradesConnection?.totalCount}
                    primaryAction={{
                        label: intl.formatMessage({
                            id: `grades_createGradeLabel`,
                        }),
                        icon: AddIcon,
                        onClick: () => setOpenCreateDialog(true),
                        disabled: !canCreate,
                    }}
                    rowActions={() => [
                        {
                            label: intl.formatMessage({
                                id: `grades_editLabel`,
                            }),
                            icon: EditIcon,
                            disabled: !canEdit,
                            onClick: handleEditRowClick,
                        },
                        {
                            label: intl.formatMessage({
                                id: `grades_deleteLabel`,
                            }),
                            icon: DeleteIcon,
                            disabled: !canDelete,
                            onClick: handleDeleteRowClick,
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `grades_title`,
                            }),
                        },
                        search: {
                            placeholder: intl.formatMessage({
                                id: `grades_searchPlaceholder`,
                            }),
                        },
                    })}
                    onPageChange={handlePageChange}
                    onChange={handleTableChange}
                />
            </Paper>
            <CreateGradeDialog
                open={openCreateDialog}
                onClose={(grade) => {
                    if (grade) {
                        refetch();
                    }
                    setOpenCreateDialog(false);
                }}
            />
            <EditGradeDialog
                open={openEditDialog}
                value={selectedGrade}
                onClose={(grade) => {
                    if (grade) {
                        refetch();
                    }
                    setSelectedGrade(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
