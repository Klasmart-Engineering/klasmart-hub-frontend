import { TabContent } from "./shared";
import SubjectsTable from "@/components/Subject/Table";
import { Subject } from "@/types/graphQL";
import { buildEmptySubject } from "@/utils/subjects";
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
    const [ selectedSubjectIds, setSelectedIds ] = useState<string[]>(value.subjects?.map((subject) => subject.id ?? ``) ?? []);
    const [ selectedSubjectIdsError, setSelectedIdsError ] = useState(!value.subjects?.length ? `At least one subject is required` : ` `);
    const subjectsData: Subject[] = [
        buildEmptySubject({
            id: `1`,
            name: `General`,
        }),
        buildEmptySubject({
            id: `2`,
            name: `Toodles`,
        }),
    ];

    const selectedSubjectsError = required()(value.subjects);

    useEffect(() => {
        onChange?.({
            ...value,
            subjects: selectedSubjectIds
                .map((subjectId) => subjectsData.find((subject) => subject.id === subjectId))
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
