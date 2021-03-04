import CreateSubjectDialog from "@/components/Subject/Dialog/Create";
import EditSubjectDialog from "@/components/Subject/Dialog/Edit";
import { Subject } from "@/types/graphQL";
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

interface SubjectRow {
    id: string;
    name: string;
    grades: string[];
    ageRanges: string[];
    category: string;
    subcategories: string[];
}

interface Props {
}

export default function SubjectsTable (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const { enqueueSnackbar } = useSnackbar();
    const [ rows, setRows ] = useState<SubjectRow[]>([]);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedSubject, setSelectedSubject ] = useState<Subject>();
    const canCreate = usePermission(`create_subjects_20227`);
    const canEdit = usePermission(`edit_subjects_20337`);
    const canDelete = usePermission(`delete_subjects_20447`);
    const { required, equals } = useValidations();
    const dataSubjects: Subject[] = [
        {
            subject_id: `1`,
            subject_name: `General`,
            grades: [
                {
                    grade_id: `1`,
                    grade_name: `Grade 1`,
                },
            ],
            age_ranges: [
                {
                    age_range_id: `1`,
                    from: 1,
                    fromUnit: `month`,
                    to: 2,
                    toUnit: `year`,
                },
            ],
            category: `Some Category`,
            subcategories: [ `Subcategory 1`, `Subcategory 2` ],
        },
    ];

    useEffect(() => {
        const rows = dataSubjects?.map((subject) => ({
            id: subject.subject_id,
            name: subject.subject_name ?? ``,
            grades: subject.grades?.map((grade) => grade.grade_name ?? ``) ?? [],
            ageRanges: subject.age_ranges?.map((ageRange) => buildAgeRangeLabel(ageRange)) ?? [],
            category: subject.category ?? ``,
            subcategories: subject.subcategories ?? [],
        })) ?? [];
        setRows(rows);
    }, []);
    // }, [ dataSubjects ]);

    const columns: TableColumn<SubjectRow>[] = [
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
            id: `category`,
            label: `Category`,
        },
        {
            id: `subcategories`,
            label: `Subcategories`,
            render: (row) => <>
                {row.subcategories.map((subcategory, i) => (
                    <Chip
                        key={`subcategory-${i}`}
                        label={subcategory}
                        className={classes.chip}
                    />
                ))}
            </>,
        },
    ];

    const findSubject = (row: SubjectRow) => dataSubjects.find((subject) => subject.subject_id === row.id);

    const handleEditRowClick = async (row: SubjectRow) => {
        const selectedSubject = findSubject(row);
        if (!selectedSubject) return;
        console.log(`selectedSubject`, selectedSubject);
        setSelectedSubject(selectedSubject);
        setOpenEditDialog(true);
    };

    const handleDeleteRowClick = async (row: SubjectRow) => {
        const selectedSubject = findSubject(row);
        if (!selectedSubject) return;
        setSelectedSubject(selectedSubject);
        const { subject_name } = selectedSubject;
        if (!await prompt({
            variant: `error`,
            title: `Delete Subject`,
            okLabel: `Delete`,
            content: <>
                <DialogContentText>Are you sure you want to delete {`"${subject_name}"`}?</DialogContentText>
                <DialogContentText>Type <strong>{subject_name}</strong> to confirm deletion.</DialogContentText>
            </>,
            validations: [ required(), equals(subject_name) ],
        })) return;
        try {
            enqueueSnackbar(`Subject successfully deleted`, {
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
                        label: `Create Subject`,
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
                            title: `Subjects`,
                        },
                    })}
                />
            </Paper>
            <CreateSubjectDialog
                open={openCreateDialog}
                onClose={(subject) => {
                    setOpenCreateDialog(false);
                }}
            />
            <EditSubjectDialog
                open={openEditDialog}
                value={selectedSubject}
                onClose={(subject) => {
                    console.log(`subject`, subject);
                    setSelectedSubject(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
