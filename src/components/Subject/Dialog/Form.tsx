import { currentMembershipVar } from "@/cache";
import {
    AgeRange,
    Grade,
    Subject,
} from "@/types/graphQL";
import { buildAgeRangeLabel } from "@/utils/ageRanges";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core";
import {
    Select,
    TextField,
} from "kidsloop-px";
import React, {
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        "& > *": {
            marginBottom: theme.spacing(2),
        },
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
    const subjectes = useStyles();
    const organization = useReactiveVar(currentMembershipVar);
    const { organization_id } = organization;
    const [ subjectName, setSubjectName ] = useState(value.subject_name ?? ``);
    const [ subjectNameValid, setSubjectNameValid ] = useState(true);
    const [ categories, setCategories ] = useState(value.categories ?? []);
    const [ categoryValid, setCategoryValid ] = useState(true);
    const [ subcategories, setSubcategories ] = useState(value.categories?.flatMap((category) => category.subcategories ?? []) ?? []);
    const [ subcategoriesValid, setSubcategoriesValid ] = useState(true);
    const { required } = useValidations();
    const allCategories: string[] = [];
    const allSubcategories: string[] = [];

    useEffect(() => {
        onValidation([
            subjectNameValid,
            categoryValid,
            subcategoriesValid,
        ].every((validation) => validation));
    }, [
        subjectNameValid,
        categoryValid,
        subcategoriesValid,
    ]);

    useEffect(() => {
        const updatedSubject: Subject = {
            subject_id: value.subject_id,
            subject_name: subjectName,
            categories: categories,
        };
        onChange(updatedSubject);
    }, [
        subjectName,
        categories,
        subcategories,
    ]);

    return (
        <div className={subjectes.root}>
            <TextField
                fullWidth
                value={subjectName}
                label="Subject name"
                type="text"
                autoFocus={!value.subject_id}
                validations={[ required() ]}
                onChange={setSubjectName}
                onValidate={setSubjectNameValid}
            />
            <Select
                fullWidth
                label="Category"
                value={categories}
                items={allCategories}
                validations={[ required() ]}
                onChange={setCategories}
                onValidate={setCategoryValid}
            />
            <Select
                multiple
                fullWidth
                label="Subcategories"
                value={subcategories}
                items={allSubcategories}
                validations={[ required() ]}
                onChange={setSubcategories}
                onValidate={setSubcategoriesValid}
            />
        </div>
    );
}
