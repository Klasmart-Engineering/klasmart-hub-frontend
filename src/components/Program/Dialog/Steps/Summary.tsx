import ProgramInfo from "./ProgramInfo";
import Subjects from "./Subjects";
import { Program } from "@/types/graphQL";
import { EntityStepContent } from "@/utils/entitySteps";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

export default function SummaryStep (props: EntityStepContent<Program>) {
    const { value, loading } = props;

    const classes = useStyles();

    return (
        <>
            <ProgramInfo
                key={`programInfo-${JSON.stringify(value)}`}
                disabled
                value={value}
                loading={loading}
            />
            <Subjects
                key={`subjects-${JSON.stringify(value)}`}
                disabled
                value={value}
                loading={loading}
            />
        </>
    );
}
