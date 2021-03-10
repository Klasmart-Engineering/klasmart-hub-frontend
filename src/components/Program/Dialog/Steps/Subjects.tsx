import { TabContent } from "./shared";
import SubjectsTable from "@/components/Subject/Table";
import { Subject } from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
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
    const { required } = useValidations();
    const [ selectedSubjectIds, setSelectedIds ] = useState<string[]>(value.subjects?.map((subject) => subject.subject_id) ?? []);
    const subjectsData: Subject[] = [
        {
            subject_id: `1`,
            subject_name: `General`,
            categories: [
                {
                    id: `1`,
                    name: `Some Category 1`,
                    subcategories: [
                        {
                            id: `1`,
                            name: `Subcategory 1`,
                        },
                        {
                            id: `3`,
                            name: `Subcategory 3`,
                        },
                    ],
                },
            ],
        },
        {
            subject_id: `2`,
            subject_name: `Toodles`,
            categories: [
                {
                    id: `2`,
                    name: `Some Category 2`,
                    subcategories: [
                        {
                            id: `2`,
                            name: `Subcategory 2`,
                        },
                        {
                            id: `4`,
                            name: `Subcategory 4`,
                        },
                    ],
                },
            ],
        },
    ];

    const selectedSubjectsError = required()(value.subjects);

    useEffect(() => {
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
            {!disabled && <FormHelperText error>{selectedSubjectsError === true ? ` ` : selectedSubjectsError}</FormHelperText>}
        </>
    );
}
