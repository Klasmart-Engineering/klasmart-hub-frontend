import ViewSubjectDetailsDrawer from "./DetailsDrawer";
import {
    useDeleteSubject,
    useGetAllSubjects,
} from "@/api/subjects";
import { currentMembershipVar } from "@/cache";
import CreateSubjectDialog from "@/components/Subject/Dialog/Create";
import EditSubjectDialog from "@/components/Subject/Dialog/Edit";
import {
    Status,
    Subject,
} from "@/types/graphQL";
import { usePermission } from "@/utils/checkAllowed";
import { getTableLocalization } from "@/utils/table";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    Chip,
    createStyles,
    DialogContentText,
    makeStyles,
    Paper,
    Typography,
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
    system: boolean;
}

interface Props {
    disabled?: boolean;
    showCheckboxes?: boolean;
    selectedIds?: string[];
    subjects?: Subject[] | null;
    onSelected?: (selectedIds: string[]) => void;
}

export default function SubjectsTable (props: Props) {
    const {
        disabled,
        showCheckboxes,
        selectedIds,
        subjects,
        onSelected,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const { enqueueSnackbar } = useSnackbar();
    const { organization_id } = useReactiveVar(currentMembershipVar);
    const [ rows_, setRows ] = useState<SubjectRow[]>([]);
    const [ openViewDetailsDrawer, setOpenViewDetailsDrawer ] = useState(false);
    const [ openCreateDialog, setOpenCreateDialog ] = useState(false);
    const [ openEditDialog, setOpenEditDialog ] = useState(false);
    const [ selectedSubject, setSelectedSubject ] = useState<Subject>();
    const [ deleteSubject ] = useDeleteSubject();
    const {
        data,
        refetch,
        loading,
    } = useGetAllSubjects({
        variables: {
            organization_id,
        },
    });
    const canCreate = usePermission(`create_subjects_20227`);
    const canView = usePermission(`view_subjects_20115`);
    const canEdit = usePermission(`edit_subjects_20337`);
    const canDelete = usePermission(`delete_subjects_20447`);
    const { required, equals } = useValidations();

    const subjects_ = data?.organization.subjects ?? [];

    useEffect(() => {
        if (!canView) {
            setRows([]);
            return;
        }
        const rows = (subjects ?? subjects_)?.filter((subject) => subject.status === Status.ACTIVE).map((subject) => ({
            id: subject.id ?? ``,
            name: subject.name ?? ``,
            categories: subject.categories?.map((category) => category.name ?? ``) ?? [],
            system: subject.system ?? false,
        })) ?? [];
        setRows(rows);
    }, [ data, canView ]);

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
            id: `system`,
            label: `Type`,
            disableSearch: disabled,
            render: (row) => row.system ? `System Value` : `Custom Value`,
        },
    ];

    const findSubject = (row: SubjectRow) => subjects_.find((subject) => subject.id === row.id);

    const handleViewDetailsRowClick = (row: SubjectRow) => {
        const selectedSubject = findSubject(row);
        if (!selectedSubject) return;
        setSelectedSubject(selectedSubject);
        setOpenViewDetailsDrawer(true);
    };

    const handleEditRowClick = async (row: SubjectRow) => {
        const selectedSubject = findSubject(row);
        if (!selectedSubject) return;
        setSelectedSubject(selectedSubject);
        setOpenEditDialog(true);
    };

    const handleDeleteRowClick = async (row: SubjectRow) => {
        const selectedSubject = findSubject(row);
        if (!selectedSubject) return;
        setSelectedSubject(selectedSubject);
        const { id, name } = selectedSubject;
        if (!await prompt({
            variant: `error`,
            title: `Delete Subject`,
            okLabel: `Delete`,
            content: <>
                <DialogContentText>Are you sure you want to delete {`"${name}"`}?</DialogContentText>
                <DialogContentText>Type <strong>{name}</strong> to confirm deletion.</DialogContentText>
            </>,
            validations: [ required(), equals(name) ],
        })) return;
        await deleteSubject({
            variables: {
                id: id ?? ``,
            },
        });
        refetch();
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
                    loading={loading}
                    showCheckboxes={showCheckboxes}
                    idField="id"
                    rows={rows_}
                    columns={columns}
                    orderBy="name"
                    order="asc"
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
                            disabled: !canEdit || row.system,
                            onClick: handleEditRowClick,
                        },
                        {
                            label: `Delete`,
                            icon: DeleteIcon,
                            disabled: !canDelete || row.system,
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
                    if (subject) refetch();
                    setOpenCreateDialog(false);
                }}
            />
            <EditSubjectDialog
                open={openEditDialog}
                value={selectedSubject}
                onClose={(subject) => {
                    if (subject) refetch();
                    setSelectedSubject(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
