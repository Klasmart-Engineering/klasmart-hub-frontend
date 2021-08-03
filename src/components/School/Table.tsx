import { useDeleteSchool } from "@/api/schools";
import CreateSchoolDialog from "@/components/School/Dialog/Create";
import UploadSchoolCsvDialog from "@/components/School/Dialog/CsvUpload";
import EditSchoolDialog from "@/components/School/Dialog/Edit";
import { Status } from "@/types/graphQL";
import { useDeleteEntityPrompt } from "@/utils/common";
import { usePermission } from "@/utils/permissions";
import {
    getTableLocalization,
    TableProps,
} from "@/utils/table";
import {
    createStyles,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    Add as AddIcon,
    CloudUpload as CloudIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@material-ui/icons";
import {
    CursorTable,
    useSnackbar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import React,
{ useState } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `100%`,
    },
}));

export interface SchoolRow {
    id: string;
    name: string;
    shortCode: string;
    status: string;
}

interface Props extends TableProps<SchoolRow> {
}

export default function SchoolTable (props: Props) {
    const {
        rows,
        loading,
        order,
        orderBy,
        rowsPerPage,
        search,
        cursor,
        refetch,
        total,
        hasNextPage,
        hasPreviousPage,
        startCursor,
        endCursor,
        onPageChange,
        onTableChange,
    } = props;

    const classes = useStyles();
    const [ uploadCsvDialogOpen, setUploadCsvDialogOpen ] = useState(false);
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const deletePrompt = useDeleteEntityPrompt();
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedSchoolId, setSelectedSchoolId ] = useState<string>();
    const [ deleteSchool ] = useDeleteSchool();
    const canEdit = usePermission(`edit_school_20330`);
    const canDelete = usePermission(`delete_school_20440`);
    const canCreate = usePermission(`create_school_20220`);

    const columns: TableColumn<SchoolRow>[] = [
        {
            id: `id`,
            label: `ID`,
            hidden: true,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `schools_schoolNameTitle`,
            }),
        },
        {
            id: `shortCode`,
            label: `Short Code`,
        },
    ];

    const editSelectedRow = (row: SchoolRow) => {
        setSelectedSchoolId(row.id);
        setOpenEditDialog(true);
    };

    const deleteSelectedRow = async (row: SchoolRow) => {
        if (!await deletePrompt({
            title: intl.formatMessage({
                id: `schools_deleteTitleLabel`,
            }),
            entityName: row.name,
        })) return;
        try {
            await deleteSchool({
                variables: {
                    school_id: row.id,
                },
            });
            refetch?.();
            enqueueSnackbar(intl.formatMessage({
                id: `schools_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `schools_deleteError`,
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
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    search={search}
                    cursor={cursor}
                    order={order}
                    orderBy={orderBy}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    startCursor={startCursor}
                    endCursor={endCursor}
                    rowsPerPage={rowsPerPage}
                    total={total}
                    primaryAction={{
                        label: intl.formatMessage({
                            id: `schools_createSchoolLabel`,
                        }),
                        icon: AddIcon,
                        disabled: !canCreate,
                        onClick: () => setOpenCreateDialog(true),
                    }}
                    secondaryActions={[
                        {
                            label: `Upload CSV`,
                            icon: CloudIcon,
                            disabled: !canCreate,
                            onClick: () => {
                                setUploadCsvDialogOpen(true);
                            },
                        },
                    ]}
                    rowActions={(row) => [
                        {
                            label: intl.formatMessage({
                                id: `schools_editButton`,
                            }),
                            icon: EditIcon,
                            disabled: !(row.status === Status.ACTIVE && canEdit),
                            onClick: editSelectedRow,
                        },
                        {
                            label: intl.formatMessage({
                                id: `schools_deleteButton`,
                            }),
                            icon: DeleteIcon,
                            disabled: !(row.status === Status.ACTIVE && canDelete),
                            onClick: deleteSelectedRow,
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: `Schools`,
                        },
                        body: {
                            noData: intl.formatMessage({
                                id: `schools_noRecords`,
                            }),
                        },
                        search: {
                            placeholder: intl.formatMessage({
                                id: `schools_searchPlaceholder`,
                            }),
                        },
                    })}
                    onPageChange={onPageChange}
                    onChange={onTableChange}
                />
            </Paper>

            <CreateSchoolDialog
                open={openCreateDialog}
                onClose={(value) => {
                    setOpenCreateDialog(false);
                    if (value) refetch?.();
                }}
            />

            <EditSchoolDialog
                open={openEditDialog}
                schoolId={selectedSchoolId}
                onClose={(value) => {
                    setSelectedSchoolId(undefined);
                    setOpenEditDialog(false);
                    if (value) refetch?.();
                }}
            />

            <UploadSchoolCsvDialog
                open={uploadCsvDialogOpen}
                onClose={(value) => {
                    setUploadCsvDialogOpen(false);
                    if (value) refetch?.();
                }}
            />
        </>
    );
}
