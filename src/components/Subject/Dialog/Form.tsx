import CategorySelectDialog from "./CategorySelect";
import SubcategoriesSelectDialog from "./SubcategoriesSelect";
import {
    Category,
    isActive,
    Subcategory,
    Subject,
} from "@/types/graphQL";
import { buildEmptyCategory } from "@/utils/categories";
import { useValidations } from "@/utils/validations";
import {
    Add,
    ArrowDropDown,
    Delete,
} from "@mui/icons-material";
import {
    Box,
    Chip,
    FormHelperText,
    Theme,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import {
    Button,
    IconButton,
    TextField,
} from "@kl-engineering/kidsloop-px";
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
    selectButtonErrorMessage: {
        marginBottom: theme.spacing(0),
    },
    selectButtonError: {
        borderColor: theme.palette.error.light,
    },
    chip: {
        margin: theme.spacing(0.25),
    },
}));

interface Props {
    value: Subject;
    onChange: (value: Subject) => void;
    onValidation: (valid: boolean) => void;
    loading?: boolean;
}

export default function SubjectDialogForm (props: Props) {
    const {
        value,
        onChange,
        onValidation,
        loading,
    } = props;
    const classes = useStyles();
    const {
        letternumeric,
        max,
        min,
        required,
    } = useValidations();
    const intl = useIntl();
    const [ subjectName, setSubjectName ] = useState(value.name ?? ``);
    const [ subjectNameValid, setSubjectNameValid ] = useState(true);
    const [ subjectCategories, setSubjectCategories ] = useState(value.categories ?? []);
    const [ selectedCategoryIndex, setSelectedCategoryIndex ] = useState<number>();
    const [ selectedSubcategoriesIndex, setSelectedSubcategoriesIndex ] = useState<number>();

    useEffect(()=> {
        setSubjectName(value.name ?? ``);
        setSubjectCategories(value.categories ?? []);
    }, [ ]);

    const removeSubcategory = (category: Category, subcategory: Subcategory) => {
        setSubjectCategories((categories) => categories.map((c) => c.id === category.id
            ? {
                ...c,
                subcategories: c.subcategories?.filter((sc) => sc.id !== subcategory.id) ?? [],
            }
            : c));
    };

    useEffect(() => {
        const categoryInputs = [
            required()(subjectCategories),
            ...subjectCategories.map((category) => getCategoryError(category)),
            ...subjectCategories.flatMap((category) => getSubcategoriesError(category.subcategories ?? [])),
        ]
            .filter((error) => error)
            .filter((error): error is string => error !== true);
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

    const getCategoryError = (category: Category) => {
        return [
            required(`The Category name is required.`)(category.name),
            letternumeric()(category.name),
            max(35, `The category name has a max length of 35 characters.`)(category.name),
        ].find((error): error is string => error !== true);
    };

    const getSubcategoriesError = (subcategories: Subcategory[]) => {
        const error = min(1, `Minimum 1 subcategory is required.`)(subcategories);
        return error === true ? undefined : error;
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
                validations={[
                    required(`The subject name is required.`),
                    letternumeric(intl.formatMessage({
                        id: `subjectNameValidations_letternumeric`,
                    })),
                    max(35, `The subject name has a max length of 35 characters.`),
                ]}
                id="subjectName"
                loading={loading}
                disabled={loading}
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
                            mt={1}
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
                            <Typography
                                variant="caption"
                                color="textSecondary"
                            >
                                Category
                            </Typography>
                            <Button
                                fullWidth
                                size="large"
                                className={clsx({
                                    [classes.selectButtonError]: getCategoryError(category),
                                })}
                                variant="outlined"
                                icon={ArrowDropDown}
                                label={category.name}
                                onClick={() => setSelectedCategoryIndex(i)}
                            />
                            <FormHelperText
                                error
                                className={classes.selectButtonErrorMessage}
                            >
                                {getCategoryError(category) ?? ` `}
                            </FormHelperText>
                            <Typography
                                variant="caption"
                                color="textSecondary"
                            >
                                Subcategories
                            </Typography>
                            <Button
                                fullWidth
                                size="large"
                                className={clsx({
                                    [classes.selectButtonError]: getSubcategoriesError(category.subcategories ?? []),
                                })}
                                variant="outlined"
                                icon={ArrowDropDown}
                                disabled={!!category.system}
                                label={category.subcategories
                                    ? <Box
                                        flexWrap="wrap"
                                        display="flex"
                                        flexDirection="row"
                                        justifyContent="center"
                                    >
                                        {category.subcategories?.filter(isActive).map((subcategory) => (
                                            <Chip
                                                key={subcategory.id ?? ``}
                                                disabled={!!category.system}
                                                label={subcategory.name}
                                                className={classes.chip}
                                                onDelete={() => removeSubcategory(category, subcategory)}
                                            />
                                        ))}
                                    </Box>
                                    : ``
                                }
                                onClick={() => setSelectedSubcategoriesIndex(i)}
                            />
                            <FormHelperText
                                error
                                className={classes.selectButtonErrorMessage}
                            >
                                {getSubcategoriesError(category.subcategories ?? []) ?? ` `}
                            </FormHelperText>
                        </Box>
                        {subjectCategories.length > 1 && <Box
                            flex="0"
                            m={0.5}
                            pt={1}
                        >
                            <IconButton
                                icon={Delete}
                                tooltip="Remove"
                                size="medium"
                                onClick={() => {
                                    setSubjectCategories((subjectCategories) => [ ...subjectCategories.slice(0, i), ...subjectCategories.slice(i + 1, subjectCategories.length) ]);
                                }} />
                        </Box>}
                    </Box>
                    <CategorySelectDialog
                        value={category}
                        open={selectedCategoryIndex === i}
                        onClose={(value) => {
                            setSelectedCategoryIndex(undefined);
                            if (!value) return;
                            setSubjectCategories((categories) => categories.map((category, index) => index === i ? value : category));
                        }}
                    />
                    <SubcategoriesSelectDialog
                        value={category.subcategories ?? []}
                        open={selectedSubcategoriesIndex === i}
                        onClose={(value) => {
                            setSelectedSubcategoriesIndex(undefined);
                            if (!value) return;
                            setSubjectCategories((categories) => categories.map((category, index) => index === i ? {
                                ...category,
                                subcategories: value ?? [],
                            } : category));
                        }}
                    />
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
