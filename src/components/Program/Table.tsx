import ViewProgramDetailsDrawer from "./DetailsDrawer";
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
    ViewList as ViewListIcon,
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
    disabled?: boolean;
    selectedIds?: string[];
    programs?: Program[] | null;
    onSelected?: (ids: string[]) => void;
}

export default function ProgramTable (props: Props) {
    const {
        disabled,
        programs,
        selectedIds,
        onSelected,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const { enqueueSnackbar } = useSnackbar();
    const [ rows, setRows ] = useState<ProgramRow[]>([]);
    const [ openViewDetailsDrawer, setOpenViewDetailsDrawer ] = useState(false);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedProgram, setSelectedProgram ] = useState<Program>();
    const canCreate = usePermission(`create_program_20221`);
    const canView = usePermission(`view_program_20111`);
    const canEdit = usePermission(`edit_program_20331`);
    const canDelete = usePermission(`delete_program_20441`);
    const { required, equals } = useValidations();
    const dataPrograms: Program[] = [
        {
            id: `1`,
            grades: [
                {
                    id: `1`,
                    name: `Grade 1`,
                },
            ],
            age_ranges: [
                {
                    id: `1`,
                    from: 0,
                    fromUnit: `year`,
                    to: 1,
                    toUnit: `year`,
                },
            ],
            name: `Hello`,
            subjects: [
                {
                    id: `1`,
                    name: `General`,
                    categories: [
                        {
                            id: `1`,
                            name: `Some Category 1`,
                            subcategories: [
                                {
                                    id: `1`,
                                    name: `Subcategory 1`,
                                },
                                {
                                    id: `3`,
                                    name: `Subcategory 1`,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: `2`,
                    name: `Toodles`,
                    categories: [
                        {
                            id: `2`,
                            name: `Some Category 2`,
                            subcategories: [
                                {
                                    id: `2`,
                                    name: `Subcategory 2`,
                                },
                                {
                                    id: `4`,
                                    name: `Subcategory 4`,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    useEffect(() => {
        const rows = (programs ?? dataPrograms)?.map((program) => ({
            id: program.id,
            name: program.name ?? ``,
            grades: program.grades?.map((grade) => grade.name ?? ``) ?? [],
            ageRanges: program.age_ranges?.map((ageRange) => buildAgeRangeLabel(ageRange)) ?? [],
            subjects: program.subjects?.map((subject) => subject.name ?? ``) ?? [],
        })) ?? [];
        setRows(rows);
    }, []);
    // }, [ dataPrograms ]);

    const columns: TableColumn<ProgramRow>[] = [
        {
            id: `id`,
            label: `ID`,
            hidden: true,
            disableSearch: disabled,
        },
        {
            id: `name`,
            label: `Name`,
            persistent: true,
            disableSearch: disabled,
        },
        {
            id: `grades`,
            label: `Grades`,
            disableSearch: disabled,
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
            disableSearch: disabled,
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
            disableSearch: disabled,
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

    const findProgram = (row: ProgramRow) => dataPrograms.find((program) => program.id === row.id);

    const handleViewDetailsRowClick = (row: ProgramRow) => {
        const selectedProgram = findProgram(row);
        if (!selectedProgram) return;
        setSelectedProgram(selectedProgram);
        setOpenViewDetailsDrawer(true);
    };

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
        const { name } = selectedProgram;
        if (!await prompt({
            variant: `error`,
            title: `Delete Program`,
            okLabel: `Delete`,
            content: <>
                <DialogContentText>Are you sure you want to delete {`"${name}"`}?</DialogContentText>
                <DialogContentText>Type <strong>{name}</strong> to confirm deletion.</DialogContentText>
            </>,
            validations: [ required(), equals(name) ],
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
                    showCheckboxes={!disabled}
                    idField="id"
                    rows={rows}
                    columns={columns}
                    selectedRows={selectedIds}
                    primaryAction={!disabled ? {
                        label: `Create Program`,
                        icon: AddIcon,
                        onClick: () => setOpenCreateDialog(true),
                        disabled: !canCreate,
                    } : undefined}
                    rowActions={!disabled ? (row) => [
                        {
                            label: `View Details`,
                            icon: ViewListIcon,
                            disabled: !canView,
                            onClick: handleViewDetailsRowClick,
                        },
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
                    ] : undefined}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: `Programs`,
                        },
                    })}
                    onSelected={onSelected}
                />
            </Paper>
            <ViewProgramDetailsDrawer
                value={selectedProgram}
                open={openViewDetailsDrawer}
                onClose={() => {
                    setSelectedProgram(undefined);
                    setOpenViewDetailsDrawer(false);
                }}
            />
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
