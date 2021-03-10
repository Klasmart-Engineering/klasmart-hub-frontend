import { TabContent } from "./shared";
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
    const [ selectedProgramsIds, setSelectedIds ] = useState<string[]>(value.programs?.map((programItem) => programItem.program_id) ?? []);

    const selectedProgramssError = required()(value.programs);

    const programsData: Program[] = [
        {
            program_id: `1`,
            grades: [
                {
                    grade_id: `1`,
                    grade_name: `Grade 1`,
                },
            ],
            age_ranges: [
                {
                    age_range_id: `1`,
                    from: 0,
                    fromUnit: `year`,
                    to: 1,
                    toUnit: `year`,
                },
            ],
            program_name: `Hello`,
            subjects: [
                {
                    subject_id: `1`,
                    subject_name: `General`,
                    categories: [
                        {
                            id: `1`,
                            name: `Category 1`,
                            subcategories: [
                                {
                                    id: `1`,
                                    name: `Subcategory 1`,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    useEffect(() => {
        onChange?.({
            ...value,
            programs: selectedProgramsIds
                .map((programsId) => programsData?.find((program) => program.program_id === programsId))
                .filter((programItem): programItem is Program => !!programItem),
        });
    }, [ selectedProgramsIds ]);

    return (
        <>
            <ProgramsTable
                disabled={disabled}
                selectedIds={disabled ? undefined : selectedProgramsIds}
                programs={disabled ? value.programs : undefined}
                onSelected={setSelectedIds}
            />
            {!disabled && <FormHelperText error>{selectedProgramssError === true ? ` ` : selectedProgramssError}</FormHelperText>}
        </>
    );
}
