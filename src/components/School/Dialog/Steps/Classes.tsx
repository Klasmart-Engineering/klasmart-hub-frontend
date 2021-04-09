import { TabContent } from "./shared";
import { useGetAllClasses } from "@/api/classes";
import ClassesTable from "@/components/Class/Table";
import { useCurrentOrganization } from "@/store/organizationMemberships";
import { Class } from "@/types/graphQL";
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

export default function ClassesStep (props: TabContent) {
    const {
        value,
        disabled,
        onChange,
    } = props;
    const classes = useStyles();
    const currentOrganization = useCurrentOrganization();
    const { required } = useValidations();
    const [ selectedClassesIds, setSelectedIds ] = useState(value.classes?.map((classItem) => classItem.class_id) ?? []);

    const { data: classesData } = useGetAllClasses({
        variables: {
            organization_id: currentOrganization?.organization_id ?? ``,
        },
    });

    const selectedClassessError = required()(value.classes);

    useEffect(() => {
        onChange?.({
            ...value,
            classes: selectedClassesIds
                .map((classesId) => classesData?.organization?.classes?.find((classItem) => classItem.class_id === classesId))
                .filter((classItem): classItem is Class => !!classItem),
        });
    }, [ selectedClassesIds ]);

    return (
        <>
            <ClassesTable
                disabled={disabled}
                selectedIds={disabled ? undefined : selectedClassesIds}
                classItems={disabled ? value.classes : undefined}
                onSelected={setSelectedIds}
            />
            {!disabled && <FormHelperText error>{selectedClassessError === true ? ` ` : selectedClassessError}</FormHelperText>}
        </>
    );
}
