import ViewSubjectDetailsDrawer from "./DetailsDrawer";
import {
    useDeleteSubject,
    useGetAllSubjects,
} from "@/api/subjects";
import CreateSubjectDialog from "@/components/Subject/Dialog/Create";
import EditSubjectDialog from "@/components/Subject/Dialog/Edit";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    Program,
    Status,
    Subject,
} from "@/types/graphQL";
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
    programs: string[];
    system: boolean;
}

interface Props {
    disabled?: boolean;
    showSelectables?: boolean;
    selectedIds?: string[];
    subjects?: Subject[] | null;
    onSelected?: (selectedIds: string[]) => void;
}

export default function SubjectsTable (props: Props) {
    const {
        disabled,
        showSelectables,
        selectedIds,
        subjects,
        onSelected,
    } = props;
    const classes = useStyles();
    const intl = useIntl();
    const prompt = usePrompt();
    const { enqueueSnackbar } = useSnackbar();
    const [ rows_, setRows ] = useState<SubjectRow[]>([]);
    const currentOrganization = useCurrentOrganization();
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
            organization_id: currentOrganization?.organization_id ?? ``,
        },
    });
    const canCreate = usePermission(`create_subjects_20227`);
    const canView = usePermission(`view_subjects_20115`);
    const canEdit = usePermission(`edit_subjects_20337`);
    const canDelete = usePermission(`delete_subjects_20447`);
    const { required, equals } = useValidations();

    const subjects_ = data?.organization.subjects ?? [];

    const mapPrograms = (subjectId: string, programs: Program[]): string[] => (
        programs.filter((program: Program) => (
            program.status === Status.ACTIVE && program.subjects?.find((sub) => sub.id === subjectId)
        ))
            .map((program: Program) => program.name ?? ``)
    );

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
            programs: subject.id ? mapPrograms(subject.id, data?.organization.programs ?? []) : [],
        })) ?? [];

        setRows(rows);
    }, [ data, canView ]);

    const columns: TableColumn<SubjectRow>[] = [
        {
            id: `id`,
            label: intl.formatMessage({
                id: `generic_idLabel`,
            }),
            hidden: true,
            disableSearch: disabled,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `subjects_nameLabel`,
            }),
            persistent: true,
            disableSearch: disabled,
        },
        {
            id: `categories`,
            label: intl.formatMessage({
                id: `subjects_categoriesLabel`,
            }),
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
            id: `programs`,
            label: intl.formatMessage({
                id: `programs_title`,
            }),
            disableSearch: disabled,
            render: (row) => <>
                {row.programs.map((program, i) => (
                    <Chip
                        key={`program-${i}`}
                        label={program}
                        className={classes.chip}
                    />
                ))}
            </>,
        },
        {
            id: `system`,
            label: intl.formatMessage({
                id: `subjects_systemLabel`,
            }),
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
            title: intl.formatMessage({
                id: `subjects_deleteSubjectLabel`,
            }),
            okLabel: intl.formatMessage({
                id: `generic_deleteLabel`,
            }),
            content: <>
                <DialogContentText>{intl.formatMessage({
                    id: `editDialog_deleteConfirm`,
                }, {
                    userName: name,
                })}</DialogContentText>
                <DialogContentText>{intl.formatMessage({
                    id: `generic_typeToRemovePrompt`,
                }, {
                    value: <strong>{name}</strong>,
                })}</DialogContentText>
            </>,
            validations: [ required(), equals(name) ],
        })) return;
        try {
            await deleteSubject({
                variables: {
                    id: id ?? ``,
                },
            });
            refetch();
            enqueueSnackbar(intl.formatMessage({
                id: `subjects_subjectDeleteMessage`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `subjects_subjectDeleteError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <>
            <Paper className={classes.root}>
                <PageTable
                    loading={loading}
                    showSelectables={showSelectables}
                    idField="id"
                    rows={rows_}
                    columns={columns}
                    orderBy="name"
                    order="asc"
                    selectedRows={selectedIds}
                    primaryAction={!disabled ? {
                        label: intl.formatMessage({
                            id: `subjects_createSubjectLabel`,
                        }),
                        icon: AddIcon,
                        onClick: () => setOpenCreateDialog(true),
                        disabled: !canCreate,
                    } : undefined}
                    rowActions={!disabled ? (row) => [
                        {
                            label: intl.formatMessage({
                                id: `subjects_viewDetailsLabel`,
                            }),
                            icon: ViewListIcon,
                            disabled: !canView,
                            onClick: handleViewDetailsRowClick,
                        },
                        {
                            label: intl.formatMessage({
                                id: `subjects_editLabel`,
                            }),
                            icon: EditIcon,
                            disabled: !canEdit || row.system,
                            onClick: handleEditRowClick,
                        },
                        {
                            label: intl.formatMessage({
                                id: `generic_deleteLabel`,
                            }),
                            icon: DeleteIcon,
                            disabled: !canDelete || row.system,
                            onClick: handleDeleteRowClick,
                        },
                    ] : undefined}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `subjects_subjectsLabel`,
                            }),
                        },
                        body: {
                            noData: intl.formatMessage({
                                id: `classes_noRecords`,
                            }),
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
