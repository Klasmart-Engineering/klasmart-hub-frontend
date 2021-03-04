import CreateGradeDialog from "@/components/Grades/Dialog/Create";
import EditGradeDialog from "@/components/Grades/Dialog/Edit";
import { Grade } from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
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
    const [ selectedGrade, setSelectedGrade ] = useState<Grade>();
    const { equals, required } = useValidations();
    const canCreate = usePermission(`create_grade_20223`);
    const canEdit = usePermission(`edit_grade_20333`);
    const canDelete = usePermission(`delete_grade_20443`);
    const dataGrades: Grade[] = [
        {
            grade_id: `1`,
            grade_name: `PreK-0`,
        },
    ];

    useEffect(() => {
        const rows = dataGrades?.map((grade) => ({
            id: grade.grade_id,
            name: grade.grade_name ?? ``,
            progressFrom: grade.progress_from_grade?.grade_name ?? `Not specified`,
            progressTo: grade.progress_to_grade?.grade_name ?? `Not specified`,
        })) ?? [];
        setRows(rows);
    }, []);
    // }, [ dataGrades ]);

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

    const findGrade = (row: GradeRow) => dataGrades.find((grade) => grade.grade_id === row.id);

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
        const { grade_name } = selectedGrade;
        if (!await prompt({
            variant: `error`,
            title: `Delete Grade`,
            okLabel: `Delete`,
            content: <>
                <DialogContentText>Are you sure you want to delete {`"${grade_name}"`}?</DialogContentText>
                <DialogContentText>Type <strong>{grade_name}</strong> to confirm deletion.</DialogContentText>
            </>,
            validations: [ required(), equals(grade_name) ],
        })) return;
        try {
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
                    setOpenCreateDialog(false);
                }}
            />
            <EditGradeDialog
                open={openEditDialog}
                value={selectedGrade}
                onClose={(grade) => {
                    console.log(`grade`, grade);
                    setSelectedGrade(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
