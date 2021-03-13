import { TabContent } from "./shared";
import { useGetAllPrograms } from "@/api/programs";
import { currentMembershipVar } from "@/cache";
import ProgramsTable from "@/components/Program/Table";
import { Program } from "@/types/graphQL";
import { useValidations } from "@/utils/validations";
import { useReactiveVar } from "@apollo/client";
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

export default function ProgramsStep (props: TabContent) {
    const {
        value,
        disabled,
        onChange,
    } = props;
    const classes = useStyles();
    const { organization_id } = useReactiveVar(currentMembershipVar);
    const { required } = useValidations();
    const [ selectedProgramIds, setSelectedIds ] = useState(value.programs?.map((program) => program.id).filter((id): id is string => !!id) ?? []);
    const { data: programsData } = useGetAllPrograms({
        variables: {
            organization_id,
        },
    });

    const allPrograms = programsData?.organization.programs ?? [];
    const selectedProgramssError = required()(value.programs);

    useEffect(() => {
        onChange?.({
            ...value,
            programs: selectedProgramIds
                .map((programsId) => allPrograms?.find((program) => program.id === programsId))
                .filter((programItem): programItem is Program => !!programItem),
        });
    }, [ selectedProgramIds ]);

    return (
        <>
            <ProgramsTable
                disabled={disabled}
                selectedIds={disabled ? undefined : selectedProgramIds}
                programs={disabled ? value.programs : undefined}
                onSelected={setSelectedIds}
            />
            {!disabled && <FormHelperText error>{selectedProgramssError === true ? ` ` : selectedProgramssError}</FormHelperText>}
        </>
    );
}
