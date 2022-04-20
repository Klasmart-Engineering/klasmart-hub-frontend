import CreateAcademicTermDialog from "./Dialog/Create";
import { useDeleteAcademicTerm } from "@/api/academicTerms";
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
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@mui/icons-material";
import { Paper } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React,
{ useState } from "react";
import { FormattedDate, useIntl } from "react-intl";

const useStyles = makeStyles(() => createStyles({
    root: {
        width: `100%`,
    },
}));

export interface AcademicTermRow {
    id: string;
    termName: string;
    startDate: string;
    endDate: string;
}

interface Props extends TableProps<AcademicTermRow> {
    schoolId: string;
}

export default function AcademicTermTable (props: Props) {
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
        schoolId,
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const deletePrompt = useDeleteEntityPrompt();
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ deleteAcademicTerm ] = useDeleteAcademicTerm();
    // const canDelete = usePermission(`delete_academic_term_20448`);
    // const canCreate = usePermission(`create_academic_term_20228`);
    const canDelete = usePermission(`delete_school_20440`);
    const canCreate = usePermission(`create_school_20220`);

    const columns: TableColumn<AcademicTermRow>[] = [
        {
            id: `id`,
            label: `ID`,
            hidden: true,
        },
        {
            id: `termName`,
            label: intl.formatMessage({
                id: `academicTerm.todo`,
                defaultMessage: `Academic Term`,
            }),
            persistent: true,
        },
        {
            id: `startDate`,
            label: intl.formatMessage({
                id: `academicTerm.todo`,
                defaultMessage: `Start date`,
            }),
            render: (row) => (
                <FormattedDate value={row.startDate} />
            ),
        },
        {
            id: `endDate`,
            label: intl.formatMessage({
                id: `academicTerm.todo`,
                defaultMessage: `End date`,
            }),
            render: (row) => (
                <FormattedDate value={row.endDate} />
            ),
        },
    ];

    const academicTermCsvTemplateHeaders = [
        `academic_term_name`,

        `academic_term_start_date`,
        `academic_term_end_date`,
    ];

    const csvExporter = buildCsvTemplateOptions({
        filename: intl.formatMessage({
            // i.e. entity.academicTerm.importTemplate.filename
            id: `academicTerm.todo`,
            defaultMessage: `kidsloop-academic-term-template`,
        }),
        headers: academicTermCsvTemplateHeaders,
    });

    const deleteSelectedRow = async (row: AcademicTermRow) => {
        if (!(await deletePrompt({
            title: intl.formatMessage({
                id: `academicTerm.todo`,
                defaultMessage: `Delete Academic Term`,
            }),
            entityName: row.termName,
        }))) return;
        try {
            await deleteAcademicTerm({
                variables: {
                    id: row.id,
                },
            });
            enqueueSnackbar(intl.formatMessage({
                id: `academicTerm.todo`,
                defaultMessage: `Academic Term has been deleted successfully`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `academicTerm.todo`,
                defaultMessage: `Sorry, something went wrong, please try again`,
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
                            id: `academicTerm.todo`,
                            defaultMessage: `Create academic term`,
                        }),
                        icon: AddIcon,
                        disabled: !canCreate,
                        onClick: () => setOpenCreateDialog(true),
                    }}
                    secondaryActions={[
                        {
                            label: intl.formatMessage({
                                // i.e. entity.user.template.download.button
                                id: `academicTerm.todo`,
                                defaultMessage: `Download CSV Template File`,
                            }),
                            icon: AssignmentReturnedIcon,
                            disabled: !canCreate,
                            onClick: () => csvExporter.generateCsv(EMPTY_CSV_DATA),
                        },
                    ]}
                    rowActions={(row) => [
                        {
                            label: intl.formatMessage({
                                id: `academicTerm.todo`,
                                defaultMessage: `Delete`,
                            }),
                            icon: DeleteIcon,
                            disabled: !(canDelete),
                            onClick: deleteSelectedRow,
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `academicTerm.todo`,
                                defaultMessage: `Academic Term`,
                            }),
                        },
                        search: {
                            placeholder: intl.formatMessage({
                                id: `academicTerm.todo`,
                                defaultMessage: `Search`,
                            }),
                        },
                    })}
                    onPageChange={onPageChange}
                    onChange={onTableChange}
                />
            </Paper>

            <CreateAcademicTermDialog
                open={openCreateDialog}
                schoolId={schoolId}
                onClose={() => {
                    setOpenCreateDialog(false);
                }}
            />
        </>
    );
}
