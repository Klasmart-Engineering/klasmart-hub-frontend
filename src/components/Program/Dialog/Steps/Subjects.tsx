import { TabContent } from "./shared";
import SubjectsTable from "@/components/Subject/Table";
import { Subject } from "@/types/graphQL";
import {
    createStyles,
    FormHelperText,
    makeStyles,
} from "@material-ui/core";
import React,
{
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme) => createStyles({}));

export default function SubjectStep (props: TabContent) {
    const {
        value,
        disabled,
        onChange,
    } = props;
    const classes = useStyles();
    const [ selectedSubjectIds, setSelectedIds ] = useState<string[]>(value.subjects?.map((subject) => subject.subject_id) ?? []);
    const [ selectedSubjectIdsError, setSelectedIdsError ] = useState(!value.subjects?.length ? `At least one subject is required` : ` `);
    const subjectsData: Subject[] = [
        {
            subject_id: `1`,
            subject_name: `General`,
            grades: [
                {
                    grade_id: `1`,
                    grade_name: `Grade 1`,
                },
            ],
            category: `Some Category`,
            subcategories: [ `Subcategory 1`, `Subcategory 2` ],
        },
        {
            subject_id: `2`,
            subject_name: `Toodles`,
            grades: [
                {
                    grade_id: `1`,
                    grade_name: `Grade 1`,
                },
            ],
            category: `Some Category`,
            subcategories: [ `Subcategory 1`, `Subcategory 2` ],
        },
    ];

    useEffect(() => {
        const error = !selectedSubjectIds.length ? `At least one subject is required` : ``;
        setSelectedIdsError(error);
        onChange?.({
            ...value,
            subjects: selectedSubjectIds
                .map((subjectId) => subjectsData.find((subject) => subject.subject_id === subjectId))
                .filter((subject): subject is Subject => !!subject),
        });
    }, [ selectedSubjectIds ]);

    return (
        <>
            <SubjectsTable
                disabled={disabled}
                selectedIds={disabled ? undefined : selectedSubjectIds}
                subjects={disabled ? value.subjects : undefined}
                onSelected={setSelectedIds}
            />
            {!disabled && <FormHelperText error>{selectedSubjectIdsError || ` `}</FormHelperText>}
        </>
    );
}
