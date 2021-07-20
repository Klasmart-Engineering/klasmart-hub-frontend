import { useGetAllSubjects } from "@/api/subjects";
import SubjectsTable from "@/components/Subject/Table";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import {
    isActive,
    Program,
    Subject,
} from "@/types/graphQL";
import { EntityStepContent } from "@/utils/entitySteps";
import { useValidations } from "@/utils/validations";
import {
    createStyles,
    FormHelperText,
    makeStyles,
} from "@material-ui/core";
import { isEqual } from "lodash";
import React,
{
    useEffect,
    useState,
} from "react";

const useStyles = makeStyles((theme) => createStyles({}));

export default function SubjectStep (props: EntityStepContent<Program>) {
    const {
        value,
        disabled,
        onChange,
    } = props;
    const classes = useStyles();
    const { required } = useValidations();
    const [ selectedSubjectIds, setSelectedSubjectIds ] = useState(value.subjects?.filter(isActive).map((subject) => subject.id ?? ``) ?? []);
    const currentOrganization = useCurrentOrganization();
    const { data } = useGetAllSubjects({
        variables: {
            organization_id: currentOrganization?.organization_id ?? ``,
        },
        skip: !currentOrganization?.organization_id,
    });

    const allSubjects = data?.organization.subjects?.filter(isActive) ?? [];

    const selectedSubjectsError = required()(selectedSubjectIds);

    const handleSelected = (ids: string[]) => {
        setSelectedSubjectIds(ids);
    };

    useEffect(() => {
        const updatedValue = {
            ...value,
            subjects: selectedSubjectIds
                .map((id) => allSubjects.find((subject) => subject.id === id))
                .filter((subject): subject is Subject => !!subject),
        };
        if (isEqual(value, updatedValue)) return;
        onChange?.(updatedValue);
    }, [ selectedSubjectIds ]);

    return (
        <>
            <SubjectsTable
                disabled={disabled}
                showSelectables={!disabled}
                selectedIds={disabled ? undefined : selectedSubjectIds}
                subjects={disabled ? value.subjects : undefined}
                onSelected={handleSelected}
            />
            {!disabled && <FormHelperText error>{selectedSubjectsError === true ? ` ` : selectedSubjectsError}</FormHelperText>}
        </>
    );
}
