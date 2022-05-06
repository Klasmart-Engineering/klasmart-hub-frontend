import CreateAcademicTermDialog from "./Dialog/Create";
import { useDeleteAcademicTerm } from "@/api/academicTerms";
import { Status } from "@/types/graphQL";
import { useDeleteEntityPrompt } from "@/utils/common";
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
    Delete as DeleteIcon,
} from "@mui/icons-material";
import {
    Paper,
    Theme,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React,
{ useState } from "react";
import {
    FormattedDate,
    useIntl,
} from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: `100%`,
        marginBottom: theme.spacing(2),
    },
}));

export interface AcademicTermRow {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status?: Status;
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
        disabled,
    } = props;

    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const deletePrompt = useDeleteEntityPrompt();
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ deleteAcademicTerm ] = useDeleteAcademicTerm();
    const canDelete = usePermission(`delete_academic_term_20449`);
    const canCreate = usePermission(`create_academic_term_20229`);

    const columns: TableColumn<AcademicTermRow>[] = [
        {
            id: `id`,
            label: `ID`,
            hidden: true,
            disableSearch: disabled,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `academicTerm.label`,
                defaultMessage: `Academic Term`,
            }),
            persistent: true,
            disableSearch: disabled,
        },
        {
            id: `startDate`,
            label: intl.formatMessage({
                id: `common.startDate.label`,
                defaultMessage: `Start date`,
            }),
            render: (row) => (
                <FormattedDate value={row.startDate} />
            ),
            disableSearch: disabled,
        },
        {
            id: `endDate`,
            label: intl.formatMessage({
                id: `common.endDate.label`,
                defaultMessage: `End date`,
            }),
            render: (row) => (
                <FormattedDate value={row.endDate} />
            ),
            disableSearch: disabled,
        },
    ];

    const deleteSelectedRow = async (row: AcademicTermRow) => {
        if (!(await deletePrompt({
            title: intl.formatMessage({
                id: `academicTerm.action.delete`,
                defaultMessage: `Delete Academic Term`,
            }),
            entityName: row.name,
        }))) return;
        try {
            await deleteAcademicTerm({
                variables: {
                    id: row.id,
                },
            });
            enqueueSnackbar(intl.formatMessage({
                id: `academicTerm.delete.success`,
                defaultMessage: `Academic Term has been deleted successfully`,
            }), {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(intl.formatMessage({
                id: `academicTerm.delete.error.general`,
                defaultMessage: `Academic Term delete has failed`,
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
                    primaryAction={!disabled ? {
                        label: intl.formatMessage({
                            id: `academicTerm.create.action`,
                            defaultMessage: `Create academic term`,
                        }),
                        icon: AddIcon,
                        disabled: !canCreate,
                        onClick: () => setOpenCreateDialog(true),
                    } : undefined}
                    rowActions={!disabled ? (row) => [
                        {
                            label: intl.formatMessage({
                                id: `common.action.delete`,
                                defaultMessage: `Delete`,
                            }),
                            icon: DeleteIcon,
                            disabled: !(canDelete),
                            onClick: deleteSelectedRow,
                        },
                    ] : undefined}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `academicTerm.label`,
                                defaultMessage: `Academic Term`,
                            }),
                        },
                        search: {
                            placeholder: intl.formatMessage({
                                id: `common.action.search`,
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
                data={rows}
                onClose={() => {
                    setOpenCreateDialog(false);
                }}
            />
        </>
    );
}
