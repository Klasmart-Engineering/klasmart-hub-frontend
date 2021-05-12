import {
    useDeleteSchool,
    useGetSchools,
} from "@/api/schools";
import { useGetUser } from "@/api/users";
import { userIdVar } from "@/cache";
import CreateSchoolDialog from "@/components/School/Dialog/Create";
import UploadSchoolCsvDialog from "@/components/School/Dialog/CsvUpload";
import EditSchoolDialog from "@/components/School/Dialog/Edit";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    School,
    Status,
} from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { getTableLocalization } from "@/utils/table";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    DialogContentText,
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
    PageTable,
    usePrompt,
    useSnackbar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) =>
    createStyles({
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
    shortCode: string;
    status: string;
    system: string;
}

interface Props {}

/**
 * Returns function to show School Table in "View School section"
 */
export default function SchoolTable (props: Props) {
    const classes = useStyles();
    const [ uploadCsvDialogOpen, setUploadCsvDialogOpen ] = useState(false);
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const { required, equals } = useValidations();
    const prompt = usePrompt();
    const [ rows, setRows ] = useState<SchoolRow[]>([]);
    const [ canViewShortCode, setCanViewShortCode ] = useState(false);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedSchool, setSelectedSchool ] = useState<School>();
    const currentOrganization = useCurrentOrganization();
    const [ deleteSchool ] = useDeleteSchool();
    const canEdit = usePermission(`edit_school_20330`);
    const canDelete = usePermission(`delete_school_20440`);
    const canCreate = usePermission(`create_school_20220`);
    const canView = usePermission(`view_school_20110`);

    const userId = useReactiveVar(userIdVar);
    const { data: userData } = useGetUser({
        fetchPolicy: `network-only`,
        variables: {
            user_id: userId,
        },
    });

    const {
        data,
        refetch,
        loading,
    } = useGetSchools({
        variables: {
            organization_id: currentOrganization?.organization_id ?? ``,
        },
    });

    const schools = data?.organization?.schools;

    useEffect(() => {
        if (!canView) {
            setRows([]);
        }
        const rows: SchoolRow[] = schools
            ?.filter((school) => school.status === Status.ACTIVE)
            .map((school) => ({
                id: school.school_id,
                name: school.school_name ?? ``,
                shortCode: school.shortcode ?? ``,
                system: school.system ? `System Value` : `Custom Value`,
                status: school.status ?? ``,
            })) ?? [];
        setRows(rows);
    }, [ data, canView ]);

    useEffect(() => {
        const memberships = userData?.user?.memberships;
        if (!memberships) return;
        const isOrgAdmin = memberships.some((membership) => membership.roles?.find((role) => role.role_name === `Organization Admin`));
        setCanViewShortCode(isOrgAdmin);
    }, [ userData ]);

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
            secret: !canViewShortCode,
        },
        {
            id: `system`,
            label: `Type`,
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
        if (
            !(await prompt({
                variant: `error`,
                title: `Delete School`,
                okLabel: `Delete`,
                content: (
                    <>
                        <DialogContentText>
                            {intl.formatMessage({
                                id: `editDialog_deleteConfirm`,
                            }, {
                                userName: selectedSchool.school_name,
                            })}
                        </DialogContentText>
                        <DialogContentText>{intl.formatMessage({
                            id: `generic_typeText`,
                        })} <strong>{selectedSchool.school_name}</strong> {intl.formatMessage({
                            id: `generic_typeEndText`,
                        })}</DialogContentText>
                    </>
                ),
                validations: [ required(), equals(selectedSchool.school_name) ],
            }))
        )
            return;
        const { school_id } = selectedSchool;
        try {
            await deleteSchool({
                variables: {
                    school_id,
                },
            });
            await refetch();
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
                <PageTable
                    idField="id"
                    loading={loading}
                    columns={columns}
                    rows={rows}
                    orderBy="name"
                    order="asc"
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

            <UploadSchoolCsvDialog
                open={uploadCsvDialogOpen}
                onClose={(value) => {
                    setUploadCsvDialogOpen(false);
                    if (value) refetch();
                }}
            />
        </>
    );
}
