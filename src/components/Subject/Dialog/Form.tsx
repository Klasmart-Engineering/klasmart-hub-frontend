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
    Box,
    Chip,
    createStyles,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import {
    Add,
    ArrowDropDown,
    Delete,
} from "@material-ui/icons";
import clsx from "clsx";
import {
    Button,
    IconButton,
    TextField,
} from "kidsloop-px";
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
    selectButton: {
        marginBottom: theme.spacing(1),
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
}

export default function SubjectDialogForm (props: Props) {
    const {
        value,
        onChange,
        onValidation,
    } = props;
    const classes = useStyles();
    const {
        required,
        letternumeric,
    } = useValidations();
    const intl = useIntl();
    const [ subjectName, setSubjectName ] = useState(value.name ?? ``);
    const [ subjectNameValid, setSubjectNameValid ] = useState(true);
    const [ subjectCategories, setSubjectCategories ] = useState(value.categories ?? []);
    const [ selectedCategoryIndex, setSelectedCategoryIndex ] = useState<number>();
    const [ selectedSubcategoriesIndex, setSelectedSubcategoriesIndex ] = useState<number>();

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
                                className={clsx(classes.selectButton, {
                                    [classes.selectButtonError]: !category.name,
                                })}
                                variant="outlined"
                                icon={ArrowDropDown}
                                label={category.name}
                                onClick={() => setSelectedCategoryIndex(i)}
                            />
                            <Typography
                                variant="caption"
                                color="textSecondary"
                            >
                                Subcategories
                            </Typography>
                            <Button
                                fullWidth
                                size="large"
                                className={clsx(classes.selectButton, {
                                    [classes.selectButtonError]: !category.subcategories?.length,
                                })}
                                variant="outlined"
                                icon={ArrowDropDown}
                                disabled={!!category.system}
                                label={category.subcategories
                                    ? <Box
                                        flexWrap="wrap"
                                        display="flex"
                                        flexDirection="row"
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
                        </Box>
                        {subjectCategories.length > 1 && <Box
                            flex="0"
                            m={0.5}
                            pt={1}
                        >
                            <IconButton
                                icon={Delete}
                                tooltip="Remove"
                                onClick={() => {
                                    setSubjectCategories((subjectCategories) => [ ...subjectCategories.slice(0, i), ...subjectCategories.slice(i + 1, subjectCategories.length) ]);
                                }}
                            />
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
