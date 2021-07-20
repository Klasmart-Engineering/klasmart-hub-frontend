// import ClassesStep from "./Classes";
import SchoolInfoStep from "../SchoolInfo";
import SelectedProgramsSummary from "./SelectedPrograms";
import { School } from "@/types/graphQL";
import { EntityStepContent } from "@/utils/entitySteps";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

export default function SummaryStep (props: EntityStepContent<School>) {
    const { value } = props;
    const classes = useStyles();

    return (
        <>
            <SchoolInfoStep
                key={`schoolInfo-${JSON.stringify(value)}`}
                disabled
                value={value}
            />
            <SelectedProgramsSummary
                key={`selectedPrograms-${JSON.stringify(value)}`}
                disabled
                value={value}
            />
        </>
    );
}
