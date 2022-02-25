import ProgramInfoStep from "../ProgramInfo";
import SelectedSubjectsSummary from "./SelectedSubjects";
import { ProgramForm } from "@/api/programs";
import { EntityStepContent } from "@/utils/entitySteps";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

export default function SummaryStep (props: EntityStepContent<ProgramForm>) {
    const { value } = props;
    const classes = useStyles();

    return (
        <>
            <ProgramInfoStep
                key={`programInfo-${JSON.stringify(value)}`}
                disabled
                value={value}
            />
            <SelectedSubjectsSummary
                key={`selectedPrograms-${JSON.stringify(value)}`}
                disabled
                value={value}
            />
        </>
    );
}
