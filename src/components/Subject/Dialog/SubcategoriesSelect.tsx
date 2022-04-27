import { useGetAllCategories } from "@/api/categories";
import { useGetAllPrograms } from "@/api/programs";
import {
    useCreateOrUpdateSubcategories,
    useDeleteSubcategory,
    useGetAllSubcategories,
} from "@/api/subcategories";
import { useGetAllSubjects } from "@/api/subjects";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    isActive,
    isSystemValue,
    Subcategory,
} from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
import {
    Dialog,
    PageTable,
    usePrompt,
    useSnackbar,
} from "@kl-engineering/kidsloop-px";
import { TableColumn } from "@kl-engineering/kidsloop-px/dist/types/components/Table/Common/Head";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import {
    Chip,
    DialogContentText,
    Paper,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
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

interface SubcategoryRow {
    id: string;
    name: string;
    categories: string[];
    subjects: string[];
    programs: string[];
    system: boolean;
}

interface Props {
    value?: Subcategory[];
    open: boolean;
    onClose: (value?: Subcategory[]) => void;
}

export default function SubcategoriesSelectDialog (props: Props) {
    const {
        value,
        open,
        onClose,
    } = props;
    const classes = useStyles();
    const prompt = usePrompt();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const {
        equals,
        letternumeric,
        max,
        required,
    } = useValidations();
    const [ updatedSubcategories, setUpdatedSubcategories ] = useState(value);
    const currentOrganization = useCurrentOrganization();
    const organizationId = currentOrganization?.id ?? ``;
    const [ createOrUpdateSubcategories ] = useCreateOrUpdateSubcategories();
    const [ deleteSubcategoryReq ] = useDeleteSubcategory();
    const { data: programsData } = useGetAllPrograms({
        variables: {
            organization_id: organizationId,
        },
        skip: !organizationId,
    });
    const { data: subjectsData } = useGetAllSubjects({
        variables: {
            organization_id: organizationId,
        },
        skip: !organizationId,
    });
    const { data: categoriesData } = useGetAllCategories({
        variables: {
            organization_id: organizationId,
        },
        skip: !organizationId,
    });
    const { data: subcategoriesData } = useGetAllSubcategories({
        nextFetchPolicy: `network-only`,
        variables: {
            organization_id: organizationId,
        },
        skip: !organizationId,
    });

    const programs = (programsData?.organization.programs ?? []).filter(isActive);
    const subjects = (subjectsData?.organization.subjects ?? []).filter(isActive);
    const categories = (categoriesData?.organization.categories ?? []).filter(isActive);
    const subcategories = (subcategoriesData?.organization.subcategories ?? []).filter(isActive);

    useEffect(() => {
        if (!open) return;
        setUpdatedSubcategories(value);
    }, [ open, value ]);

    const createSubcategory = async () => {
        const name = await prompt({
            title: intl.formatMessage({
                id: `subcategories_subcategoryNameLabel`,
            }),
            okLabel: `Create`,
            validations: [
                required(`The Subcategory name is required.`),
                letternumeric(intl.formatMessage({
                    id: `subcategoryNameValidations_letternumeric`,
                })),
                max(35, `The subategory name has a max length of 35 characters.`),
            ],
            label: `Name`,
        });
        if (!name) return;
        try {
            await createOrUpdateSubcategories({
                variables: {
                    organization_id: organizationId,
                    subcategories: [
                        {
                            name,
                        },
                    ],
                },
            });
            enqueueSnackbar(intl.formatMessage({
                id: `subcategories_subcategoryCreateMessage`,
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

    const deleteSubcategory = async (row: SubcategoryRow) => {
        if (!(await prompt({
            variant: `error`,
            title: intl.formatMessage({
                id: `generic_confirmDelete`,
            }),
            content: (
                <>
                    <DialogContentText>
                        {intl.formatMessage({
                            id: `generic_deleteText`,
                        }, {
                            value: row.name,
                        })}
                    </DialogContentText>
                    <DialogContentText>
                        {intl.formatMessage({
                            id: `generic_typeToRemovePrompt`,
                        }, {
                            value: <strong>{row.name}</strong>,
                        })}
                    </DialogContentText>
                </>
            ),
            okLabel: intl.formatMessage({
                id: `generic_deleteLabel`,
            }),
            validations: [ equals(row.name) ],
        }))) return;
        try {
            await deleteSubcategoryReq({
                variables: {
                    id: row.id,
                },
            });
            setUpdatedSubcategories((subcategories) => subcategories?.filter((subcategory) => subcategory.id !== row.id));
            enqueueSnackbar(intl.formatMessage({
                id: `subcategories_subcategoryDeleteMessage`,
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

    const rows: SubcategoryRow[] = subcategories.map((subcategory) => ({
        id: subcategory.id ?? ``,
        name: subcategory.name ?? ``,
        programs: uniq(programs.filter((program) => program.subjects?.filter(isActive).flatMap((subject) => subject.categories?.filter(isActive).flatMap((category) => category.subcategories?.filter(isActive) ?? [])).find((c) => c?.id === subcategory.id)).map((program) => program.name ?? ``)),
        subjects: uniq(subjects.filter((subject) => subject.categories?.filter(isActive).flatMap((category) => category.subcategories?.filter(isActive) ?? []).find((sc) => sc.id === subcategory.id)).map((subject) => subject.name ?? ``)),
        categories: uniq(categories.filter((category) => category.subcategories?.filter(isActive).find((sc) => sc.id === subcategory.id)).map((category) => category.name ?? ``)),
        system: subcategory.system ?? false,
    }));

    const columns: TableColumn<SubcategoryRow>[] = [
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
            render: (row) => (<>
                {row.programs.map((program, i) => (
                    <Chip
                        key={`program-${i}`}
                        label={program}
                        className={classes.chip}
                    />
                ))}
            </>),
        },
        {
            id: `subjects`,
            label: `Subjects using`,
            disableSort: true,
            render: (row) => (<>
                {row.subjects.map((subject, i) => (
                    <Chip
                        key={`subject-${i}`}
                        label={subject}
                        className={classes.chip}
                    />
                ))}
            </>),
        },
        {
            id: `categories`,
            label: `Categories using`,
            disableSort: true,
            render: (row) => (<>
                {row.categories.map((category, i) => (
                    <Chip
                        key={`category-${i}`}
                        label={category}
                        className={classes.chip}
                    />
                ))}
            </>),
        },
    ];

    return (
        <Dialog
            width="xl"
            open={open}
            title="Select Subcategories"
            actions={[
                {
                    label: `Cancel`,
                    color: `primary`,
                    onClick: () => onClose(),
                },
                {
                    label: `Select`,
                    color: `primary`,
                    disabled: !updatedSubcategories,
                    onClick: () => onClose(updatedSubcategories),
                },
            ]}
            onClose={() => onClose()}
        >
            <Paper>
                <PageTable
                    showSelectables
                    selectedRows={updatedSubcategories?.map((subcategory) => subcategory.id ?? ``)}
                    order="asc"
                    orderBy="name"
                    idField="id"
                    rows={rows}
                    columns={columns}
                    primaryAction={{
                        label: `Create Subcategory`,
                        icon: AddIcon,
                        onClick: createSubcategory,
                    }}
                    rowActions={(row) => [
                        {
                            label: intl.formatMessage({
                                id: `generic_deleteLabel`,
                            }),
                            icon: DeleteIcon,
                            disabled: isSystemValue(row),
                            onClick: deleteSubcategory,
                        },
                    ]}
                    localization={{
                        toolbar: {
                            title: `Subcategories`,
                        },
                    }}
                    onSelected={(rows: string[]) => {
                        const selectedSubcategories = subcategories.filter((subcategory) => rows.includes(subcategory.id ?? ``));
                        setUpdatedSubcategories(selectedSubcategories);
                    }}
                />
            </Paper>
        </Dialog>
    );
}
