import ViewProgramDetailsDrawer from "./DetailsDrawer";
import {
    useDeleteProgram,
    useGetAllPrograms,
} from "@/api/programs";
import { currentMembershipVar } from "@/cache";
import CreateProgramDialog from "@/components/Program/Dialog/Create";
import EditProgramDialog from "@/components/Program/Dialog/Edit";
import {
    isActive,
    Program,
} from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
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
    system: boolean;
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
    const { organization_id } = useReactiveVar(currentMembershipVar);
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
    const { data, refetch } = useGetAllPrograms({
        variables: {
            organization_id,
        },
    });
    const [ deleteProgram ] = useDeleteProgram();

    const dataPrograms = data?.organization.programs ?? [];

    useEffect(() => {
        if (!canView) {
            setRows([]);
            return;
        }
        const rows = (programs ?? dataPrograms)?.filter(isActive).map((program, i) => ({
            id: program.id ?? `row-${i}`,
            name: program.name ?? ``,
            grades: program.grades?.map((grade) => grade.name ?? ``) ?? [],
            ageRanges: program.age_ranges?.map((ageRange) => buildAgeRangeLabel(ageRange)) ?? [],
            subjects: program.subjects?.map((subject) => subject.name ?? ``) ?? [],
            system: program.system ?? false,
        })) ?? [];
        setRows(rows);
    }, [
        data,
        canView,
        programs,
    ]);

    const columns: TableColumn<ProgramRow>[] = [
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
                id: `programs_name`,
            }),
            persistent: true,
            disableSearch: disabled,
        },
        {
            id: `grades`,
            label: intl.formatMessage({
                id: `programs_grades`,
            }),
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
            label: intl.formatMessage({
                id: `programs_ageRanges`,
            }),
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
            label: intl.formatMessage({
                id: `programs_subjects`,
            }),
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
        setSelectedProgram(selectedProgram);
        setOpenEditDialog(true);
    };

    const handleDeleteRowClick = async (row: ProgramRow) => {
        const selectedProgram = findProgram(row);
        if (!selectedProgram) return;
        setSelectedProgram(selectedProgram);
        const { id, name } = selectedProgram;
        if (!id) throw Error(`invalid-program-id`);
        if (!await prompt({
            variant: `error`,
            title: intl.formatMessage({
                id: `programs_deleteProgramLabel`,
            }),
            okLabel: intl.formatMessage({
                id: `programs_deleteLabel`,
            }),
            content: <>
                <DialogContentText>Are you sure you want to delete {`"${name}"`}?</DialogContentText>
                <DialogContentText>Type <strong>{name}</strong> to confirm deletion.</DialogContentText>
            </>,
            validations: [ required(), equals(name) ],
        })) return;
        await deleteProgram({
            variables: {
                id,
            },
        });
        await refetch();
        try {
            enqueueSnackbar(intl.formatMessage({
                id: `programs_deleteSuccess`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `generic_createError`,
            }), {
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
                        label: intl.formatMessage({
                            id: `programs_createProgramLabel`,
                        }),
                        icon: AddIcon,
                        onClick: () => setOpenCreateDialog(true),
                        disabled: !canCreate,
                    } : undefined}
                    rowActions={!disabled ? (row) => [
                        {
                            label: intl.formatMessage({
                                id: `programs_viewDetailsLabel`,
                            }),
                            icon: ViewListIcon,
                            disabled: !canView,
                            onClick: handleViewDetailsRowClick,
                        },
                        {
                            label: intl.formatMessage({
                                id: `programs_editLabel`,
                            }),
                            icon: EditIcon,
                            disabled: !canEdit || row.system,
                            onClick: handleEditRowClick,
                        },
                        {
                            label: intl.formatMessage({
                                id: `programs_deleteLabel`,
                            }),
                            icon: DeleteIcon,
                            disabled: !canDelete || row.system,
                            onClick: handleDeleteRowClick,
                        },
                    ] : undefined}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `programs_title`,
                            }),
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
                    if (program) refetch();
                    setOpenCreateDialog(false);
                }}
            />
            <EditProgramDialog
                open={openEditDialog}
                value={selectedProgram}
                onClose={(program) => {
                    if (program) refetch();
                    setSelectedProgram(undefined);
                    setOpenEditDialog(false);
                }}
            />
        </>
    );
}
