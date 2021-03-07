import {
    useDeleteClass,
    useGetAllClasses,
} from "@/api/classes";
import { currentMembershipVar } from "@/cache";
import ClassRoster from "@/components/Class/ClassRoster/Table";
import CreateClassDialog from "@/components/Class/Dialog/Create";
import EditClassDialog from "@/components/Class/Dialog/Edit";
import ViewClassDialog from "@/components/Class/Dialog/View";
import { Class } from "@/types/graphQL";
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
    Pageview as ViewIcon,
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

const useStyles = makeStyles((theme) =>
    createStyles({
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
        roleName: {
            color: `#0094FF`,
            cursor: `pointer`,
        },
    }));

interface ClassRow {
    id: string;
    name: string;
    schoolNames: string[];
    grades: string[];
    programs: string[];
    subject: string;
    status: string;
}

interface Props {}

/**
 * Returns function to show Classes Table in "Classes" section
 * @param  props {Object} intl - The object has a function (formatMessage) that support multiple languages
 */
export default function ClassesTable (props: Props) {
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
    const [ viewDialogOpen, setViewDialogOpen ] = useState(false);
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

    const schoolClasses = data?.me?.membership?.organization?.classes;

    useEffect(() => {
        const rows = schoolClasses?.map((c) => ({
            id: c.class_id,
            name: c.class_name ?? ``,
            schoolNames: c.schools?.map((school) => school.school_name ?? ``) ?? [],
            grades: [
                `PreK-1`,
                `PreK-2`,
                `+1`,
            ],
            programs: [
                `Program 01`,
                `Programs 02`,
                `+1`,
            ],
            subject: `Math`,
            status: c.status ?? ``,
        }));

        if (canView) {
            setRows(rows ?? []);
        } else {
            setRows([]);
        }
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
                title: `Delete Class`,
                okLabel: `Delete`,
                content: (
                    <>
                        <DialogContentText>
                            Are you sure you want to delete {`"${class_name}"`} class?
                        </DialogContentText>
                        <DialogContentText>
                            Type <strong>{class_name}</strong> to confirm deletion.
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
            label: `Id`,
            hidden: true,
        },
        {
            id: `name`,
            label: intl.formatMessage({
                id: `classes_classTitle`,
            }),
            persistent: true,
            render: (row) => (
                <div
                    className={classes.roleName}
                    onClick={() => {
                        setClassRosterDialogOpen(true);
                    }}
                >
                    {row.name}
                </div>
            ),
        },
        {
            id: `grades`,
            label: `Grades`,
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
            label: `Programs`,
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
            id: `subject`,
            label: `Subject`,
            disableSort: true,
            render: (row) => <Chip
                label={row.subject}
                className={classes.chip} />,
        },
        {
            id: `status`,
            label: intl.formatMessage({
                id: `classes_statusTitle`,
            }),
            render: (row) => (
                <span
                    className={clsx(classes.statusText, {
                        [classes.activeColor]: row.status === `active`,
                        [classes.inactiveColor]: row.status === `inactive`,
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
                    columns={columns}
                    rows={rows}
                    loading={loading}
                    idField="id"
                    orderBy="name"
                    primaryAction={{
                        label: intl.formatMessage({
                            id: `classes_createClassLabel`,
                        }),
                        icon: AddIcon,
                        disabled: !canCreate,
                        onClick: () => setCreateDialogOpen(true),
                    }}
                    rowActions={(row) => [
                        {
                            label: `View class details`,
                            icon: ViewIcon,
                            // disabled: !(row.status === `active` && canEdit),
                            onClick: () => setViewDialogOpen(true),
                        },
                        {
                            label: intl.formatMessage({
                                id: `classes_editRowTooltip`,
                            }),
                            icon: EditIcon,
                            disabled: !(row.status === `active` && canEdit),
                            onClick: editSelectedRow,
                        },
                        {
                            label: intl.formatMessage({
                                id: `classes_deleteRowTooltip`,
                            }),
                            icon: DeleteIcon,
                            disabled: !(row.status === `active` && canDelete),
                            onClick: deleteSelectedRow,
                        },
                    ]}
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

            <ViewClassDialog
                open={viewDialogOpen}
                onClose={() => {
                    setViewDialogOpen(false);
                }}
            />

            <ClassRoster
                open={classRosterDialogOpen}
                onClose={() => {
                    setClassRosterDialogOpen(false);
                }}
            />
        </>
    );
}