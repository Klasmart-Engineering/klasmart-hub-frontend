import {
    useDeleteGrade,
    useGetAllGrades,
} from "@/api/grades";
import CreateGradeDialog from "@/components/Grades/Dialog/Create";
import EditGradeDialog from "@/components/Grades/Dialog/Edit";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    Grade,
    NON_SPECIFIED,
    Status,
} from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { getTableLocalization } from "@/utils/table";
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
    PageTable,
    usePrompt,
    useSnackbar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
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
    const [ grades, setGrades ] = useState<Grade[]>([]);
    const [ selectedGrade, setSelectedGrade ] = useState<Grade>();
    const { equals, required } = useValidations();
    const currentOrganization = useCurrentOrganization();
    const canCreate = usePermission(`create_grade_20223`);
    const canEdit = usePermission(`edit_grade_20333`);
    const canDelete = usePermission(`delete_grade_20443`);

    const {
        loading,
        data,
        refetch,
    } = useGetAllGrades({
        fetchPolicy: `network-only`,
        variables: {
            organization_id: currentOrganization?.organization_id ?? ``,
        },
    });

    const [ deleteGrade ] = useDeleteGrade();

    useEffect(() => {
        if (data) {
            const rows = data.organization.grades.filter(grade => grade.status === Status.ACTIVE).map((grade) => ({
                id: grade.id ?? ``,
                name: grade.name ?? ``,
                progressFrom: grade.progress_from_grade?.name ?? NON_SPECIFIED,
                progressTo: grade.progress_to_grade?.name ?? NON_SPECIFIED,
            })) ?? [];
            setRows(rows);
            setGrades(data?.organization.grades);
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
        },
        {
            id: `progressTo`,
            label: intl.formatMessage({
                id: `grades_progressToLabel`,
            }),
        },
    ];

    const findGrade = (row: GradeRow) => grades?.find((grade) => grade.id === row.id);

    const handleEditRowClick = async (row: GradeRow) => {
        const selectedGrade = findGrade(row);
        if (!selectedGrade) return;
        setSelectedGrade(selectedGrade);
        setOpenEditDialog(true);
    };

    const handleDeleteRowClick = async (row: GradeRow) => {
        const selectedGrade = findGrade(row);
        if (!selectedGrade) return;
        setSelectedGrade(selectedGrade);
        const { name } = selectedGrade;
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
                    id: `generic_typeText`,
                }, {
                    value: name,
                })} <strong>{name}</strong> {intl.formatMessage({
                    id: `generic_typeEndText`,
                })}</DialogContentText>
            </>,
            validations: [ required(), equals(name) ],
        })) return;
        try {
            const response = await deleteGrade({
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
                <PageTable
                    idField="id"
                    rows={rows}
                    columns={columns}
                    orderBy="name"
                    order="asc"
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
                    })}
                />
            </Paper>
            <CreateGradeDialog
                open={openCreateDialog}
                onClose={(grade) => {
                    refetch();
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
