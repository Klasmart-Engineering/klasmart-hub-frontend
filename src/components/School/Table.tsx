import { useDeleteSchool } from "@/api/schools";
import CreateSchoolDialog from "@/components/School/Dialog/Create";
import UploadSchoolCsvDialog from "@/components/School/Dialog/CsvUpload";
import EditSchoolDialog from "@/components/School/Dialog/Edit";
import { Status } from "@/types/graphQL";
import { useDeleteEntityPrompt } from "@/utils/common";
import {
    buildCsvTemplateOptions,
    EMPTY_CSV_DATA,
} from "@/utils/csv";
import { usePermission } from "@/utils/permissions";
import {
    getTableLocalization,
    TableProps,
} from "@/utils/table";
import {
    CursorTable,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { TableColumn } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Head";
import {
    Add as AddIcon,
    AssignmentReturned as AssignmentReturnedIcon,
    CloudUpload as CloudIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@mui/icons-material";
import {
    Paper,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
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
    academicTermNames: string[];
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
            persistent: true,
        },
        {
            id: `academicTermNames`,
            label: intl.formatMessage({
                id: `academicTerm.label`,
            }),
            render: (row) => row.academicTermNames?.map((termName, i) => (
                <Typography
                    key={`term-${i}`}
                    noWrap
                    variant="body2"
                >
                    {termName}
                </Typography>
            )),
        },
        {
            id: `shortCode`,
            label: `Short Code`,
        },
    ];

    const schoolCsvTemplateHeaders = [
        `organization_name`,
        `school_name`,
        `school_shortcode`,
        `program_name`,
    ];

    const csvExporter = buildCsvTemplateOptions({
        filename: intl.formatMessage({
            id: `entity.school.importTemplate.filename`,
        }),
        headers: schoolCsvTemplateHeaders,
    });

    const editSelectedRow = (row: SchoolRow) => {
        setSelectedSchoolId(row.id);
        setOpenEditDialog(true);
    };

    const deleteSelectedRow = async (row: SchoolRow) => {
        if (!(await deletePrompt({
            title: intl.formatMessage({
                id: `schools_deleteTitleLabel`,
            }),
            entityName: row.name,
        }))) return;
        try {
            await deleteSchool({
                variables: {
                    school_id: row.id,
                },
            });
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
                    hasNextPage={!loading ? hasNextPage : false}
                    hasPreviousPage={!loading ? hasPreviousPage : false}
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
                onClose={() => {
                    setOpenCreateDialog(false);
                }}
            />

            <EditSchoolDialog
                open={openEditDialog}
                schoolId={selectedSchoolId}
                onClose={() => {
                    setSelectedSchoolId(undefined);
                    setOpenEditDialog(false);
                }}
            />

            <UploadSchoolCsvDialog
                open={uploadCsvDialogOpen}
                onClose={() => {
                    setUploadCsvDialogOpen(false);
                }}
            />
        </>
    );
}
