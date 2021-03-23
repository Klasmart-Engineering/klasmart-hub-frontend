import {
    useCreateOrUpdateCategories,
    useDeleteCategory,
    useGetAllCategories,
} from "@/api/categories";
import {
    useDeleteSubcategory,
    useGetAllSubcategories,
} from "@/api/subcategories";
import { useGetAllSubjects } from "@/api/subjects";
import { currentMembershipVar } from "@/cache";
import CategoryComboBox from "@/components/Subject/CategoryComboBox";
import SubcategoryComboBox from "@/components/Subject/SubcategoryComboBox";
import {
    Category,
    NON_SPECIFIED,
    Status,
    Subcategory,
    Subject,
} from "@/types/graphQL";
import { buildEmptyCategory } from "@/utils/categories";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    Box,
    createStyles,
    DialogContentText,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import {
    Add,
    Delete,
    Lock,
} from "@material-ui/icons";
import {
    Button,
    IconButton,
    TextField,
    usePrompt,
    useSnackbar,
} from "kidsloop-px";
import { uniqBy } from "lodash";
import React, {
    Fragment,
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        "& > .MuiFormControl-root": {
            marginBottom: theme.spacing(2),
        },
    },
    categoryInput: {
        marginBottom: theme.spacing(2),
    },
}));

interface Props {
    value: Subject;
    onChange: (value: Subject) => void;
    onValidation: (valid: boolean) => void;
}

export default function SubjectDialogForm (props: Props) {
    const {
        value,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const organization = useReactiveVar(currentMembershipVar);
    const { enqueueSnackbar } = useSnackbar();
    const {
        required,
        equals,
        letternumeric,
    } = useValidations();
    const prompt = usePrompt();
    const intl = useIntl();
    const { organization_id } = organization;
    const [ subjectName, setSubjectName ] = useState(value.name ?? ``);
    const [ subjectNameValid, setSubjectNameValid ] = useState(true);
    const [ subjectCategories, setSubjectCategories ] = useState(value.categories ?? []);

    const { data: subjectsData, refetch: refetchSubjects } = useGetAllSubjects({
        fetchPolicy: `network-only`,
        variables: {
            organization_id,
        },
    });
    const { data: categoriesData, refetch: refetchCategories } = useGetAllCategories({
        fetchPolicy: `network-only`,
        variables: {
            organization_id,
        },
    });
    const { data: subcategoriesData, refetch: refetchSubcategories } = useGetAllSubcategories({
        fetchPolicy: `network-only`,
        variables: {
            organization_id,
        },
    });
    const [ deleteCategory ] = useDeleteCategory();
    const [ deleteSubcategory ] = useDeleteSubcategory();

    const subjects = subjectsData?.organization.subjects ?? [];
    const categories = categoriesData?.organization.categories ?? [];
    const subcategories = subcategoriesData?.organization.subcategories ?? [];

    const categoryIds = subjects.flatMap((subject) => subject.categories?.filter((category) => category.status === Status.ACTIVE).map((category) => category.id));

    const subcategoryIds = categories.flatMap((category) => category.subcategories?.filter((category) => category?.status === Status.ACTIVE).map((subcategory) => subcategory.id) ?? []);

    const allAvailableCategories = uniqBy(categories
        .filter((category) => category.status === Status.ACTIVE)
        .filter((category) => !categoryIds.includes(category.id) || !!category.system), `id`);

    const allAvailableSubcategories = uniqBy(subcategories
        .filter((subcategory) => subcategory.status === Status.ACTIVE)
        .filter((subcategory) => !subcategoryIds.includes(subcategory.id) || !!subcategory.system), `id`);

    useEffect(() => {
        const categoryInputs = [
            required()(subjectCategories),
            ...subjectCategories.map((category) => required()(category.name)),
            ...subjectCategories.map((category) => letternumeric()(category.name)),
            ...subjectCategories.map((category) => required()(category.subcategories)),
        ].filter((error): error is string => error !== true);
        onValidation([ subjectNameValid, categoryInputs.every((error) => !error) ].every((validation) => validation));
    }, [ subjectNameValid, subjectCategories ]);

    useEffect(() => {
        const updatedSubject: Subject = {
            id: value.id,
            name: subjectName,
            categories: subjectCategories,
        };
        onChange(updatedSubject);
    }, [ subjectName, subjectCategories ]);

    const handleChangeCategories = (changedCategory: Category, index: number) => {
        setSubjectCategories((categories) => categories.map((category, i) => i === index ? changedCategory : category));
    };

    const handleChangeSubcategories = (subcategories: Subcategory[], index: number) => {
        // const nonSpecifiedItemIndex = subcategories.findIndex((subcategory) => subcategory.name === NON_SPECIFIED && !!subcategory.system);
        // const updatedSubcategories = nonSpecifiedItemIndex !== -1 ? (nonSpecifiedItemIndex === 0 ? subcategories.slice(1) : subcategories.slice(nonSpecifiedItemIndex, nonSpecifiedItemIndex + 1)) : subcategories;
        setSubjectCategories((categories) => categories.map((category, i) => ({
            ...category,
            subcategories: i === index ? subcategories : category.subcategories,
        })));
    };

    const deleteCategoryItem = async (category: Category) => {
        if (!await prompt({
            variant: `error`,
            title: intl.formatMessage({
                id: `subjects_deleteCategoryLabel`,
            }),
            okLabel: intl.formatMessage({
                id: `generic_deleteLabel`,
            }),
            content: <>
                <DialogContentText>{intl.formatMessage({
                    id: `editDialog_deleteConfirm`,
                }, {
                    userName: category?.name,
                })}</DialogContentText>
                <DialogContentText>{intl.formatMessage({
                    id: `generic_typeText`,
                })} <strong>{category.name}</strong> {intl.formatMessage({
                    id: `generic_typeEndText`,
                })}</DialogContentText>
            </>,
            validations: [ required(), equals(category.name) ],
        })) return;
        if (!category.id) return;
        try {
            await deleteCategory({
                variables: {
                    id: category.id,
                },
            });
            await refetchSubjects();
            await refetchCategories();
            await refetchSubcategories();
            enqueueSnackbar(intl.formatMessage({
                id: `categories_categoriesDeletedMessage`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `categories_categoriesDeletedError`,
            }), {
                variant: `error`,
            });
        }
    };

    const deleteSubcategoryItem = async (subcategory: Subcategory) => {
        if (!await prompt({
            variant: `error`,
            title: intl.formatMessage({
                id: `subjects_deleteSubcategoryLabel`,
            }),
            okLabel: intl.formatMessage({
                id: `generic_deleteLabel`,
            }),
            content: <>
                <DialogContentText>{intl.formatMessage({
                    id: `editDialog_deleteConfirm`,
                }, {
                    userName: subcategory?.name,
                })}</DialogContentText>
                <DialogContentText>{intl.formatMessage({
                    id: `generic_typeText`,
                })} <strong>{subcategory.name}</strong> {intl.formatMessage({
                    id: `generic_typeEndText`,
                })}</DialogContentText>
            </>,
            validations: [ required(), equals(subcategory.name) ],
        })) return;
        try {
            await refetchSubjects();
            await refetchCategories();
            await refetchSubcategories();
            if (!subcategory.id) return;
            await deleteSubcategory({
                variables: {
                    id: subcategory.id,
                },
            });
            enqueueSnackbar(intl.formatMessage({
                id: `categories_categoriesDeletedMessage`,
            }), {
                variant: `success`,
            });
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `categories_categoriesDeletedError`,
            }), {
                variant: `error`,
            });
        }
    };

    return (
        <div className={classes.root}>
            <TextField
                fullWidth
                value={subjectName}
                label={intl.formatMessage({
                    id: `subjects_subjectNameLabel`,
                })}
                type="text"
                autoFocus={!value.id}
                validations={[ required(), letternumeric() ]}
                onChange={setSubjectName}
                onValidate={setSubjectNameValid}
            />
            {subjectCategories?.map((category, i) => (
                <Fragment key={`category-subcategory-${i}`}>
                    <Box
                        display="flex"
                        flexDirection="row"
                        mb={4}
                    >
                        {subjectCategories.length > 1 && <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="row"
                            mr={2}
                            style={{
                                height: 56,
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                            >
                                {i + 1}
                            </Typography>
                        </Box>}
                        <Box
                            display="flex"
                            flexDirection="column"
                            flex="1"
                        >
                            <CategoryComboBox
                                value={category}
                                items={[ category, ...allAvailableCategories ?? [] ].filter((subcategory) => subcategory.status === Status.ACTIVE)}
                                validations={[ required(), letternumeric() ]}
                                menuItemActions={(category) => [
                                    {
                                        icon: category.system ? Lock : Delete,
                                        disabled: !!category.system,
                                        onClick: (category) => deleteCategoryItem(category),
                                    },
                                ]}
                                onChange={(value) => handleChangeCategories(value, i)}
                            />
                            <SubcategoryComboBox
                                value={(category.subcategories ?? []).filter((subcategory) => subcategory.status === Status.ACTIVE)}
                                items={[ ...category.subcategories ?? [], ...allAvailableSubcategories ?? [] ].filter((subcategory) => subcategory.status === Status.ACTIVE)}
                                disabled={!!category.system}
                                validations={[ required() ]}
                                menuItemActions={(subcategory) => [
                                    {
                                        icon: subcategory.system ? Lock : Delete,
                                        disabled: !!subcategory.system,
                                        onClick: (subcategory) => deleteSubcategoryItem(subcategory),
                                    },
                                ]}
                                onChange={(value) => handleChangeSubcategories(value, i)}
                            />
                        </Box>
                        {subjectCategories.length > 1 && <Box
                            flex="0"
                            m={0.5}
                        >
                            <IconButton
                                icon={Delete}
                                onClick={() => {
                                    setSubjectCategories([ ...subjectCategories.slice(0, i), ...subjectCategories.slice(i + 1, subjectCategories.length) ]);
                                }}
                            />
                        </Box>}
                    </Box>
                </Fragment>
            ))}
            <Box ml={subjectCategories.length > 1 ? 3 : 0}>
                <Button
                    color="primary"
                    label={intl.formatMessage({
                        id: `subjects_addMoreCategoriesLabel`,
                    })}
                    variant="outlined"
                    icon={Add}
                    onClick={() => {
                        setSubjectCategories([ ...subjectCategories, buildEmptyCategory() ]);
                    }}
                />
            </Box>
        </div>
    );
}
