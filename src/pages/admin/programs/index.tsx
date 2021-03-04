import ProgramTable from "@/components/Program/Table";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {

}

export default function ProgramsPage (props: Props) {
    const classes = useStyles();

    return (
        <ProgramTable />
    );

}
