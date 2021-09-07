import { useDeleteAgeRange } from "@/api/ageRanges";
import CreateAgeRangeDialog from "@/components/AgeRanges/Dialog/Create";
import EditAgeRangeDialog from "@/components/AgeRanges/Dialog/Edit";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { useAgeRangesFilters } from "@/utils/ageRanges";
import { useDeleteEntityPrompt } from "@/utils/common";
import { usePermission } from "@/utils/permissions";
import {
    getTableLocalization,
    TableProps,
} from "@/utils/table";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
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
    useSnackbar,
} from "kidsloop-px";
import { TableFilter } from "kidsloop-px/dist/types/components/Table/Common/Filter/Filters";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import React,
{ useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
    },
}));

export interface AgeRangeRow {
    id: string;
    ageRange: string;
    system: boolean;
    from?: string;
    to?: string;
}

interface Props extends TableProps<AgeRangeRow> {}

export default function (props: Props) {

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
        refetch,
        showSelectables,
        order,
        orderBy,
        hideFilters,
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const deletePrompt = useDeleteEntityPrompt();
    const { enqueueSnackbar } = useSnackbar();
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedAgeRangeId, setSelectedAgeRangeId ] = useState<string>();
    const canCreate = usePermission(`create_age_range_20222`);
    const canEdit = usePermission(`edit_age_range_20332`);
    const canDelete = usePermission(`delete_age_range_20442`);
    const [ deleteAgeRange ] = useDeleteAgeRange();
    const currentOrganization = useCurrentOrganization();
    const { required } = useValidations();
    const {
        ageRangesLowValueOptions,
        ageRangesHighValueOptions,
        refetchAgeRanges,
    } = useAgeRangesFilters(currentOrganization?.organization_id ?? ``, hideFilters);

    const filters: TableFilter<AgeRangeRow>[] = [
        {
            id: `from`,
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
                },
            ],
        },
        {
            id: `to`,
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
                },
            ],
        },
    ];

    const columns: TableColumn<AgeRangeRow>[] = [
        {
            id: `id`,
            label: intl.formatMessage({
                id: `ageRanges_idLabel`,
            }),
            hidden: true,
            disableSearch: true,
        },
        {
            id: `ageRange`,
            label: intl.formatMessage({
                id: `ageRanges_ageRangeLabel`,
            }),
            persistent: true,
            disableSearch: true,
        },
    ];

    const handleEditRowClick = (row: AgeRangeRow) => {
        setSelectedAgeRangeId(row.id);
        setOpenEditDialog(true);
    };

    const handleDeleteRowClick = async (row: AgeRangeRow) => {
        const entityName = row.ageRange;
        if (!await deletePrompt({
            entityName,
            title: intl.formatMessage({
                id: `ageRanges_deleteAgeRangeTitle`,
            }),
        })) return;
        try {
            await deleteAgeRange({
                variables: {
                    id: row.id ?? ``,
                },
            });
            refetch?.();
            enqueueSnackbar(intl.formatMessage({
                id: `ageRanges_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `ageRanges_deleteError`,
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
                    primaryAction={{
                        label: intl.formatMessage({
                            id: `ageRanges_createAgeRangeLabel`,
                        }),
                        icon: AddIcon,
                        onClick: () => setOpenCreateDialog(true),
                        disabled: !canCreate,
                    }}
                    rowActions={(row) => [
                        {
                            label: intl.formatMessage({
                                id: `ageRanges_editLabel`,
                            }),
                            icon: EditIcon,
                            disabled: !canEdit || !!row.system,
                            onClick: handleEditRowClick,
                        },
                        {
                            label: intl.formatMessage({
                                id: `ageRanges_deleteLabel`,
                            }),
                            icon: DeleteIcon,
                            disabled: !canDelete || !!row.system,
                            onClick: handleDeleteRowClick,
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `ageRanges_title`,
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
                    onPageChange={onPageChange}
                    onChange={onTableChange}
                />
            </Paper>
            <CreateAgeRangeDialog
                open={openCreateDialog}
                onClose={(ageRange) => {
                    if (ageRange) {
                        refetch?.();
                        refetchAgeRanges();
                    }
                    setOpenCreateDialog(false);
                }}
            />
            <EditAgeRangeDialog
                open={openEditDialog}
                ageRangeId={selectedAgeRangeId}
                onClose={(ageRange) => {
                    if (ageRange) {
                        refetch?.();
                        refetchAgeRanges();
                    }
                    setSelectedAgeRangeId(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
