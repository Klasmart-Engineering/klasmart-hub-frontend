import { currentMembershipVar } from "@/cache";
import {
    Grade,
    Subject,
} from "@/types/graphQL";
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
    const [ gradeIds, setGradeIds ] = useState(value.grades?.map((grade) => grade.grade_id) ?? []);
    const [ gradeIdsValid, setGradeIdsValid ] = useState(true);
    const [ category, setCategory ] = useState(value.category ?? ``);
    const [ categoryValid, setCategoryValid ] = useState(true);
    const [ subcategories, setSubcategories ] = useState(value.subcategories?.map((subcategory) => subcategory) ?? []);
    const [ subcategoriesValid, setSubcategoriesValid ] = useState(true);
    const { required } = useValidations();
    const allGrades: Grade[] = [];
    const allCategories: string[] = [];
    const allSubcategories: string[] = [];

    useEffect(() => {
        onValidation([
            subjectNameValid,
            gradeIdsValid,
            categoryValid,
            subcategoriesValid,
        ].every((validation) => validation));
    }, [
        subjectNameValid,
        gradeIdsValid,
        categoryValid,
        subcategoriesValid,
    ]);

    useEffect(() => {
        const updatedSubject: Subject = {
            subject_id: value.subject_id,
            subject_name: subjectName,
            grades: gradeIds.map((gradeId) => ({
                grade_id: gradeId,
            })),
            category: category,
            subcategories: subcategories,
        };
        onChange(updatedSubject);
    }, [ subjectName, gradeIds ]);

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
                multiple
                fullWidth
                label="Grades"
                value={gradeIds}
                items={allGrades}
                itemText={(grade) => grade.grade_name ?? ``}
                itemValue={(grade) => grade.grade_id}
                onChange={setGradeIds}
                onValidate={setGradeIdsValid}
            />
            <Select
                fullWidth
                label="Category"
                value={category}
                items={allCategories}
                onChange={setCategory}
                onValidate={setCategoryValid}
            />
            <Select
                multiple
                fullWidth
                label="Subcategories"
                value={subcategories}
                items={allSubcategories}
                onChange={setSubcategories}
                onValidate={setSubcategoriesValid}
            />
        </div>
    );
}
