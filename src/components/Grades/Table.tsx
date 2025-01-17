import { useDeleteGrade } from "@/api/grades";
import CreateGradeDialog from "@/components/Grades/Dialog/Create";
import EditGradeDialog from "@/components/Grades/Dialog/Edit";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { useDeleteEntityPrompt } from "@/utils/common";
import { useGradeFilters } from "@/utils/grades";
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
} from "@mui/icons-material";
import { useState } from "react";
import { useIntl } from "react-intl";

export interface GradeRow {
    id: string;
    name: string;
    system: boolean;
    progressFrom?: string;
    progressTo?: string;
}

interface Props extends TableProps<GradeRow> {}

export default function GradeTable (props: Props) {
    const {
        rows,
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

    const intl = useIntl();
    const deletePrompt = useDeleteEntityPrompt();
    const { enqueueSnackbar } = useSnackbar();
    const [ deleteGrade ] = useDeleteGrade();
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ selectedGradeId, setSelectedGradeId ] = useState<string>();
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const canCreate = usePermission(`create_grade_20223`);
    const canEdit = usePermission(`edit_grade_20333`);
    const canDelete = usePermission(`delete_grade_20443`);
    const currentOrganization = useCurrentOrganization();
    const { required } = useValidations();
    const { gradeFilterValueOptions } = useGradeFilters(currentOrganization?.id ?? ``, hideFilters);

    const filters: TableFilter<GradeRow>[] = [
        {
            id: `progressFrom`,
            label: intl.formatMessage({
                id: `generic_filtersProgressFromLabel`,
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
            id: `progressTo`,
            label: intl.formatMessage({
                id: `generic_filtersProgressToLabel`,
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
    ];

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

    const handleEditRowClick = (row: GradeRow) => {
        setSelectedGradeId(row.id);
        setOpenEditDialog(true);
    };

    const handleDeleteRowClick = async (row: GradeRow) => {
        const entityName = row.name;
        if (!(await deletePrompt({
            entityName,
            title: intl.formatMessage({
                id: `grades_deleteGradePrompt`,
            }),
        }))) return;

        try {
            await deleteGrade({
                variables: {
                    id: row.id,
                },
            });
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
            <CursorTable
                filters={!hideFilters ? filters : undefined}
                showSelectables={showSelectables}
                idField="id"
                orderBy={orderBy}
                order={order}
                rows={rows}
                rowsPerPage={rowsPerPage}
                columns={columns}
                primaryAction={{
                    label: intl.formatMessage({
                        id: `grades_createGradeLabel`,
                    }),
                    icon: AddIcon,
                    onClick: () => setOpenCreateDialog(true),
                    disabled: !canCreate,
                }}
                rowActions={(row) => [
                    {
                        label: intl.formatMessage({
                            id: `grades_editLabel`,
                        }),
                        icon: EditIcon,
                        disabled: !canEdit || row.system,
                        onClick: handleEditRowClick,
                    },
                    {
                        label: intl.formatMessage({
                            id: `grades_deleteLabel`,
                        }),
                        icon: DeleteIcon,
                        disabled: !canDelete || row.system,
                        onClick: handleDeleteRowClick,
                    },
                ]}
                localization={getTableLocalization(intl, {
                    title: intl.formatMessage({
                        id: `grades_title`,
                    }),
                    placeholder: intl.formatMessage({
                        id: `grades_searchPlaceholder`,
                    }),
                })}
                loading={loading}
                hasNextPage={!loading ? hasNextPage : false}
                hasPreviousPage={!loading ? hasPreviousPage : false}
                startCursor={startCursor}
                endCursor={endCursor}
                total={total}
                cursor={cursor}
                search={search}
                onPageChange={onPageChange}
                onChange={onTableChange}
            />
            <CreateGradeDialog
                open={openCreateDialog}
                onClose={() => {
                    setOpenCreateDialog(false);
                }}
            />
            <EditGradeDialog
                open={openEditDialog}
                gradeId={selectedGradeId}
                onClose={() => {
                    setSelectedGradeId(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
