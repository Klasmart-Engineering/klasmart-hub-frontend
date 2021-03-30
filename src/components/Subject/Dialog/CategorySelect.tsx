import {
    useCreateOrUpdateCategories,
    useDeleteCategory,
    useGetAllCategories,
} from "@/api/categories";
import { useGetAllPrograms } from "@/api/programs";
import { useGetAllSubjects } from "@/api/subjects";
import { currentMembershipVar } from "@/cache";
import {
    Category,
    isActive,
    isSystemValue,
} from "@/types/graphQL";
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
} from "@material-ui/icons";
import {
    Dialog,
    PageTable,
    usePrompt,
    useSnackbar,
} from "kidsloop-px";
import { TableColumn } from "kidsloop-px/dist/types/components/Table/Common/Head";
import { uniq } from "lodash";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    chip: {
        margin: theme.spacing(0.25),
    },
}));

interface CategoryRow {
    id: string;
    name: string;
    subjects: string[];
    programs: string[];
    system: boolean;
}

interface Props {
    value?: Category;
    open: boolean;
    onClose: (value?: Category) => void;
}

export default function CategorySelectDialog (props: Props) {
    const {
        value,
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const prompt = usePrompt();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const { letternumeric, required } = useValidations();
    const [ updatedCategory, setUpdatedCategory ] = useState(value);
    const { organization_id } = useReactiveVar(currentMembershipVar);
    const [ createOrUpdateCategories ] = useCreateOrUpdateCategories();
    const [ deleteCategoryReq ] = useDeleteCategory();
    const { data: programsData } = useGetAllPrograms({
        variables: {
            organization_id,
        },
    });
    const { data: subjectsData } = useGetAllSubjects({
        variables: {
            organization_id,
        },
    });
    const { data: categoriesData, refetch: refetchCategories } = useGetAllCategories({
        nextFetchPolicy: `network-only`,
        variables: {
            organization_id,
        },
    });

    const programs = (programsData?.organization.programs ?? []).filter(isActive);
    const subjects = (subjectsData?.organization.subjects ?? []).filter(isActive);
    const categories = (categoriesData?.organization.categories ?? []).filter(isActive);

    useEffect(() => {
        if (!open) return;
        setUpdatedCategory(value);
    }, [ open, value ]);

    const createCategory = async () => {
        const name = await prompt({
            title: `Create Category`,
            okLabel: `Create`,
            validations: [ required(), letternumeric() ],
            label: `Name`,
        });
        try {
            await createOrUpdateCategories({
                variables: {
                    organization_id,
                    categories: [
                        {
                            name,
                            subcategories: [],
                        },
                    ],
                },
            });
            await refetchCategories();
            enqueueSnackbar(intl.formatMessage({
                id: `categories_categoriesCreateMessage`,
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

    const deleteCategory = async (row: CategoryRow) => {
        if (!await prompt({
            variant: `error`,
            title: intl.formatMessage({
                id: `generic_confirmDelete`,
            }),
            content: (
                <>
                    <DialogContentText>
                        {intl.formatMessage({
                            id: `generic_typeToRemovePrompt`,
                        }, {
                            value: row.name,
                        })}
                    </DialogContentText>
                    <DialogContentText>
                        {intl.formatMessage({
                            id: `generic_typeText`,
                        })}<strong>{row.name}</strong> {intl.formatMessage({
                            id: `generic_typeEndText`,
                        })}
                    </DialogContentText>
                </>
            ),
            okLabel: intl.formatMessage({
                id: `generic_deleteLabel`,
            }),
        })) return;
        try {
            await deleteCategoryReq({
                variables: {
                    id: row.id,
                },
            });
            await refetchCategories();
            if (updatedCategory?.id === row.id) setUpdatedCategory((category) => category?.id === row.id ? category : undefined);
            enqueueSnackbar(`Category successfully deleted`, {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar({
                id: `generic_createError`,
            }, {
                variant: `error`,
            });
        }
    };

    const rows: CategoryRow[] = categories.map((category) => ({
        id: category.id ?? ``,
        name: category.name ?? ``,
        programs: uniq(programs.filter((program) => program.subjects?.filter(isActive).flatMap((subject) => subject.categories?.filter(isActive) ?? []).find((c) => c.id === category.id)).map((program) => program.name ?? ``)),
        subjects: uniq(subjects.filter((subject) => subject.categories?.filter(isActive).find((c) => c.id === category.id)).map((subject) => subject.name ?? ``)),
        system: category.system ?? false,
    }));

    const columns: TableColumn<CategoryRow>[] = [
        {
            id: `id`,
            label: `ID`,
            hidden: true,
        },
        {
            id: `name`,
            label: `Name`,
        },
        {
            id: `programs`,
            label: `Programs using`,
            disableSort: true,
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
            id: `subjects`,
            label: `Subjects using`,
            disableSort: true,
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

    return (
        <Dialog
            width="xl"
            open={open}
            title="Select Category"
            actions={[
                {
                    label: `Cancel`,
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: `Select`,
                    color: `primary`,
                    disabled: !updatedCategory,
                    onClick: () => onClose(updatedCategory),
                },
            ]}
            onClose={() => onClose()}
        >
            <Paper>
                <PageTable
                    showSelectables
                    hideSelectStatus
                    selectedRows={updatedCategory?.id ? [ updatedCategory.id ] : undefined}
                    selectMode="single"
                    order="asc"
                    orderBy="name"
                    idField="id"
                    rows={rows}
                    columns={columns}
                    primaryAction={{
                        label: `Create Category`,
                        icon: AddIcon,
                        onClick: createCategory,
                    }}
                    rowActions={(row) => [
                        {
                            label: intl.formatMessage({
                                id: `generic_deleteLabel`,
                            }),
                            icon: DeleteIcon,
                            disabled: isSystemValue(row),
                            onClick: deleteCategory,
                        },
                    ]}
                    localization={{
                        toolbar: {
                            title: `Categories`,
                        },
                    }}
                    onSelected={(rows: string[]) => {
                        if (!rows.length) return;
                        const [ categoryId ] = rows;
                        const selectedCategory = categories.find((category) => category.id === categoryId);
                        setUpdatedCategory(selectedCategory);
                    }}
                />
            </Paper>
        </Dialog>
    );
}
