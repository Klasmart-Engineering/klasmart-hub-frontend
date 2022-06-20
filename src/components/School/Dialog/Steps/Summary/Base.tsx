// import ClassesStep from "./Classes";
import AcademicTermStep from "../AcademicTerm";
import SchoolInfoStep from "../SchoolInfo";
import { SchoolStepper } from "../shared";
import SelectedProgramsSummary from "./SelectedPrograms";
import { EntityStepContent } from "@/utils/entitySteps";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props extends EntityStepContent<SchoolStepper> {}

export default function SummaryStep (props: Props) {
    const { value } = props;
    const classes = useStyles();

    return (
        <>
            <SchoolInfoStep
                key={`schoolInfo-${value.id}`}
                disabled
                value={value}
            />
            <AcademicTermStep
                key={`academicTerm-${value.id}`}
                disabled
                value={value}
            />
            <SelectedProgramsSummary
                key={`selectedPrograms-${value.id}`}
                disabled
                programIds={value.programIds}
            />
        </>
    );
}
