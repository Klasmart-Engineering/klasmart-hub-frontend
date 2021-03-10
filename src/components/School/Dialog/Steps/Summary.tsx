import ClassesStep from "./Classes";
import ProgramsStep from "./Programs";
import SchoolInfoStep from "./SchoolInfo";
import { TabContent } from "./shared";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

export default function SummaryStep (props: TabContent) {
    const { value } = props;
    const classes = useStyles();

    return (
        <>
            <SchoolInfoStep
                disabled
                value={value}
            />
            <ProgramsStep
                disabled
                value={value}
            />
            <ClassesStep
                disabled
                value={value}
            />
        </>
    );
}
