import ProgramInfo from "./ProgramInfo";
import { TabContent } from "./shared";
import Subjects from "./Subjects";
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
            <ProgramInfo
                disabled
                value={value}
            />
            <Subjects
                disabled
                value={value}
            />
        </>
    );
}
