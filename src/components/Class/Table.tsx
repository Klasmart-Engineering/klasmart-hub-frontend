import {
    useDeleteClass,
    useGetAllClasses,
} from "@/api/classes";
import { currentMembershipVar } from "@/cache";
import ClassRoster from "@/components/Class/ClassRoster/Table";
import ClassDetailsDrawer from "@/components/Class/DetailsDrawer";
import CreateClassDialog from "@/components/Class/Dialog/Create";
import EditClassDialog from "@/components/Class/Dialog/Edit";
import globalCss from "@/globalCss";
import {
    Class,
    Status,
    Subject,
} from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
import { usePermission } from "@/utils/checkAllowed";
import { buildEmptyClassDetails } from "@/utils/classes";
import { getTableLocalization } from "@/utils/table";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    Chip,
    createStyles,
    DialogContentText,
    Link,
    makeStyles,
    Paper,
} from "@material-ui/core";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ViewList as ViewListIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import {
    PageTable,
    usePrompt,
    useSnackbar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => {
    const { clickable } = globalCss(theme);
    return createStyles({
        clickable,
        root: {
            width: `100%`,
        },
        containerTable: {
            width: `100%`,
            "& table": {
                overflowY: `auto`,
            },
        },
        activeColor: {
            color: `#2BA600`,
            fontWeight: `bold`,
        },
        inactiveColor: {
            color: `#FF0000`,
            fontWeight: `bold`,
        },
        statusText: {
            fontWeight: `bold`,
            textTransform: `capitalize`,
        },
        chip: {
            margin: theme.spacing(0.25),
        },
    });
});

interface ProgramSubject {
    programName: string;
    subjects: Subject[];
}

export interface ClassDetails {
    className: string;
    programSubjects: ProgramSubject[];
    teachers: string[];
    students: string[];
}

interface ClassRow {
    id: string;
    name: string;
    ageRanges: string[];
    schoolNames: string[];
    grades: string[];
    programs: string[];
    subjects: string[];
    status: string;
    programSubjects: ProgramSubject[];
    teachers: string[];
    students: string[];
}

interface Props {
    disabled?: boolean;
    selectedIds?: string[];
    classItems?: Class[] | null;
    onSelected?: (ids: string[]) => void;
}

export default function ClassesTable (props: Props) {
    const {
        disabled,
        selectedIds,
        classItems,
        onSelected,
    } = props;
    const classes = useStyles();
    const prompt = usePrompt();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const canCreate = usePermission(`create_class_20224`);
    const canEdit = usePermission(`edit_class_20334`);
    const canDelete = usePermission(`delete_class_20444`);
    const canView = usePermission(`view_classes_20114`);
    const [ editDialogOpen, setEditDialogOpen ] = useState(false);
    const [ createDialogOpen, setCreateDialogOpen ] = useState(false);
    const [ detailsDrawerOpen, setDetailsDrawerOpen ] = useState(false);

    const [ classDetails, setClassDetails ] = useState<ClassDetails>(buildEmptyClassDetails());
    const [ classRosterDialogOpen, setClassRosterDialogOpen ] = useState(false);
    const [ selectedClass, setSelectedClass ] = useState<Class>();
    const [ rows, setRows ] = useState<ClassRow[]>([]);
    const { required, equals } = useValidations();
    const {
        data,
        refetch,
        loading,
    } = useGetAllClasses({
        variables: {
            organization_id,
        },
    });
    const [ deleteClass ] = useDeleteClass();

    const schoolClasses = data?.organization?.classes;

    useEffect(() => {
        if (!canView) {
            setRows([]);
            return;
        }
        const rows = (classItems ?? schoolClasses)?.filter((classItem) => classItem.status === Status.ACTIVE).map((classItem) => ({
            id: classItem.class_id,
            name: classItem.class_name ?? ``,
            schoolNames: classItem.schools?.map((school) => school.school_name ?? ``) ?? [],
            programs: classItem.programs?.map((program) => program.name ?? ``) ?? [],
            subjects: classItem.subjects?.map((subject) => subject.name ?? ``) ?? [],
            grades: classItem.grades?.map((grade) => grade.name ?? ``) ?? [],
            ageRanges: classItem.age_ranges?.map(buildAgeRangeLabel) ?? [],
            students:
                classItem.students
                    ?.filter((student) => student?.membership?.status === Status.ACTIVE)
                    .map((student) => student?.given_name ?? ``) ?? [],
            teachers:
                classItem.teachers
                    ?.filter((teacher) => teacher?.membership?.status === Status.ACTIVE)
                    .map((teacher) => teacher?.given_name ?? ``) ?? [],
            status: classItem.status ?? ``,
            programSubjects: classItem.programs?.map((program) => ({
                programName: program.name ?? ``,
                subjects: program?.subjects ?? [],
            })) ?? [],
        })) ?? [];
        setRows(rows);
    }, [ schoolClasses, canView ]);

    const findClass = (row: ClassRow) => schoolClasses?.find((c) => c.class_id === row.id);

    const editSelectedRow = (row: ClassRow) => {
        const selectedClass = findClass(row);
        if (!selectedClass) return;
        setSelectedClass(selectedClass);
        setEditDialogOpen(true);
    };

    const deleteSelectedRow = async (row: ClassRow) => {
        const selectedClass = findClass(row);
        if (!selectedClass) return;

        const { class_name } = selectedClass;

        if (
            !(await prompt({
                variant: `error`,
                title: intl.formatMessage({
                    id: `class_deleteClassTitle`,
                }),
                okLabel: intl.formatMessage({
                    id: `generic_deleteConfirm`,
                }),
                content: (
                    <>
                        <DialogContentText>
                            {intl.formatMessage({
                                id: `classRoster_deletePrompt`,
                            }, {
                                value: class_name,
                            })}
                        </DialogContentText>
                        <DialogContentText>
                            {intl.formatMessage({
                                id: `generic_typeText`,
                            })}<strong>{class_name}</strong> {intl.formatMessage({
                                id: `generic_typeEndText`,
                            })}
                        </DialogContentText>
                    </>
                ),
                validations: [ required(), equals(class_name) ],
            }))
        )
            return;

        const { class_id } = selectedClass;
        try {
            await deleteClass({
                variables: {
                    class_id,
                },
            });
            await refetch();
            enqueueSnackbar(intl.formatMessage({
                id: `classes_classDeletedMessage`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `classes_classDeletedError`,
            }), {
                variant: `error`,
            });
        }
    };

    const columns: TableColumn<ClassRow>[] = [
        {
            id: `id`,
            label: intl.formatMessage({
                id: `generic_idLabel`,
            }),
            hidden: true,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `classes_classTitle`,
            }),
            persistent: true,
            render: (row) => (
                <Link
                    href={undefined}
                    className={classes.clickable}
                    onClick={() => {
                        const selectedClass = findClass(row);
                        if (!selectedClass) return;
                        setSelectedClass(selectedClass);
                        setClassRosterDialogOpen(true);
                    }}
                >
                    {row.name}
                </Link>
            ),
        },
        {
            id: `ageRanges`,
            label: intl.formatMessage({
                id: `schools_ageRangesLabel`,
            }),
            render: (row) => (
                <>
                    {row.ageRanges.map((ageRange, i) => (
                        <Chip
                            key={`ageRange-${i}`}
                            label={ageRange}
                            className={classes.chip} />
                    ))}
                </>
            ),
        },
        {
            id: `grades`,
            label: intl.formatMessage({
                id: `schools_gradesLabel`,
            }),
            render: (row) => (
                <>
                    {row.grades.map((grade, i) => (
                        <Chip
                            key={`grade-${i}`}
                            label={grade}
                            className={classes.chip} />
                    ))}
                </>
            ),
        },
        {
            id: `programs`,
            label: intl.formatMessage({
                id: `schools_programsLabel`,
            }),
            disableSort: true,
            render: (row) => (
                <>
                    {row.programs.map((program, i) => (
                        <Chip
                            key={`program-${i}`}
                            label={program}
                            className={classes.chip} />
                    ))}
                </>
            ),
        },
        {
            id: `subjects`,
            label: intl.formatMessage({
                id: `schools_subjectsLabel`,
            }),
            disableSort: true,
            render: (row) => (
                <>
                    {row.subjects.map((subject, i) => (
                        <Chip
                            key={`subject-${i}`}
                            label={subject}
                            className={classes.chip} />
                    ))}
                </>
            ),
        },
        {
            id: `status`,
            label: intl.formatMessage({
                id: `classes_statusTitle`,
            }),
            render: (row) => (
                <span
                    className={clsx(classes.statusText, {
                        [classes.activeColor]: row.status === Status.ACTIVE,
                        [classes.inactiveColor]: row.status === Status.INACTIVE,
                    })}
                >
                    {row.status}
                </span>
            ),
        },
    ];

    return (
        <>
            <Paper className={classes.root}>
                <PageTable
                    showCheckboxes={!disabled}
                    selectedRows={selectedIds}
                    columns={columns}
                    rows={rows}
                    loading={loading}
                    idField="id"
                    orderBy="name"
                    order="asc"
                    primaryAction={!disabled ? {
                        label: intl.formatMessage({
                            id: `classes_createClassLabel`,
                        }),
                        icon: AddIcon,
                        disabled: !canCreate,
                        onClick: () => setCreateDialogOpen(true),
                    } : undefined}
                    rowActions={!disabled ? (row) => [
                        {
                            label: intl.formatMessage({
                                id: `class_viewDetailsLabel`,
                            }),
                            icon: ViewListIcon,
                            onClick: (row) => {
                                setClassDetails({
                                    className: row.name,
                                    programSubjects: row.programSubjects,
                                    teachers: row.teachers,
                                    students: row.students,
                                });
                                setDetailsDrawerOpen(true);
                            },
                        },
                        {
                            label: intl.formatMessage({
                                id: `classes_editRowTooltip`,
                            }),
                            icon: EditIcon,
                            disabled: !(row.status === Status.ACTIVE && canEdit),
                            onClick: editSelectedRow,
                        },
                        {
                            label: intl.formatMessage({
                                id: `classes_deleteRowTooltip`,
                            }),
                            icon: DeleteIcon,
                            disabled: !(row.status === Status.ACTIVE && canDelete),
                            onClick: deleteSelectedRow,
                        },
                    ] : undefined}
                    localization={getTableLocalization(intl, {
                        toolbar: {
                            title: intl.formatMessage({
                                id: `adminHeader_viewClasses`,
                            }),
                        },
                        search: {
                            placeholder: intl.formatMessage({
                                id: `classes_searchPlaceholder`,
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

            <EditClassDialog
                open={editDialogOpen}
                value={selectedClass}
                onClose={(value) => {
                    setSelectedClass(undefined);
                    setEditDialogOpen(false);
                    if (value) refetch();
                }}
            />

            <CreateClassDialog
                open={createDialogOpen}
                onClose={(value) => {
                    setCreateDialogOpen(false);
                    if (value) refetch();
                }}
            />

            <ClassDetailsDrawer
                open={detailsDrawerOpen}
                classDetails={classDetails}
                onClose={() => {
                    setDetailsDrawerOpen(false);
                    setClassDetails(buildEmptyClassDetails());
                }}
            />

            {selectedClass && <ClassRoster
                open={classRosterDialogOpen}
                organizationId={organization_id}
                classItem={selectedClass}
                onClose={() => {
                    setSelectedClass(undefined);
                    setClassRosterDialogOpen(false);
                }}
            />}
        </>
    );
}
