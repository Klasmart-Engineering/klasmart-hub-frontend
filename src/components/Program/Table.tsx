import CreateProgramDialog from "@/components/Program/Dialog/Create";
import EditProgramDialog from "@/components/Program/Dialog/Edit";
import { Program } from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
import { usePermission } from "@/utils/checkAllowed";
import { getTableLocalization } from "@/utils/table";
import { useValidations } from "@/utils/validations";
import {
    Chip,
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
    chip: {
        margin: theme.spacing(0.25),
    },
}));

interface ProgramRow {
    id: string;
    name: string;
    grades: string[];
    ageRanges: string[];
    subjects: string[];
}

interface Props {
}

export default function ProgramsTable (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const { enqueueSnackbar } = useSnackbar();
    const [ rows, setRows ] = useState<ProgramRow[]>([]);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedProgram, setSelectedProgram ] = useState<Program>();
    const canCreate = usePermission(`create_program_20221`);
    const canEdit = usePermission(`edit_program_20331`);
    const canDelete = usePermission(`delete_program_20441`);
    const { required, equals } = useValidations();
    const dataPrograms: Program[] = [
        {
            program_id: `1`,
            grades: [
                {
                    grade_id: `1`,
                    grade_name: `Grade 1`,
                },
            ],
            age_ranges: [
                {
                    age_range_id: `1`,
                    from: 0,
                    fromUnit: `year`,
                    to: 1,
                    toUnit: `year`,
                },
            ],
            program_name: `Hello`,
            subjects: [
                {
                    subject_id: `1`,
                    subject_name: `General`,
                    grades: [
                        {
                            grade_id: `1`,
                            grade_name: `Grade 1`,
                        },
                    ],
                    category: `Some Category`,
                    subcategories: [ `Subcategory 1`, `Subcategory 2` ],
                },
            ],
        },
    ];

    useEffect(() => {
        const rows = dataPrograms?.map((program) => ({
            id: program.program_id,
            name: program.program_name ?? ``,
            grades: program.grades?.map((grade) => grade.grade_name ?? ``) ?? [],
            ageRanges: program.age_ranges?.map((ageRange) => buildAgeRangeLabel(ageRange)) ?? [],
            subjects: program.subjects?.map((subject) => subject.subject_name ?? ``) ?? [],
        })) ?? [];
        setRows(rows);
    }, []);
    // }, [ dataPrograms ]);

    const columns: TableColumn<ProgramRow>[] = [
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
            id: `grades`,
            label: `Grades`,
            render: (row) => <>
                {row.grades.map((grade, i) => (
                    <Chip
                        key={`grade-${i}`}
                        label={grade}
                        className={classes.chip}
                    />
                ))}
            </>,
        },
        {
            id: `ageRanges`,
            label: `Age Ranges`,
            render: (row) => <>
                {row.ageRanges.map((ageRange, i) => (
                    <Chip
                        key={`ageRange-${i}`}
                        label={ageRange}
                        className={classes.chip}
                    />
                ))}
            </>,
        },
        {
            id: `subjects`,
            label: `Subjects`,
            render: (row) => <>
                {row.subjects.map((subject, i) => (
                    <Chip
                        key={`subject-${i}`}
                        label={subject}
                        className={classes.chip}
                    />
                ))}
            </>,
        },
    ];

    const findProgram = (row: ProgramRow) => dataPrograms.find((program) => program.program_id === row.id);

    const handleEditRowClick = async (row: ProgramRow) => {
        const selectedProgram = findProgram(row);
        if (!selectedProgram) return;
        console.log(`selectedProgram`, selectedProgram);
        setSelectedProgram(selectedProgram);
        setOpenEditDialog(true);
    };

    const handleDeleteRowClick = async (row: ProgramRow) => {
        const selectedProgram = findProgram(row);
        if (!selectedProgram) return;
        setSelectedProgram(selectedProgram);
        const { program_name } = selectedProgram;
        if (!await prompt({
            variant: `error`,
            title: `Delete Program`,
            okLabel: `Delete`,
            content: <>
                <DialogContentText>Are you sure you want to delete {`"${program_name}"`}?</DialogContentText>
                <DialogContentText>Type <strong>{program_name}</strong> to confirm deletion.</DialogContentText>
            </>,
            validations: [ required(), equals(program_name) ],
        })) return;
        try {
            enqueueSnackbar(`Program successfully deleted`, {
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
                        label: `Create Program`,
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
                            title: `Programs`,
                        },
                    })}
                />
            </Paper>
            <CreateProgramDialog
                open={openCreateDialog}
                onClose={(program) => {
                    setOpenCreateDialog(false);
                }}
            />
            <EditProgramDialog
                open={openEditDialog}
                value={selectedProgram}
                onClose={(program) => {
                    setSelectedProgram(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
