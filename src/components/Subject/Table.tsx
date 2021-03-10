import ViewSubjectDetailsDrawer from "./DetailsDrawer";
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

interface SubjectRow {
    id: string;
    name: string;
    categories: string[];
    subcategories: string[];
}

interface Props {
    disabled?: boolean;
    selectedIds?: string[];
    subjects?: Subject[] | null;
    onSelected?: (selectedIds: string[]) => void;
}

export default function SubjectsTable (props: Props) {
    const {
        disabled,
        selectedIds,
        subjects,
        onSelected,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const { enqueueSnackbar } = useSnackbar();
    const [ rows_, setRows ] = useState<SubjectRow[]>([]);
    const [ openViewDetailsDrawer, setOpenViewDetailsDrawer ] = useState(false);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedSubject, setSelectedSubject ] = useState<Subject>();
    const canCreate = usePermission(`create_subjects_20227`);
    const canView = usePermission(`view_subjects_20115`);
    const canEdit = usePermission(`edit_subjects_20337`);
    const canDelete = usePermission(`delete_subjects_20447`);
    const { required, equals } = useValidations();
    const dataSubjects: Subject[] = [
        {
            subject_id: `1`,
            subject_name: `General`,
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
                            name: `Subcategory 3`,
                        },
                    ],
                },
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
        {
            subject_id: `2`,
            subject_name: `Toodles`,
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
    ];

    useEffect(() => {
        const rows = (subjects ?? dataSubjects)?.map((subject) => ({
            id: subject.subject_id,
            name: subject.subject_name ?? ``,
            categories: subject.categories?.map((category) => category.name ?? ``) ?? [],
            subcategories: subject.categories?.flatMap((category) => category.subcategories ?? []).map((subcategory) => subcategory?.name ?? ``) ?? [],
        })) ?? [];
        setRows(rows);
    }, []);
    // }, [ dataSubjects ]);

    const columns: TableColumn<SubjectRow>[] = [
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
            id: `categories`,
            label: `Categories`,
            disableSearch: disabled,
            render: (row) => <>
                {row.categories.map((category, i) => (
                    <Chip
                        key={`category-${i}`}
                        label={category}
                        className={classes.chip}
                    />
                ))}
            </>,
        },
        {
            id: `subcategories`,
            label: `Subcategories`,
            disableSearch: disabled,
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

    const handleViewDetailsRowClick = (row: SubjectRow) => {
        const selectedSubject = findSubject(row);
        if (!selectedSubject) return;
        setSelectedSubject(selectedSubject);
        setOpenViewDetailsDrawer(true);
    };

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
                    showCheckboxes={!disabled}
                    idField="id"
                    rows={rows_}
                    columns={columns}
                    selectedRows={selectedIds}
                    primaryAction={!disabled ? {
                        label: `Create Subject`,
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
                            title: `Subjects`,
                        },
                    })}
                    onSelected={onSelected}
                />
            </Paper>
            <ViewSubjectDetailsDrawer
                value={selectedSubject}
                open={openViewDetailsDrawer}
                onClose={() => {
                    setSelectedSubject(undefined);
                    setOpenViewDetailsDrawer(false);
                }}
            />
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
