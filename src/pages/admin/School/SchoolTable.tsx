import {
    useDeleteSchool,
    useGetSchools,
} from "@/api/schools";
import { currentMembershipVar } from "@/cache";
import CreateSchoolDialog from "@/components/School/Dialog/Create";
import EditSchoolDialog from "@/components/School/Dialog/Edit";
import { School } from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { getTableLocalization } from "@/utils/table";
import { useReactiveVar } from "@apollo/client";
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
import clsx from "clsx";
import {
    PageTable,
    useSnackbar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
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
    statusActive: {
        textTransform: `capitalize`,
        color: theme.palette.success.main,
        fontWeight: `bold`,
    },
    statusInactive: {
        textTransform: `capitalize`,
        color: theme.palette.error.main,
        fontWeight: `bold`,
    },
}));

interface SchoolRow {
    id: string;
    name: string;
    status: string;
}

interface Props {
}

/**
 * Returns function to show School Table in "View School section"
 */
export default function SchoolTable(props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ rows, setRows ] = useState<SchoolRow[]>([]);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedSchool, setSelectedSchool ] = useState<School>();
    const organization = useReactiveVar(currentMembershipVar);
    const [ deleteSchool ] = useDeleteSchool();
    const { organization_id } = organization;
    const canEdit = usePermission(`edit_school_20330`);
    const canDelete = usePermission(`delete_school_20440`);
    const canCreate = usePermission(`create_school_20220`);
    const {
        data,
        refetch,
        loading,
    } = useGetSchools({
        fetchPolicy: `network-only`,
        variables: {
            organization_id,
        },
    });

    const schools = data?.organization?.schools;

    useEffect(() => {
        const rows: SchoolRow[] = schools?.map((school) => ({
            id: school.school_id,
            name: school.school_name ?? ``,
            status: school.status ?? ``,
        })) ?? [];
        setRows(rows);
    }, [ data ]);

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
            id: `status`,
            label: intl.formatMessage({
                id: `classes_statusTitle`,
            }),
            render: (row) => <span
                className={clsx({
                    [classes.statusActive]: row.status === `active`,
                    [classes.statusInactive]: row.status === `inactive`,
                })}
            >
                {row.status}
            </span>,
        },
    ];

    const findSchool = (row: SchoolRow) => schools?.find((s) => s.school_id === row.id);

    const editSelectedRow = (row: SchoolRow) => {
        const selectedSchool = findSchool(row);
        if (!selectedSchool) return;
        setSelectedSchool(selectedSchool);
        setOpenEditDialog(true);
    };

    const deleteSelectedRow = async (row: SchoolRow) => {
        const selectedSchool = findSchool(row);
        if (!selectedSchool) return;
        if (!confirm(`Are you sure you want to delete "${selectedSchool.school_name}"?`)) return;
        const { school_id } = selectedSchool;
        try {
            await deleteSchool({
                variables: {
                    school_id,
                },
            });
            await refetch();
            enqueueSnackbar(`School has been deleted succesfully`, {
                variant: `success`,
            });
        } catch (error) {
            enqueueSnackbar(`Sorry, something went wrong, please try again`, {
                variant: `error`,
            });
        }
    };

    return (
        <>
            <Paper className={classes.root}>
                <PageTable
                    idField="id"
                    loading={loading}
                    columns={columns}
                    rows={rows}
                    orderBy="name"
                    primaryAction={{
                        label: intl.formatMessage({
                            id: `schools_createSchoolLabel`,
                        }),
                        icon: AddIcon,
                        disabled: !canCreate,
                        onClick: () => setOpenCreateDialog(true),
                    }}
                    rowActions={(row) => [
                        {
                            label: `Edit`,
                            icon: EditIcon,
                            disabled: !(row.status === `active` && canEdit),
                            onClick: editSelectedRow,
                        },
                        {
                            label: `Delete`,
                            icon: DeleteIcon,
                            disabled: !(row.status === `active` && canDelete),
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
                />
            </Paper>
            <CreateSchoolDialog
                open={openCreateDialog}
                onClose={(value) => {
                    setOpenCreateDialog(false);
                    if (value) refetch();
                }}
            />
            <EditSchoolDialog
                open={openEditDialog}
                value={selectedSchool}
                onClose={(value) => {
                    setSelectedSchool(undefined);
                    setOpenEditDialog(false);
                    if (value) refetch();
                }}
            />
        </>
    );
}
