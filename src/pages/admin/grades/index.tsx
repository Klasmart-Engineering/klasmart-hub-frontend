import GradeTable from "@/components/Grades/Table";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
}

export default function (props: Props) {
    const classes = useStyles();
    return (
        <GradeTable />
    );
}
