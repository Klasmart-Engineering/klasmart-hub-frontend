import { TabContent } from "./shared";
import { useGetAllSubjects } from "@/api/subjects";
import { currentMembershipVar } from "@/cache";
import SubjectsTable from "@/components/Subject/Table";
import { Subject } from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
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
    const { organization_id } = useReactiveVar(currentMembershipVar);
    const [ selectedSubjectIds, setSelectedIds ] = useState<string[]>(value.subjects?.map((subject) => subject.id ?? ``) ?? []);
    const { data: subjectsData } = useGetAllSubjects({
        variables: {
            organization_id,
        },
    });

    const allSubjects = subjectsData?.organization.subjects ?? [];
    const selectedSubjectsError = required()(value.subjects);

    useEffect(() => {
        onChange?.({
            ...value,
            subjects: selectedSubjectIds
                .map((subjectId) => allSubjects.find((subject) => subject.id === subjectId))
                .filter((subject): subject is Subject => !!subject),
        });
    }, [ selectedSubjectIds ]);

    return (
        <>
            <SubjectsTable
                disabled={disabled}
                showCheckboxes={!disabled}
                selectedIds={disabled ? undefined : selectedSubjectIds}
                subjects={disabled ? value.subjects : undefined}
                onSelected={setSelectedIds}
            />
            {!disabled && <FormHelperText error>{selectedSubjectsError === true ? ` ` : selectedSubjectsError}</FormHelperText>}
        </>
    );
}
