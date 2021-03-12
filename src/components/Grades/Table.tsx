import {
    useDeleteGrade,
    useGetAllGrades,
} from "@/api/grades";
import { currentMembershipVar } from "@/cache";
import CreateGradeDialog from "@/components/Grades/Dialog/Create";
import EditGradeDialog from "@/components/Grades/Dialog/Edit";
import { Grade } from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
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

    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;

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
            organization_id,
        },
    });

    const [ deleteGrade ] = useDeleteGrade();

    useEffect(() => {
        if (data) {
            const rows = data.organization.grades.filter(grade => grade.status === `active`).map((grade) => ({
                id: grade.id ?? ``,
                name: grade.name ?? ``,
                progressFrom: grade.progress_from_grade?.name ?? `Not specified`,
                progressTo: grade.progress_to_grade?.name ?? `Not specified`,
            })) ?? [];
            setRows(rows);
            setGrades(data?.organization.grades);
        }
    }, [ data ]);

    const columns: TableColumn<GradeRow>[] = [
        {
            id: `id`,
            label: `ID`,
            hidden: true,
        },
        {
            id: `name`,
            label: `Name`,
            persistent: true,
        },
        {
            id: `progressFrom`,
            label: `Progress From`,
        },
        {
            id: `progressTo`,
            label: `Progress To`,
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
            title: `Delete Grade`,
            okLabel: `Delete`,
            content: <>
                <DialogContentText>Are you sure you want to delete {`"${name}"`}?</DialogContentText>
                <DialogContentText>Type <strong>{name}</strong> to confirm deletion.</DialogContentText>
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
            enqueueSnackbar(`Grade successfully deleted`, {
                variant: `success`,
            });
        } catch (err) {
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
                    rows={rows}
                    columns={columns}
                    primaryAction={{
                        label: `Create Grade`,
                        icon: AddIcon,
                        onClick: () => setOpenCreateDialog(true),
                        disabled: !canCreate,
                    }}
                    rowActions={(row) => [
                        {
                            label: `Edit`,
                            icon: EditIcon,
                            disabled: !canEdit,
                            onClick: handleEditRowClick,
                        },
                        {
                            label: `Delete`,
                            icon: DeleteIcon,
                            disabled: !canDelete,
                            onClick: handleDeleteRowClick,
                        },
                    ]}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: `Grades`,
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
