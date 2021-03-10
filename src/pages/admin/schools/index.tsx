import SchoolTable from "@/components/School/Table";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {

}

export default function SubjectsPage (props: Props) {
    const classes = useStyles();

    return (
        <SchoolTable />
    );

}
