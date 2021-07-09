import AgeRangesTable from "@/components/AgeRanges/Table";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
}

export default function ClassesPage (props: Props) {
    const classes = useStyles();
    return (
        <AgeRangesTable />
    );
}
